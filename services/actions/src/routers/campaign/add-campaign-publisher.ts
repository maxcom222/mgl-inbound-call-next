/* eslint-disable id-blacklist */
/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
import { Request, Response } from 'express';
import gql from 'graphql-tag';
import { requestGQL } from '../../shared/http-client';
import { buildNumberRecord, buy } from '../numbers/buy';

export const addCampaignPublisherHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {workflowSid, accountId, affiliates} = req.body;

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

  console.log('selectTeamHander - appConfig', appConfig);

  const twilioConfig: Record<string, any> =
    appConfig.contactcenter_app_configuration.find(
      (e) => e.name === 'twilio'
    ) || {};

  console.log('twilioConfig', twilioConfig);

  const { applicationSid } = twilioConfig?.data;

  try {
    const GET_CAMPAIGN_QUERY = gql`
      query getCampaignData($wflowSid: String!) {
        contactcenter_campaigns(
          where: {workflowSid: { _eq: $wflowSid }}
        ) {
          id
        }
      }
    `;

    const campaignIdResponse = await requestGQL({
      query: GET_CAMPAIGN_QUERY,
      isAdmin: true,
      variables: {
        wflowSid: workflowSid
      }
    });

    const campaignId = campaignIdResponse.contactcenter_campaigns[0].id;

    for (const affiliate of affiliates) {
      const { affiliateId, phoneNumber } = affiliate;
      const affiliatesData = { affiliateId, campaignId };

      const CREATE_CAMPAIGN_AFFILIATES = gql`
        mutation add_campaign_affiliates($object: contactcenter_campaign_affiliates_insert_input!) {
          insert_contactcenter_campaign_affiliates_one(object: $object) {
            id
          }
        }
      `;

      const campaignAffiliatesResponse = await requestGQL({
        query: CREATE_CAMPAIGN_AFFILIATES,
        isAdmin: true,
        variables: {
          object: {
            ...affiliatesData
          }
        }
      });

      console.log('campaignAffiliatesResponse', campaignAffiliatesResponse.insert_contactcenter_campaign_affiliates_one);

      await buy(phoneNumber, applicationSid);
      const record = buildNumberRecord(phoneNumber, affiliateId, accountId);
      record.campaignId = campaignId;
      const CREATE_CAMPAIGN_NUMBERS = gql`
        mutation add_numbers($object: contactcenter_numbers_insert_input!) {
          insert_contactcenter_numbers_one(object: $object) {
            id
          }
        }
      `;

      const createNumbersResponse = await requestGQL({
        query: CREATE_CAMPAIGN_NUMBERS,
        isAdmin: true,
        variables: {
          object: {
            ...record
          }
        }
      });

      console.log('createNumberResponse: ', createNumbersResponse.insert_contactcenter_numbers_one);

      res.status(201).json(createNumbersResponse);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }
}

export default addCampaignPublisherHandler;
