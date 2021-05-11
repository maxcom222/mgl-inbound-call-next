/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable id-blacklist */
import { Request, Response } from 'express';
import gql from 'graphql-tag';
import { requestGQL } from '../../shared/http-client';

export const deleteCampaignPayoutSettingHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log('req.body', req.body);

  const { defaultPyaoutSettingId } = req.body;

  try {
    const GET_DEFAULT_PAYOUT_SETTINGS_QUERY = gql`
      query getDefaultPayoutSettingById($id: Int!) {
        contactcenter_default_payout_settings_by_pk(id: $id) {
          scheduleId
          deDupeSettingId
        }
      }
    `;

    const defaultPayoutSettingResponse = await requestGQL({
      query: GET_DEFAULT_PAYOUT_SETTINGS_QUERY,
      isAdmin: true,
      variables: {
        id: defaultPyaoutSettingId
      }
    });

    const defaultPayoutSettingResult = defaultPayoutSettingResponse.contactcenter_default_payout_settings_by_pk;
    console.log('defaultPayoutSettingResponse', defaultPayoutSettingResult);

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

    if (defaultPayoutSettingResult.deDupeSettingId) {
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
          id: defaultPayoutSettingResult.deDupeSettingId
        }
      });

      console.log('deleteDuplicateSettingsResponse', deleteDuplicateSettingsResponse);
    }

    if (defaultPayoutSettingResult.scheduleId) {
      const openSetttingsResponse = await requestGQL({
        query: GET_OPEN_SETTINGS_QUERY,
        isAdmin: true,
        variables: {
          scheduleId: defaultPayoutSettingResult.scheduleId,
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
          scheduleId: defaultPayoutSettingResult.scheduleId,
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
          id: defaultPayoutSettingResult.scheduleId,
        }
      });

      console.log('deleteScheduleResponse -------> ', deleteScheduleResponse);
    }

    const GET_DEFAULT_PAYOUT_SETTING_CRITERIA_QUERY = gql`
      query getDefaultPayoutSettingCriteria($dePayoutSettingId: Int!) {
        contactcenter_default_payout_setting_criteria(
          where: { dePayoutSettingId: { _eq: $dePayoutSettingId } }
        ) {
          id
        }
      }
    `;

    const getDefaultPayoutSettingCriteriaResponse = await requestGQL({
      query: GET_DEFAULT_PAYOUT_SETTING_CRITERIA_QUERY,
      isAdmin: true,
      variables: {
        dePayoutSettingId: defaultPyaoutSettingId
      }
    });

    console.log('getDefaultPayoutSettingCriteriaResponse', getDefaultPayoutSettingCriteriaResponse.contactcenter_default_payout_setting_criteria);

    const GET_TAG_ROUTING_TABLES = gql`
      query getTagRoutingTables($dePayoutSettingCriteriaId: Int!) {
        contactcenter_tag_routing_tables(
          where: { dePayoutSettingCriteriaId: { _eq: $dePayoutSettingCriteriaId } }
        ) {
          id
        }
      }
    `;

    if (getDefaultPayoutSettingCriteriaResponse.contactcenter_default_payout_setting_criteria.length > 0) {
      const getTagRoutingTablesResponse = await requestGQL({
        query: GET_TAG_ROUTING_TABLES,
        isAdmin: true,
        variables: {
          dePayoutSettingCriteriaId: getDefaultPayoutSettingCriteriaResponse.contactcenter_default_payout_setting_criteria[0].id
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

    const DELETE_DEFAULT_PAYOUT_SETTINGS_QUERY = gql`
      mutation deleteDefaultPayoutSettings($id: Int!) {
        delete_contactcenter_default_payout_settings(
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
      query: DELETE_DEFAULT_PAYOUT_SETTINGS_QUERY,
      isAdmin: true,
      variables: {
        id: defaultPyaoutSettingId
      }
    });

    console.log('deleteDefaultPayoutSettingResponse', deleteDefaultPayoutSettingResponse);

    res.status(201).json(deleteDefaultPayoutSettingResponse);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }
}

export default deleteCampaignPayoutSettingHandler;
