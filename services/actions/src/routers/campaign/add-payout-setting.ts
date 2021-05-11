/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable id-blacklist */
import { Request, Response } from 'express';
import gql from 'graphql-tag';
import { requestGQL } from '../../shared/http-client';

export const addCampaignPayOutSettingHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log('req.body', req.body);
  const defaultPayoutSetting = req.body;

  try {
    const CREATE_DEFAULT_PAYOUT_SETTINGS_QUERY = gql`
      mutation add_default_payout_settings($object: contactcenter_default_payout_settings_insert_input!) {
        insert_contactcenter_default_payout_settings_one(object: $object) {
          id
        }
      }
    `;

    const defaultPayoutSettingResponse = await requestGQL({
      query: CREATE_DEFAULT_PAYOUT_SETTINGS_QUERY,
      isAdmin: true,
      variables: {
        object: {
          ...defaultPayoutSetting
        }
      }
    });

    const defaultPayoutSettingResult = defaultPayoutSettingResponse.insert_contactcenter_default_payout_settings_one;
    console.log('defaultPayoutSettingResult', defaultPayoutSettingResult);

    res.status(201).json(defaultPayoutSettingResult);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }
}

export default addCampaignPayOutSettingHandler;
