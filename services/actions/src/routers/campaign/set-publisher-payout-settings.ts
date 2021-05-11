/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable id-blacklist */
import { Request, Response } from 'express';
import gql from 'graphql-tag';
import { requestGQL } from '../../shared/http-client';

export const setCampaignPublisherPayoutSettingsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log('req.body', req.body);

  const { campaignId, affiliateId, payoutSettings } = req.body;

  try {
    const GET_CAMPAIGN_AFFILIATE_ID_QUERY = gql`
      query getCampaignAffiliateId($campaignId: Int!, $affiliateId: String!) {
        contactcenter_campaign_affiliates(
          where: {
            _and: [
              { campaignId: { _eq: $campaignId } }
              { affiliateId: { _eq: $affiliateId } }
            ]
          }
        ) {
          id
        }
      }
    `;

    const campaignAffiliateIdResponse = await requestGQL({
      query: GET_CAMPAIGN_AFFILIATE_ID_QUERY,
      isAdmin: true,
      variables: {
        campaignId,
        affiliateId,
      },
    });

    const campaignAffiliateId = campaignAffiliateIdResponse.contactcenter_campaign_affiliates[0].id;

    console.log('campaignAffiliateId', campaignAffiliateId);

    const GET_AFFILIATE_PAYOUT_SETTINGS_ID_QUERY = gql`
      query getAffiliatePayoutSettingsId($campaignAffiliateId: Int!) {
        contactcenter_affiliate_payout_setttings(
          where: { campaignAffiliateId: { _eq: $campaignAffiliateId } }
        ) {
          id
        }
      }
    `;

    const affiliatePayoutSettingsIdResponse = await requestGQL({
      query: GET_AFFILIATE_PAYOUT_SETTINGS_ID_QUERY,
      isAdmin: true,
      variables: {
        campaignAffiliateId
      }
    });

    const affiliatePayoutSettingsIdResults = affiliatePayoutSettingsIdResponse.contactcenter_affiliate_payout_setttings;
    console.log('affiliatePayoutSettingsIdResults', affiliatePayoutSettingsIdResults);

    for (const affiliatePayoutSettingsId of affiliatePayoutSettingsIdResults) {
      const GET_AFFILIATE_PAYOUT_SETTINGS_QUERY = gql`
        query getAffiliatePayoutSettingsById($id: Int!) {
          contactcenter_affiliate_payout_settings_by_pk(id: $id) {
            scheduleId
            deDupeSettingId    
          }
        }
      `;

      const affiliatePayoutSettingResponse = await requestGQL({
        query: GET_AFFILIATE_PAYOUT_SETTINGS_QUERY,
        isAdmin: true,
        variables: {
          id: affiliatePayoutSettingsId
        }
      });

      const affiliatePayoutSettingResult = affiliatePayoutSettingResponse.contactcenter_affiliate_payout_settings_by_pk;
      console.log('affiliatePayoutSettingResult', affiliatePayoutSettingResult);

      const GET_OPEN_SETTINGS_QUERY = gql`
        query getOpenSettings($scheduleId: Int!) {
          contactcenter_open_settings(
            where: { scheduleId: { _eq: $scheduleId } }
          ) {
            id
            openTimeId
            closeTimeId
          }
        }
      `;

      if (affiliatePayoutSettingResult.deDupeSettingId) {
        const DELETE_DUPLICATE_SETTINGS_QUERY = gql`
          mutation delete_contactcenter_duplicate_settings($id: Int!) {
            delete_contactcenter_duplicate_settings (
              where: { id: { _eq: $id } }
            ) {
              affected_rows
              returning {
                id
              } 
            }
          }
        `;

        const deleteDuplicateSettingsResponse = await requestGQL({
          query: DELETE_DUPLICATE_SETTINGS_QUERY,
          isAdmin: true,
          variables: {
            id: affiliatePayoutSettingResult.deDupeSettingId
          }
        });
        console.log('deleteDuplicateSettingsResponse', deleteDuplicateSettingsResponse);
      }

      if (affiliatePayoutSettingResult.scheduleId) {
        const openSetttingsResponse = await requestGQL({
          query: GET_OPEN_SETTINGS_QUERY,
          isAdmin: true,
          variables: {
            scheduleId: affiliatePayoutSettingResult.scheduleId,
          }
        });

        console.log('openSetttingsResponse --------> ', openSetttingsResponse.contactcenter_open_settings);

        const DELETE_OPEN_SETTINGS_QUERY = gql`
          mutation delete_open_settings($scheduleId: Int!) {
            delete_contactcenter_open_settings (
              where: { scheduleId: { _eq: $scheduleId } }
            ) {
              affected_rows
              returning {
                id
              }
            }
          }
        `;

        const deleteOpenSettingsResponse = await requestGQL({
          query: DELETE_OPEN_SETTINGS_QUERY,
          isAdmin: true,
          variables: {
            scheduleId: affiliatePayoutSettingResult.scheduleId,
          }
        });

        console.log('deleteOpenSettingsResponse ---------> ', deleteOpenSettingsResponse.delete_contactcenter_open_settings);

        const DELETE_OPERATION_TIMES_QUERY = gql`
          mutation delete_operation_times($id: Int!) {
            delete_contactcenter_operation_times(
              where: {id: { _eq: $id }}
            ) {
              affected_rows
              returning {
                id
              }
            }
          }
        `;

        for (const item of openSetttingsResponse.contactcenter_open_settings) {
          await requestGQL({
            query: DELETE_OPERATION_TIMES_QUERY,
            isAdmin: true,
            variables: {
              id: item.openTimeId,
            }
          });

          await requestGQL({
            query: DELETE_OPERATION_TIMES_QUERY,
            isAdmin: true,
            variables: {
              id: item.closeTimeId,
            }
          });
        }

        const DELETE_SCHEDULE_QUERY = gql`
          mutation delete_schedule($id: Int!) {
            delete_contactcenter_schedules_and_capacities (
              where: { id: { _eq: $id } }
            ) {
              affected_rows
              returning {
                id
              }
            }
          }
        `;

        const deleteScheduleResponse = await requestGQL({
          query: DELETE_SCHEDULE_QUERY,
          isAdmin: true,
          variables: {
            id: affiliatePayoutSettingResult.scheduleId,
          }
        });

        console.log('deleteScheduleResponse -------> ', deleteScheduleResponse);
      }

      const GET_AFFILIATE_PAYOUT_SETTING_CRITERIA_QUERY = gql`
        query getDefaultPayoutSettingCriteria($affPayoutSettingId: Int!) {
            contactcenter_affiliate_payout_setting_criteria(
            where: { affPayoutSettingId: { _eq: $affPayoutSettingId } }
            ) {
            id
            }
        }
      `;

      const getAffiliatePayoutSettingCriteriaResponse = await requestGQL({
        query: GET_AFFILIATE_PAYOUT_SETTING_CRITERIA_QUERY,
        isAdmin: true,
        variables: {
          affPayoutSettingId: affiliatePayoutSettingsId
        }
      });

      console.log('getDefaultPayoutSettingCriteriaResponse', getAffiliatePayoutSettingCriteriaResponse.contactcenter_affiliate_payout_setting_criteria);

      const GET_TAG_ROUTING_TABLES = gql`
        query getTagRoutingTables($affPayoutSettingCriteriaId: Int!) {
            contactcenter_tag_routing_tables(
            where: { affPayoutSettingCriteriaId: { _eq: $affPayoutSettingCriteriaId } }
            ) {
            id
            }
        }
      `;

      if (getAffiliatePayoutSettingCriteriaResponse.contactcenter_affiliate_payout_setting_criteria.length > 0) {
        const getTagRoutingTablesResponse = await requestGQL({
          query: GET_TAG_ROUTING_TABLES,
          isAdmin: true,
          variables: {
            affPayoutSettingCriteriaId: getAffiliatePayoutSettingCriteriaResponse.contactcenter_affiliate_payout_setting_criteria[0].id
          },
        });

        const DELETE_CRITERIAS_QUERY = gql`
          mutation deleteCriterias($tagRoutableRuleId: Int!) {
            delete_contactcenter_criterias(
              where: { tagRoutableRuleId: { _eq: $tagRoutableRuleId } }
            ) {
              affected_rows
              returning {
                id
              }
            }
          }
        `;

        const DELETE_TAG_ROUTING_TABLES = gql`
          mutation deleteTagRoutingTables($id: Int!) {
            delete_contactcenter_tag_routing_tables(
              where: { id: { _eq: $id } }
            ) {
              affected_rows
              returning {
                id
              }
            }
          }
        `;

        for (const item of getTagRoutingTablesResponse.contactcenter_tag_routing_tables) {
          await requestGQL({
            query: DELETE_CRITERIAS_QUERY,
            isAdmin: true,
            variables: {
              tagRoutableRuleId: item.id,
            }
          });
          await requestGQL({
            query: DELETE_TAG_ROUTING_TABLES,
            isAdmin: true,
            variables: {
              id: item.id
            }
          });
        }
      }

      const DELETE_AFFILIATE_PAYOUT_SETTINGS_QUERY = gql`
        mutation deleteDefaultPayoutSettings($id: Int!) {
          delete_contactcenter_affiliate_payout_settings(
            where: { id: { _eq: $id } }
          ) {
            affected_rows
            returning {
              id
            }
          }
        }
      `;

      const deleteDefaultPayoutSettingResponse = await requestGQL({
        query: DELETE_AFFILIATE_PAYOUT_SETTINGS_QUERY,
        isAdmin: true,
        variables: {
          id: affiliatePayoutSettingsId
        }
      });
      console.log('deleteDefaultPayoutSettingResponse', deleteDefaultPayoutSettingResponse);
    }

    for (const affiliatePayoutsetting of payoutSettings) {
      affiliatePayoutsetting.campaignAffiliateId = campaignAffiliateId;
      const CREATE_AFFILIATE_PAYOUT_SETTINGS_QUERY = gql`
        mutation add_affiliate_payout_settings($object: contactcenter_affiliate_payout_settings_insert_input!) {
          insert_contactcenter_affiliate_payout_settings_one(object: $object) {
            id
          }
        }
      `;

      const affiliatePayoutSettingResponse = await requestGQL({
        query: CREATE_AFFILIATE_PAYOUT_SETTINGS_QUERY,
        isAdmin: true,
        variables: {
          object: {
            ...affiliatePayoutsetting
          }
        }
      });

      const affiliatePayoutSettingResult = affiliatePayoutSettingResponse.insert_contactcenter_affiliate_payout_settings_one;

      console.log('affiliatePayoutSettingResult', affiliatePayoutSettingResult);
    }
    res.status(201).json("successfully set publisher payout Settings");
  } catch(error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }
}

export default setCampaignPublisherPayoutSettingsHandler;
