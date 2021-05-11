/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable id-blacklist */
import { Request, Response } from 'express';
import gql from 'graphql-tag';
import { requestGQL } from '../../shared/http-client';

export const updateCamapaignPayoutSettingHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log('req.body', req.body);

  const {
    defaultPyaoutSettingId,
    schedule,
    payoutType,
    conversionType,
    conversionArgs,
    payoutValue,
    conversionValue,
    deDupeSetting,
    criteria
  } = req.body;

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

    const UPDATE_DEFAULT_PAYOUT_SETTINGS_QUERY = gql`
      mutation update_default_payout_settings($id: Int!, $payType: String, $convType: String, $convArgs: jsonb, $payValue: numeric, $convValue: numeric ) {
        update_contactcenter_default_payout_settings(
          where: { id: { _eq: $id } }
          _set: {
            payoutType: $payType,
            conversionType: $convType,
            conversionArgs: $convArgs,
            payoutValue: $payValue,
            conversionValue: $convValue,
          }
        ) {
          affected_rows
          returning {
            id
          }
        }
      }
    `;

    const updateDefaultPayoutSettingResponse = await requestGQL({
      query: UPDATE_DEFAULT_PAYOUT_SETTINGS_QUERY,
      isAdmin: true,
      variables: {
        id: defaultPyaoutSettingId,
        payType: payoutType,
        convType: conversionType,
        convArgs: conversionArgs,
        payValue: payoutValue,
        convValue: conversionValue
      }
    });

    const updateDefaultPayoutSetting = updateDefaultPayoutSettingResponse.update_contactcenter_default_payout_settings;

    console.log('updateDefaultPayoutSetting', updateDefaultPayoutSetting);

    const UPDATE_SCHEDULE_QUERY = gql`
      mutation update_schedule($object: contactcenter_schedules_and_capacities_set_input!, $id: Int!) {
        update_contactcenter_schedules_and_capacities (
          where: { id: { _eq: $id } }
          _set: $object
        ) {
          affected_rows
          returning {
            id
          }
        }
      }
    `;

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

    const scheduleData = {
      ...schedule.data
    }

    const recordScheduleData = {
      ...scheduleData
    }
    delete recordScheduleData.hoursOfOperation;

    console.log('recordScheduleData', recordScheduleData);

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

    const CREATE_OPEN_SETTINGS_QUERY = gql`
      mutation add_open_settings($object: contactcenter_open_settings_insert_input!) {
        insert_contactcenter_open_settings_one(object: $object) {
          id
        }
      }
    `;

    if (scheduleData.hoursOfOperation) {
      for (const item of scheduleData.hoursOfOperation.data) {
        item.scheduleId = defaultPayoutSettingResult.scheduleId;
        console.log('create open setting item', item);
        await requestGQL({
          query: CREATE_OPEN_SETTINGS_QUERY,
          isAdmin: true,
          variables: {
            object: {
            ...item,
            },
          },
        });
      }
    }

    if (Object.keys(recordScheduleData).length > 0) {
      const updateScheduleResponse = await requestGQL({
        query: UPDATE_SCHEDULE_QUERY,
        isAdmin: true,
        variables: {
          object: {
            ...recordScheduleData,
          },
          id: defaultPayoutSettingResult.scheduleId,
        },
      });

      console.log('updateScheduleResponse ------> ', updateScheduleResponse.update_contactcenter_schedules_and_capacities);
    } else {
      const deleteScheduleResponse = await requestGQL({
        query: DELETE_SCHEDULE_QUERY,
        isAdmin: true,
        variables: {
          id: defaultPayoutSettingResult.scheduleId,
        }
      });

      console.log('deleteScheduleResponse -------> ', deleteScheduleResponse);
    }

    if (deDupeSetting.data) {
      const UPDATE_DUPLICATE_SETTINGS_QUERY = gql`
        mutation updateDuplicateSettings($id: Int!, $secondsFromLastCall: Int) {
          update_contactcenter_duplicate_settings(
            where: { id: { _eq: $id } }
            _set: { secondsFromLastCall: $secondsFromLastCall }
          ) {
            affected_rows
            returning {
              id
            }
          }
        }
      `;

      const updateDuplicateSettings = await requestGQL({
        query: UPDATE_DUPLICATE_SETTINGS_QUERY,
        isAdmin: true,
        variables: {
          id: defaultPayoutSettingResult.deDupeSettingId,
          secondsFromLastCall: deDupeSetting.data.secondsFromLastCall
        }
      });

      console.log('updateDuplicateSettings', updateDuplicateSettings.update_contactcenter_duplicate_settings);
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

    const CREATE_TAG_ROUTING_TABLES_QUERY = gql`
      mutation add_tag_routing_table($object: contactcenter_tag_routing_tables_insert_input!) {
        insert_contactcenter_tag_routing_tables_one(object: $object) {
          id
        }
      }
    `;

    for (const tagRoutableRule of criteria.data.tagRoutableRule.data) {
      tagRoutableRule.dePayoutSettingCriteriaId = getDefaultPayoutSettingCriteriaResponse.contactcenter_default_payout_setting_criteria[0].id
      const createTagRoutingResponse = await requestGQL({
        query: CREATE_TAG_ROUTING_TABLES_QUERY,
        isAdmin: true,
        variables: {
          object: {
            ...tagRoutableRule
          }
        }
      });
      console.log('createTagRoutingResponse ----------> ', createTagRoutingResponse);
    }
    res.status(201).json(updateDefaultPayoutSetting);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }
}

export default updateCamapaignPayoutSettingHandler;
