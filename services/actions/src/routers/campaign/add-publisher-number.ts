/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable id-blacklist */
import { Request, Response } from 'express';
import gql from 'graphql-tag';
import { requestGQL } from '../../shared/http-client';

export const addPublisherNumberHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log('req.body', req.body);

  const { workflowSid, affiliateId, phonenumberIds } = req.body;

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

    for (const phonenumberId of phonenumberIds) {
      const UPDATE_NUMBERS_QUERY = gql`
        mutation updateNumbers($id: Int!, $affiliateId: String, $campaignId: Int!) {
          update_contactcenter_numbers(
            where: { id: { _eq: $id } }
            _set: {
              affiliateId: $affiliateId,
              campaignId: $campaignId
            }
          ) {
            affected_rows
            returning {
              id
            }
          }
        }
      `;

      const updateNumbersResponse = await requestGQL({
        query: UPDATE_NUMBERS_QUERY,
        isAdmin: true,
        variables: {
          id: phonenumberId,
          affiliateId,
          campaignId
        }
      });
      console.log('updateNumbersResponse', updateNumbersResponse);
    }

    res.status(201).json("successfully added number to publisher");
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }
}

export default addPublisherNumberHandler;
