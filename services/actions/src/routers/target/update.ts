/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable id-blacklist */
import { Request, Response } from 'express';
import gql from 'graphql-tag';
import { updateWorker } from '../../shared/twilio';
import { requestGQL } from '../../shared/http-client';

const update = async (
  record: Record<string, any>
): Promise<Record<string, any>> => {
  console.log("record", record);
  const cloneRecord = {
    ...record
  };
  delete cloneRecord.schedule;
  delete cloneRecord.instructions;
  delete cloneRecord.criteria;
  const UPDATE_TARGET_QUERY = gql`
    mutation update_target($object: contactcenter_targets_set_input!, $workerSid: String!) {
      update_contactcenter_targets (
        where: { workerSid: { _eq: $workerSid } },
        _set: $object
      ) {
        affected_rows
        returning {
          id
          callInstructionsId
          scheduleId
        }
      }
    }
  `;
  const targetRecordResponse = await requestGQL({
    query: UPDATE_TARGET_QUERY,
    isAdmin: true,
    variables: {
      object: {
        ...cloneRecord,
      },
      workerSid: record.workerSid
    },
  });

  const targetRecord = targetRecordResponse.update_contactcenter_targets;
  console.log("targetRecord --------> ", targetRecord);

  if (targetRecord.returning.length === 0) {
    return null;
  }

  const GET_TARGET_CRITERIAS_QUERY = gql`
    query getTargetCriterias($targetId: Int!) {
      contactcenter_target_criterias(
        where: { targetId: { _eq:  $targetId} }
      ) {
        id
      }
    }
  `;

  const getTargetCriteriasResponse = await requestGQL({
    query: GET_TARGET_CRITERIAS_QUERY,
    isAdmin: true,
    variables: {
      targetId: targetRecord.returning[0].id,
    }
  });

  const GET_TAG_ROUTING_TABLES = gql`
    query getTagRoutingTables($targetCriteriaId: Int!) {
      contactcenter_tag_routing_tables(
        where: { targetCriteriaId: { _eq: $targetCriteriaId } }
      ) {
        id
      }
    }
  `;

  const getTagRoutingTablesResponse = await requestGQL({
    query: GET_TAG_ROUTING_TABLES,
    isAdmin: true,
    variables: {
      targetCriteriaId: getTargetCriteriasResponse.contactcenter_target_criterias[0].id
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

  const CREATE_TAG_ROUTING_TABLES_QUERY = gql`
    mutation add_tag_routing_table($object: contactcenter_tag_routing_tables_insert_input!) {
      insert_contactcenter_tag_routing_tables_one(object: $object) {
        id
      }
    }
  `;

  for (const tagRoutableRule of record.criteria.data.tagRoutableRule.data) {
    tagRoutableRule.targetCriteriaId = getTargetCriteriasResponse.contactcenter_target_criterias[0].id
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
  const scheduleData = {
    ...record.schedule.data
  };

  const recordScheduleData = {
    ...scheduleData
  }
  delete recordScheduleData.hoursOfOperation;

  console.log("recordScheduleData ------>", scheduleData);

  const updateScheduleResponse = await requestGQL({
    query: UPDATE_SCHEDULE_QUERY,
    isAdmin: true,
    variables: {
      object: {
        ...recordScheduleData,
      },
      id: targetRecord.returning[0].scheduleId,
    },
  });

  console.log('updateScheduleResponse ----------> ', updateScheduleResponse.update_contactcenter_schedules_and_capacities);

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
      scheduleId: targetRecord.returning[0].scheduleId,
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
      scheduleId: updateScheduleResponse.update_contactcenter_schedules_and_capacities.returning[0].id,
    }
  });

  console.log('deleteOpenSettingsResponse ---------> ', deleteOpenSettingsResponse.delete_contactcenter_open_settings);

  for (const item of openSetttingsResponse.contactcenter_open_settings) {
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

  for (const item of scheduleData.hoursOfOperation.data) {
    item.scheduleId = updateScheduleResponse.update_contactcenter_schedules_and_capacities.returning[0].id;
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

  const UPDATE_INSTRUCTIONS_QUERY = gql`
    mutation update_instructions($id: Int!, $object: contactcenter_call_instructions_set_input!) {
      update_contactcenter_call_instructions (
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

  await requestGQL({
    query: UPDATE_INSTRUCTIONS_QUERY,
    isAdmin: true,
    variables: {
      id: targetRecord.returning[0].callInstructionsId,
      object: {
        ...record.instructions.data,
      },
    },
  });

  return targetRecord;
};

export const targetUpdateHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const target = req.body;

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

  const { workspaceSid } = twilioConfig?.data;

  try {
    await updateWorker(workspaceSid, target);

    const targetData = {
      ...target,
    };
    const targetRecord = await update(targetData);

    if (targetRecord === null) {
      res.status(500).send(`Target is not existed`);
    }
    console.log('targetRecord', targetRecord);
    console.log('Target updated with Twilio', targetRecord);
    res.status(201).json(targetRecord);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }
};

export default targetUpdateHandler;
