/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable id-blacklist */
import { Request, Response } from 'express';
import gql from 'graphql-tag';
import { requestGQL } from '../../shared/http-client';

import { Campaign } from '../../shared/queries/campaigns';
import { createOrUpdateWorkflow } from '../../shared/twilio';
export const setPriorityHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log('req.body', req.body);

  const { campaignId, callRouteId, priority } = req.body;

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
    const GET_CAMPAIGN = gql`
      query getCampaignBySid($id: Int!) {
        contactcenter_campaigns_by_pk(id: $id) {
          ...Campaign
        }
      }
      ${Campaign.fragments.campaign}
    `;

    const getCampaignByIdResponse = await requestGQL({
      query: GET_CAMPAIGN,
      isAdmin: true,
      variables: {
        id: campaignId
      }
    });

    const campaign = getCampaignByIdResponse.contactcenter_campaigns_by_pk;

    console.log('campaign', campaign);

    const GET_CAMPAIGN_CALL_ROUTE_QUERY = gql`
      query getCampaignCallRouteByCampaign($campaignId: Int!) {
        contactcenter_campaign_call_routes(where: { campaignId: { _eq: $campaignId } }) {
          callRouteId
        }
      }
    `;

    const campaignCallRouteResponse = await requestGQL({
      query: GET_CAMPAIGN_CALL_ROUTE_QUERY,
      isAdmin: true,
      variables: {
        campaignId: getCampaignByIdResponse.contactcenter_campaigns_by_pk.id,
      }
    });

    const campaignCallRoutes = campaignCallRouteResponse.contactcenter_campaign_call_routes;

    console.log('campaignCallRoutes', campaignCallRoutes);

    const queues = [];

    const GET_CALL_ROUTE_QUERY = gql`
      query getCallRouteById($id: Int!) {
        contactcenter_call_routes_by_pk(id: $id) {
          callTargetId
          queueSid
          priorityId
        }
      }
    `;

    for (const item of campaignCallRoutes) {
      let queue: Record<string, any> = {};

      const callRouteResponse = await requestGQL({
        query: GET_CALL_ROUTE_QUERY,
        isAdmin: true,
        variables: {
          id: item.callRouteId
        }
      });

      const callRoute = callRouteResponse.contactcenter_call_routes_by_pk
      console.log('callRouteResponse', callRoute);

      const GET_PRIORITY_QUERY = gql`
        query getRoutingPrioritiesById($id: Int!) {
          contactcenter_routing_priorities_by_pk(id: $id) {
            priority
          }
        }
      `;

      const priorityResponse = await requestGQL({
        query: GET_PRIORITY_QUERY,
        isAdmin: true,
        variables: {
          id: callRoute.priorityId
        }
      });

      const currentPriority = priorityResponse.contactcenter_routing_priorities_by_pk.priority;

      if (callRouteId === item.callRouteId) {
        queue = {
          friendlyName: `${campaign.name as string}: ${callRoute.callTargetId as number}:Queue`,
          filterFriendlyName:  `${campaign.name as string}:${callRoute.callTargetId as number}`,
          expression: `campaignId == ${campaign.id as number}`,
          targetWorkers: `id IN [${callRoute.callTargetId as number}]`,
          targetWorkerExpression: `task.campaignId == ${campaign.id as number} AND worker.id == ${callRoute.callTargetId as number}`,
          targetQueuePriority: priority,
          taskQueueSid: callRoute.queueSid,
        }
      } else {
        queue = {
          friendlyName: `${campaign.name as string}: ${callRoute.callTargetId as number}:Queue`,
          filterFriendlyName:  `${campaign.name as string}:${callRoute.callTargetId as number}`,
          expression: `campaignId == ${campaign.id as number}`,
          targetWorkers: `id IN [${callRoute.callTargetId as number}]`,
          targetWorkerExpression: `task.campaignId == ${campaign.id as number} AND worker.id == ${callRoute.callTargetId as number}`,
          targetQueuePriority: currentPriority,
          taskQueueSid: callRoute.queueSid,
        }
      }
      queues.push(queue);
    }
    const workflow = {
      friendlyName: `${campaign.name as string}:Workflow`,
      sid: campaign.workflowSid,
    };
    const updateWorkflowResult = await createOrUpdateWorkflow(
      workspaceSid,
      workflow,
      queues
    );

    console.log('updateWorkflowResult', updateWorkflowResult);

    const priorityIdResponse = await requestGQL({
      query: GET_CALL_ROUTE_QUERY,
      isAdmin: true,
      variables: {
        id: callRouteId
      }
    });

    const priorityId = priorityIdResponse.contactcenter_call_routes_by_pk.priorityId;

    const UPDATE_PRIORITY_QUERY = gql`
      mutation update_routing_priorities($id: Int!, $priorityValue: Int!) {
        update_contactcenter_routing_priorities(
          where: { id: { _eq: $id } }
          _set: {
            priority: $priorityValue
          }
        ) {
          affected_rows
          returning {
            id
          }
        }
      }
    `;

    const updatePriorityResponse = await requestGQL({
      query: UPDATE_PRIORITY_QUERY,
      isAdmin: true,
      variables: {
        id: priorityId,
        priorityValue: priority
      }
    });

    console.log('updatePriorityResponse:', updatePriorityResponse.update_contactcenter_routing_priorities);
    res.status(201).json(updatePriorityResponse);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }

}

export default setPriorityHandler;
