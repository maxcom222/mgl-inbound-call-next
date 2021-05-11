/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable id-blacklist */
import gql from "graphql-tag";
import { requestGQL } from "../../shared/http-client";
import { Request, Response } from 'express';

export const campaignSpamDetectionUpdateHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { workflowSid, blockDuplicatesForSeconds, trackAnonymous } = req.body;

  const spamDetectionSettings = {
    blockDuplicatesForSeconds,
    trackAnonymous
  };

  console.log('body', req.body);

  try {
    const GET_CAMPAIGN_QUERY = gql`
    query getCampaignByWorkflowSid($workflowSid: String!) {
      contactcenter_campaigns(
        where: { workflowSid: { _eq: $workflowSid } }
      ) {
        spamDetectionSettingsId
      }
    }
    `;

    const getCampaignByWorkflowSid = await requestGQL({
      query: GET_CAMPAIGN_QUERY,
      isAdmin: true,
      variables: {
        workflowSid,
      }
    });

    console.log("getCampaignByWorkflowSid ----------> ", getCampaignByWorkflowSid.contactcenter_campaigns[0].spamDetectionSettingsId);

    const UPDATE_CAMPAIGN_SPAM_DETECTION = gql`
      mutation update_campaign_spam_detection($spamDetectionId: Int!, $object: contactcenter_spam_detection_settings_set_input!) {
        update_contactcenter_spam_detection_settings(
          where: { id: { _eq: $spamDetectionId } },
          _set: $object
        ) {
          affected_rows
          returning {
            id
          }
        }
      }
    `;

    const updateSpamDetectionResponse = await requestGQL({
      query: UPDATE_CAMPAIGN_SPAM_DETECTION,
      isAdmin: true,
      variables: {
        spamDetectionId: getCampaignByWorkflowSid.contactcenter_campaigns[0].spamDetectionSettingsId,
        object: {
          ...spamDetectionSettings
        },
      },
    });

    const updateSpamDetection = updateSpamDetectionResponse.update_contactcenter_spam_detection_settings;

    console.log("updateSpamDetection ----------> ", updateSpamDetection);

    res.status(201).json(updateSpamDetection);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }
}

export default campaignSpamDetectionUpdateHandler;
