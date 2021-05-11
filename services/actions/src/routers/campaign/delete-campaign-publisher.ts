/* eslint-disable id-blacklist */
/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
import { Request, Response } from 'express';
import gql from 'graphql-tag';
import { requestGQL } from '../../shared/http-client';

export const deleteCampaignPublisherHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log('req.body', req.body);

  const { workflowSid, affiliateId } = req.body;

  try {
    const GET_CAMPAIGN_QUERY = gql`
      query getCampaignData($wflowSid: String!) {
        contactcenter_campaigns(
          where: { workflowSid: { _eq: $wflowSid } }
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

    console.log("campaignIdResponse.contactcenter_campaigns", campaignIdResponse.contactcenter_campaigns);
    const campaignId = campaignIdResponse.contactcenter_campaigns[0].id;

    const GET_CAMPAIGN_AFFILIATE_QUERY = gql`
      query getCampaignAffiliateData($campaignId: Int!, $affiliateId: uuid!) {
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

    const getCampaignAffiliateResponse = await requestGQL({
      query: GET_CAMPAIGN_AFFILIATE_QUERY,
      isAdmin: true,
      variables: {
        campaignId,
        affiliateId
      }
    });

    for (const campaignAffiliate of getCampaignAffiliateResponse.contactcenter_campaign_affiliates) {
      const GET_AFFILIATE_PAYOUT_SETTINGS_QUERY = gql`
        query getAffiliatePayoutSettings($campaignAffiliateId: Int!) {
          contactcenter_affiliate_payout_settings(
            where: { campaignAffiliateId: { _eq: $campaignAffiliateId } }
          ) {
            id
            scheduleId
            deDupeSettingId
          }
        }
      `;

      const affiliatePayoutSettingResponse = await requestGQL({
        query: GET_AFFILIATE_PAYOUT_SETTINGS_QUERY,
        isAdmin: true,
        variables: {
          campaignAffiliateId: campaignAffiliate.id
        }
      });

      const affiliatePayoutSettingResult = affiliatePayoutSettingResponse.contactcenter_affiliate_payout_settings;
      console.log('affiliatePayoutSettingResponse', affiliatePayoutSettingResponse.contactcenter_affiliate_payout_settings);

      for (const affiliatePayoutSetting of affiliatePayoutSettingResult) {
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

        if (affiliatePayoutSetting.deDupeSettingId) {
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
              id: affiliatePayoutSetting.deDupeSettingId
            }
          });

          console.log('deleteDuplicateSettingsResponse', deleteDuplicateSettingsResponse);
        }

        if (affiliatePayoutSetting.scheduleId) {
          const openSetttingsResponse = await requestGQL({
            query: GET_OPEN_SETTINGS_QUERY,
            isAdmin: true,
            variables: {
              scheduleId: affiliatePayoutSetting.scheduleId,
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
              scheduleId: affiliatePayoutSetting.scheduleId,
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
              id: affiliatePayoutSetting.scheduleId,
            }
          });

          console.log('deleteScheduleResponse -------> ', deleteScheduleResponse);

          const GET_AFFILIATE_PAYOUT_SETTING_CRITERIA_QUERY = gql`
            query getAffiliatePayoutSettingCriteria($affPayoutSettingId: Int!) {
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
              affPayoutSettingId: affiliatePayoutSetting.id
            }
          });

          console.log('getAffiliatePayoutSettingCriteriaResponse', getAffiliatePayoutSettingCriteriaResponse.contactcenter_affiliate_payout_setting_criteria);

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
            const getTagRoutingTableResponse = await requestGQL({
              query: GET_TAG_ROUTING_TABLES,
              isAdmin: true,
              variables: {
                affPayoutSettingCriteriaId: getAffiliatePayoutSettingCriteriaResponse.contactcenter_affiliate_payout_setting_criteria[0].id
              }
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

            for (const item of getTagRoutingTableResponse.contactcenter_tag_routing_tables) {
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

          const DELETE_CAMPAIGN_AFFILIATES_QUERY = gql`
            mutation deleteCampaignAffiliates($campaignId: Int!, $affiliateId: uuid) {
              delete_contactcenter_campaign_affiliates(
                where: {
                  _and: [
                    { campaignId: { _eq: $campaignId } }
                    { affiliateId: { _eq: $affiliateId } }
                  ]
                }
              ) {
                affected_rows
                returning {
                  id
                }
              }
            }
          `;

          const deleteCampaignAffiliateResponse = await requestGQL({
            query: DELETE_CAMPAIGN_AFFILIATES_QUERY,
            isAdmin: true,
            variables: {
              campaignId,
              affiliateId
            }
          });

          console.log('deleteCampaignAffiliateResponse', deleteCampaignAffiliateResponse.delete_contactcenter_campaign_affiliates);
        }
      }
    }

    const GET_NUMBER_IDS_QUERY = gql`
      query contactcenter_numbers($affiliateId: uuid!, $campaignId: Int!) {
        contactcenter_numbers(
          where: {
            _and: [
              { affiliateId: { _eq: $affiliateId } }
              { campaignId: { _eq: $campaignId } }
            ]
          }
        ) {
          id
        }
      }
    `;

    const numbersResponse = await requestGQL({
      query: GET_NUMBER_IDS_QUERY,
      isAdmin: true,
      variables: {
        affiliateId,
        campaignId
      }
    });

    const phoneNumberIds = numbersResponse.contactcenter_numbers;
    console.log('phoneNumberIds', phoneNumberIds);

    for (const phoneNumberId of phoneNumberIds) {
      const UPDATE_PHONE_NUMBER_QUERY = gql`
        mutation update_phone_number_query($id: Int!) {
          update_contactcenter_numbers(
            where: { id: { _eq: $id } }
            _set: {
              campaignId: null,
              affiliateId: null
            }
          ) {
            affected_rows
            returning {
              id
            }
          }
        }
      `;

      const updatePhoneNumberResponse = await requestGQL({
        query: UPDATE_PHONE_NUMBER_QUERY,
        isAdmin: true,
        variables: {
          id: phoneNumberId.id
        }
      });

      console.log('updatePhoneNumberResponse', updatePhoneNumberResponse.update_contactcenter_numbers);
    }
    res.status(201).json("successfully deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }

}