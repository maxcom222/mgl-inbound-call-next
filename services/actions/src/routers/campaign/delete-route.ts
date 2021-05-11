/* eslint-disable id-blacklist */
/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
import { Request, Response } from 'express';
import gql from 'graphql-tag';

import { requestGQL } from '../../shared/http-client';
import { createOrUpdateWorkflow, deleteTaskQueue } from '../../shared/twilio';

const deleteCallRoute = async (
  queueSid: string,
  callId: number
): Promise<Record<string, any>> => {
  const DELETE_CAMPAIGN_CALL_ROUTES = gql`
    mutation delete_campaign_call_routes($callRouteId: Int!) {
      delete_contactcenter_campaign_call_routes(
        where: { callRouteId: { _eq: $callRouteId } }
      ) {
        affected_rows
        returning {
          id
        }
      }
    }
  `;

  const deleteCampaignCallRouteResponse = await requestGQL({
    query: DELETE_CAMPAIGN_CALL_ROUTES,
    isAdmin: true,
    variables: {
      callRouteId: callId
    }
  });

  console.log('deleteCampaignCallRouteResponse: ', deleteCampaignCallRouteResponse);

  const DELETE_CALL_ROUTES_QUERY = gql`
    mutation delete_call_routes($sid: String!) {
      delete_contactcenter_call_routes(
        where: { queueSid: { _eq: $sid } }
      ) {
        affected_rows
        returning {
          id
        }
      }
    }
  `;

  const deleteCallRouteResponse = await requestGQL({
    query: DELETE_CALL_ROUTES_QUERY,
    isAdmin: true,
    variables: {
      sid: queueSid,
    }
  });

  return deleteCallRouteResponse.delete_contactcenter_call_routes;
}

export const deleteCallRouteHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log('body', req.body);
  const queueSid = req.body.queueSid;

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

  console.log('selectTeamHander - appConfig', appConfig);

  const twilioConfig: Record<string, any> =
    appConfig.contactcenter_app_configuration.find(
      (e) => e.name === 'twilio'
    ) || {};

  console.log('twilioConfig', twilioConfig);

  const { workspaceSid } = twilioConfig?.data;

  try {
    const GET_CALL_ROUTES_QUERY = gql`
      query getCallRoutes($sid: String!) {
        contactcenter_call_routes(where: {queueSid: {_eq: $sid}}) {
          id
        }
      }
    `;

    const callRoutesResponse = await requestGQL({
      query: GET_CALL_ROUTES_QUERY,
      isAdmin: true,
      variables: {
        sid: queueSid
      }
    });

    console.log('callRouteResponse: ', callRoutesResponse.contactcenter_call_routes);

    const GET_CAMPAIGN_CALL_ROUTE = gql`
      query getCampaignCallRoute($callRouteId: Int!) {
        contactcenter_campaign_call_routes(where: {callRouteId: { _eq: $callRouteId }}) {
          campaignId
        }
      }
    `;

    const campaignIdResponse = await requestGQL({
      query: GET_CAMPAIGN_CALL_ROUTE,
      isAdmin: true,
      variables: {
        callRouteId: callRoutesResponse.contactcenter_call_routes[0].id
      }
    });

    console.log('campaign_call_route response:', campaignIdResponse.contactcenter_campaign_call_routes[0].campaignId);

    const GET_CAMPAIGN_QUERY = gql`
      query getCampaign($id: Int!) {
        contactcenter_campaigns(where: {id: {_eq: $id}}) {
          name
          workflowSid
        }
      }
    `;

    const campaignResponse = await requestGQL({
      query: GET_CAMPAIGN_QUERY,
      isAdmin: true,
      variables: {
        id: campaignIdResponse.contactcenter_campaign_call_routes[0].campaignId
      }
    });

    console.log('campaignResponse: ', campaignResponse.contactcenter_campaigns)

    const GET_ALL_CALL_ROUTE_QUERY = gql`
      query getAllCampaignCallRoute($campaignId: Int!) {
        contactcenter_campaign_call_routes(where: {campaignId: { _eq: $campaignId }}) {
          callRouteId
        }
      }
    `;

    const callRouteIdsResponse = await requestGQL({
      query: GET_ALL_CALL_ROUTE_QUERY,
      isAdmin: true,
      variables: {
        campaignId: campaignIdResponse.contactcenter_campaign_call_routes[0].campaignId
      }
    });

    console.log('callRouteIdsResponse: ', callRouteIdsResponse.contactcenter_campaign_call_routes);

    const queues = [];
    for (const item of callRouteIdsResponse.contactcenter_campaign_call_routes) {
      if (item.callRouteId !== callRoutesResponse.contactcenter_call_routes[0].id) {
        const GET_CALL_ROUTES = gql`
          query getCallRoutes($id: Int!) {
            contactcenter_call_routes(where: {id: {_eq: $id}}) {
              callTargetId
              queueSid
            }
          }
        `;

        const callRouteResponse = await requestGQL({
          query: GET_CALL_ROUTES,
          isAdmin: true,
          variables: {
            id: item.callRouteId
          }
        });

        const queue = {
          friendlyName: `${campaignResponse.contactcenter_campaigns[0].name as string}:${callRouteResponse.contactcenter_call_routes[0].callTargetId as number}:Queue`,
          filterFriendlyName: `${campaignResponse.contactcenter_campaigns[0].name as string}:${callRouteResponse.contactcenter_call_routes[0].callTargetId as number}`,
          expression: `campaignId == ${campaignIdResponse.contactcenter_campaign_call_routes[0].campaignId as number}`,
          targetWorkers: `id IN [${callRouteResponse.contactcenter_call_routes[0].callTargetId as number}]`,
          targetWorkerExpression: `task.campaignId == ${campaignIdResponse.contactcenter_campaign_call_routes[0].campaignId as number} AND worker.id == ${callRouteResponse.contactcenter_call_routes[0].callTargetId as number}`,
          targetQueuePriority: 1,
          taskQueueSid: callRouteResponse.contactcenter_call_routes[0].queueSid
        }
        queues.push(queue);
      }
    }

    console.log('queues ----------> ', queues);

    const workflow = {
      friendlyName: `${campaignResponse.contactcenter_campaigns[0].name as string}:Workflow`,
      sid: campaignResponse.contactcenter_campaigns[0].workflowSid,
    };

    const twilioResult = await createOrUpdateWorkflow(
      workspaceSid,
      workflow,
      queues
    );

    console.log(twilioResult);

    const deleteResult = await deleteTaskQueue(workspaceSid, queueSid);

    console.log('delete call route result -----> ', deleteResult);

    const DELETE_CALL_CONVERSATION_SETTINGS_QUERY = gql`
      mutation deleteCallConversationSettings($callRouteId: Int!) {
        delete_contactcenter_call_conversion_settings(where: {callRouteId: {_eq: $callRouteId}}) {
          affected_rows
          returning {
            id
          }
        }
      }
    `;

    const deleteCallConversationSettingResponse = await requestGQL({
      query: DELETE_CALL_CONVERSATION_SETTINGS_QUERY,
      isAdmin: true,
      variables: {
        callRouteId: callRoutesResponse.contactcenter_call_routes[0].id
      }
    });

    console.log('deleteCallConversationSettingResponse', deleteCallConversationSettingResponse);

    const deleteData = await deleteCallRoute(queueSid, callRoutesResponse.contactcenter_call_routes[0].id);

    console.log('deleteData', deleteData);
    res.status(201).json(deleteData);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }
};

export default deleteCallRouteHandler;
