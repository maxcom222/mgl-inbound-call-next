/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable id-blacklist */
import { Request, Response } from 'express';
import gql from 'graphql-tag';
import { requestGQL } from '../../shared/http-client';
import { updateWorkflow } from '../../shared/twilio';

export const campaignUpdateHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { workflowSid, name, numberDisplayFormat, evalAnonymDuplication, payoutDupesGlobal, duplicateSetting, routeToDifferent, routeToOriginal, strict, record, recordFromAnswer, trimSilence, dialAttempts } = req.body;

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
    console.log("workflowSid --------> ", duplicateSetting);
    const depSetting = duplicateSetting;
    const workflow = {
      sid: workflowSid,
      friendlyName: name,
    };
    const twilioResult = await updateWorkflow(
      workspaceSid,
      workflow
    );

    const CREATE_DUPLICATESETTINGS_QUERY = gql`
      mutation add_duplicate_settings($object: contactcenter_mark_as_duplicate_settings_insert_input!) {
        insert_contactcenter_mark_as_duplicate_settings_one(object: $object) {
          id
        }
      }
    `;

    const duplicateSettingsResponse = await requestGQL({
      query: CREATE_DUPLICATESETTINGS_QUERY,
      isAdmin: true,
      variables: {
        object: {
          duplicateSetting: depSetting,
        }
      }
    });
    console.log("duplicateSettingsResponse ---------> ", duplicateSettingsResponse);

    const UPDATE_CAMPAIGN_QUERY = gql`
      mutation update_campaign($workflowSid: String!, $name: String!, $numberDisplayFormat: String!, $evalAnonymDuplication: Boolean!, $payoutDupesGlobal: Boolean!, $duplicateSettingId: Int!) {
        update_contactcenter_campaigns(
          where: { workflowSid: { _eq: $workflowSid } }
          _set: {
            name: $name,
            numberDisplayFormat: $numberDisplayFormat,
            evalAnonymDuplication: $evalAnonymDuplication,
            payoutDupesGlobal: $payoutDupesGlobal
          }
        ) {
          affected_rows
          returning {
            id
            deDupeSettingsId
            recordSettingId
            dialSettingsId
          }
        }
      }
    `;

    const updateCampaignResponse = await requestGQL({
      query: UPDATE_CAMPAIGN_QUERY,
      isAdmin: true,
      variables: {
        workflowSid,
        name,
        numberDisplayFormat,
        evalAnonymDuplication,
        payoutDupesGlobal,
        duplicateSettingId: duplicateSettingsResponse.insert_contactcenter_mark_as_duplicate_settings_one.id,
      }
    });

    console.log('updateCampaignResponse', updateCampaignResponse);

    const UPDATE_DUPLICATE_CALL_SETTINGS_QUERY = gql`
      mutation update_duplicate_call_settings($id: Int!, $routeToDifferent: Boolean, $routeToOriginal: Boolean, $strict: Boolean) {
        update_contactcenter_duplicate_call_settings(
          where: { id: { _eq: $id } }
          _set: {
            routeToOriginal: $routeToOriginal,
            routeToDifferent: $routeToDifferent,
            strict: $strict
          }
        ) {
          affected_rows
          returning {
            id
          }
        }
      }
    `;

    await requestGQL({
      query: UPDATE_DUPLICATE_CALL_SETTINGS_QUERY,
      isAdmin: true,
      variables: {
        id: updateCampaignResponse.update_contactcenter_campaigns.returning[0].deDupeSettingsId,
        routeToDifferent,
        routeToOriginal,
        strict
      }
    });

    const UPDATE_DIAL_SETTINGS_QUERY = gql`
      mutation update_dial_settings($id: Int!, $dialAttempts: Int!) {
        update_contactcenter_dial_settings(
          where: { id: { _eq: $id } }
          _set: { dialAttempts: $dialAttempts }
        ) {
          affected_rows
          returning {
            id
          }
        }
      }
    `;

    await requestGQL({
      query: UPDATE_DIAL_SETTINGS_QUERY,
      isAdmin: true,
      variables: {
        id: updateCampaignResponse.update_contactcenter_campaigns.returning[0].dialSettingsId,
        dialAttempts
      }
    });

    const UPDATE_RECORD_CALL_SETTINGS_QUERY = gql`
      mutation update_record_call_settings($id: Int!, $record: Boolean!, $recordFromAnswer: Boolean!, $trimSilence: Boolean!) {
        update_contactcenter_record_call_settings(
          where: { id: { _eq: $id } }
          _set: {
            record: $record,
            recordFromAnswer: $recordFromAnswer,
            trimSilence: $trimSilence,
          }
        ) {
          affected_rows
          returning {
            id
          }
        }
      }
    `;

    await requestGQL({
      query: UPDATE_RECORD_CALL_SETTINGS_QUERY,
      isAdmin: true,
      variables: {
        id: updateCampaignResponse.update_contactcenter_campaigns.returning[0].recordSettingId,
        record,
        recordFromAnswer,
        trimSilence
      }
    });

    console.log('twilioResult', twilioResult);

    res.status(201).json(twilioResult);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }
};

export default campaignUpdateHandler;
