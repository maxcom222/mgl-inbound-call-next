/* eslint-disable functional/no-loop-statement */
import { Request, Response } from 'express';
import gql from 'graphql-tag';

import { Campaign } from '../../shared/queries/campaigns';

import { createOrUpdateQueue, createOrUpdateWorkflow } from '../../shared/twilio';
import { requestGQL } from '../../shared/http-client';

const save = async (
  record: Record<string, any>
): Promise<Record<string, any>> => {
  const ADD_CAMPAIGN_CALL_ROUTE = gql`
    mutation addCampaignCallRoute(
      $object: contactcenter_campaign_call_routes_insert_input!
    ) {
      insert_contactcenter_campaign_call_routes_one(object: $object) {
        route {
          id
        }
      }
    }
  `;
  const campaignCallRouteRecordResponse = await requestGQL({
    query: ADD_CAMPAIGN_CALL_ROUTE,
    isAdmin: true,
    variables: {
      object: {
        ...record,
      },
    },
  });

  const campaignCallRouteRecord =
    campaignCallRouteRecordResponse.insert_contactcenter_campaign_call_routes_one;

  return campaignCallRouteRecord;
};

export const addCampaignRouteHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { targetId, campaignId, accountId } = req.body;

  console.log('body', req.body);

  const APP_CONFIG_QUERY = gql`
    query getAppConfig {
      contactcenter_app_configuration {
        name
        data
      }
    }
  `;

  const appConfig = await requestGQL({
    query: APP_CONFIG_QUERY,
    isAdmin: true,
    variables: {},
  });

  console.log('addCampaignRouteHandler - appConfig', appConfig);

  const twilioConfig: Record<string, any> =
    appConfig.contactcenter_app_configuration.find(
      (e) => e.name === 'twilio'
    ) || {};

  console.log('twilioConfig', twilioConfig);

  const { workspaceSid } = twilioConfig?.data;

  try {
    const GET_CAMPAIGN = gql`
      query getCampaignById($id: Int!) {
        contactcenter_campaigns_by_pk(id: $id) {
          ...Campaign
        }
      }
      ${Campaign.fragments.campaign}
    `;

    const getCampaignRecord = await requestGQL({
      query: GET_CAMPAIGN,
      isAdmin: true,
      variables: {
        id: campaignId,
      },
    });

    const campaignRecord = getCampaignRecord.contactcenter_campaigns_by_pk;

    console.log('campaignRecord', campaignRecord);

    const queue: Record<string, any> = {
      friendlyName: `${campaignRecord.name as string}:${
        targetId as number
      }:Queue`,
      filterFriendlyName: `${campaignRecord.name as string}:${
        targetId as number
      }`,
      expression: `campaignId == ${campaignRecord.id as number}`,
      targetWorkers: `id IN [${targetId as number}]`,
      targetWorkerExpression: `task.campaignId == ${
        campaignRecord.id as number
      } AND worker.id == ${targetId as number}`,
      targetQueuePriority: 1,
    };

    const addQueueResult = await createOrUpdateQueue(workspaceSid, queue);
    queue.taskQueueSid = addQueueResult.queueSid;

    const GET_CAMPAIGN_CALL_ROUTE_QUERY = gql`
      query getCampaignCallRoute($campId: Int!) {
        contactcenter_campaign_call_routes(where: {campaignId: { _eq: $campId }}) {
          callRouteId
        }
      }
    `;

    const callRouteIdResponse = await requestGQL({
      query: GET_CAMPAIGN_CALL_ROUTE_QUERY,
      isAdmin: true,
      variables: {
        campId: campaignId
      }
    });

    console.log('callRouteIdResponse:', callRouteIdResponse.contactcenter_campaign_call_routes[0].callRouteId);

    const GET_CALL_ROUTE_QUERY = gql`
      query getCallRoute($id: Int!) {
        contactcenter_call_routes(where: { id: {_eq: $id} }) {
          callTargetId
          queueSid
        }
      } 
    `;

    const targetIdResponse = await requestGQL({
      query: GET_CALL_ROUTE_QUERY,
      isAdmin: true,
      variables: {
        id: callRouteIdResponse.contactcenter_campaign_call_routes[0].callRouteId
      }
    });

    console.log('targetIdResponse: ', targetIdResponse.contactcenter_call_routes);

    const queues = [];
    for (const item of targetIdResponse.contactcenter_call_routes) {
      const oldQueue = {
        friendlyName: `${campaignRecord.name as string}:${
          item.callTargetId as number
        }:Queue`,
        filterFriendlyName: `${campaignRecord.name as string}:${
          item.callTargetId as number
        }`,
        expression: `campaignId == ${campaignRecord.id as number}`,
        targetWorkers: `id IN [${item.callTargetId as number}]`,
        targetWorkerExpression: `task.campaignId == ${
          campaignRecord.id as number
        } AND worker.id == ${item.callTargetId as number}`,
        targetQueuePriority: 1,
        taskQueueSid: item.queueSid,
      }
      queues.push(oldQueue);
    }

    queues.push(queue);

    const workflow = {
      friendlyName: `${campaignRecord.name as string}:Workflow`,
      sid: campaignRecord.workflowSid,
    };

    const updateWorkflowResult = await createOrUpdateWorkflow(
      workspaceSid,
      workflow,
      queues
    );

    console.log('updateWorkflowResult', updateWorkflowResult);

    const routeData = {
      campaignId: campaignRecord.id,
      route: {
        data: {
          priority: { data: { priority: 1, weight: 1 } },
          callTargetId: targetId,
          conversionSettings: {
            data: [
              {
                conversionValue: 0.0,
                payoutValue: 0.0,
                deDupeSetting: { data: { secondsFromLastCall: 0 } },
                conversionType: 'connectedCall',
              },
            ],
          },
          name: `${campaignRecord.name as string}:${targetId as number}`,
          accountId,
          queueSid: addQueueResult.queueSid,
        },
      },
    };

    console.log("routeData ------------> ", routeData);
    const campaignCallRouteRecord = await save(routeData);

    console.log('Campaign updated with Twilio', campaignCallRouteRecord);
    res.status(201).json(campaignCallRouteRecord);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }
};

export default addCampaignRouteHandler;
