/* eslint-disable functional/no-loop-statement */

import gql from "graphql-tag";
import { requestGQL } from "../../shared/http-client";
import { Request, Response } from 'express';
import { deleteWorkflow } from "../../shared/twilio";

const deleteCampaign = async (
  sid: string
): Promise<Record<string, any>> => {
  const GET_CAMPAIGN_QUERY = gql`
    query getCampaignByWorkflowSid($workflowSid: String!) {
      contactcenter_campaigns(
        where: { workflowSid: { _eq: $workflowSid } }
      ) {
        id
      }
    }
  `;

  const getCampaignByWorkflowSid = await requestGQL({
    query: GET_CAMPAIGN_QUERY,
    isAdmin: true,
    variables: {
      workflowSid: sid,
    }
  });

  console.log("getCampaignByWorkflowSid ----------> ", getCampaignByWorkflowSid.contactcenter_campaigns[0].id);

  const DELETE_CAMPAIGN_AFFILIATES = gql`
    mutation delete_campaign_affiliates($campaignId: Int!) {
      delete_contactcenter_campaign_affiliates(
        where: { campaignId: { _eq: $campaignId } }
      ) {
        affected_rows
        returning {
          id
        }
      }
    }
  `;

  const deleteCampaignAffiliatesResponse = await requestGQL({
    query: DELETE_CAMPAIGN_AFFILIATES,
    isAdmin: true,
    variables: {
      campaignId: getCampaignByWorkflowSid.contactcenter_campaigns[0].id,
    }
  });

  console.log("deleteCampaignAffiliatesResponse -----------> ", deleteCampaignAffiliatesResponse)

  const DELETE_CAMPAIGN_CALL_ROUTES = gql`
    mutation delete_campaign_call_routes($campaignId: Int!) {
      delete_contactcenter_campaign_call_routes(
        where: { campaignId: { _eq: $campaignId } }
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
      campaignId: getCampaignByWorkflowSid.contactcenter_campaigns[0].id,
    }
  });

  console.log("deleteCampaignCallRouteResponse ------------> ", deleteCampaignCallRouteResponse);

  const DELETE_NUMBERS = gql`
    mutation delete_numbers($campaignId: Int!) {
      delete_contactcenter_numbers(
        where: { campaignId: { _eq: $campaignId } }
      ) {
        affected_rows
        returning {
          id
        }
      }
    }
  `;

  const deleteNumbers = await requestGQL({
    query: DELETE_NUMBERS,
    isAdmin: true,
    variables: {
      campaignId: getCampaignByWorkflowSid.contactcenter_campaigns[0].id,
    }
  });

  console.log("deleteNumbers -------> ", deleteNumbers);

  const DELETE_CAMPAIGN_QUERY = gql`
    mutation delete_campaign($workflowSid: String!) {
      delete_contactcenter_campaigns(
        where: { workflowSid: { _eq: $workflowSid } },
      ) {
        affected_rows
        returning {
          id
        }
      }
    }
  `;
  const deleteCampaignResponse = await requestGQL({
    query: DELETE_CAMPAIGN_QUERY,
    isAdmin: true,
    variables: {
      workflowSid: sid
    },
  });

  const deleteResult = deleteCampaignResponse.delete_contactcenter_campaigns;

  console.log("deleteResult ----------> ", deleteResult);

  return deleteResult;
}

export const campaignDeleteHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const sid = req.body.workflowSid;

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
    const deleteResult = await deleteWorkflow(workspaceSid, sid);

    console.log("campaign delete result -----------> ", deleteResult);

    const deleteData = await deleteCampaign(sid);
    console.log('deleteData', deleteData);
    console.log('campaign delete with Twilio', deleteData);
    res.status(201).json(deleteData);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }
}

export default campaignDeleteHandler;
