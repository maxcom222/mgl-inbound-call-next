/* eslint-disable id-blacklist */
/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
import { twiml } from 'twilio';
import gql from 'graphql-tag';
import { Request, Response } from 'express';
import { requestGQL } from '../shared/http-client';

const save = async (
  record: Record<string, any>,
): Promise<Record<string, any>> => {
  console.log('record ----------> ', record);

  console.log('recodData -----> ', record);

  const CREATE_CALL_LOG_QUERY = gql`
    mutation add_call_logs($object: contactcenter_call_logs_insert_input!) {
      insert_contactcenter_call_logs_one(object: $object) {
        id
      }
    }
  `;

  const createCallLogResponse = await requestGQL({
    query: CREATE_CALL_LOG_QUERY,
    isAdmin: true,
    variables: {
      object: {
        ...record
      }
    }
  });

  const callLogRecrod = createCallLogResponse.insert_contactcenter_call_logs;

  return callLogRecrod;
}

export const dialActionHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log('dialActionHandler -------> ',  req.body);
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

  console.log('appConfig', appConfig);

  const ivr: Record<string, any> =
    appConfig.contactcenter_app_configuration.find((e) => e.name === 'ivr') ||
    {};

  console.log('ivr', ivr);

  if (req.method === 'POST') {
    const toNumber = req.body.To;

    console.log('toNumber', toNumber);

    const FIND_CAMPAIGNID_FROM_NUMBER = gql`
      query getCampaignIdFromNumber{
        contactcenter_numbers(where: {phoneNumber: {_eq: "${toNumber}"}}) {
          campaignId
        }
      }
    `;

    const numberRecordsResponse = await requestGQL({
      query: FIND_CAMPAIGNID_FROM_NUMBER,
      isAdmin: true,
      variables: {},
    });

    console.log('numberRecordsResponse', numberRecordsResponse);

    const numberRecords = numberRecordsResponse.contactcenter_numbers;

    console.log('numberRecords', numberRecords);

    const { campaignId } = numberRecords.pop();

    const GET_CAMPAIGN_FROM_ID = gql`
      query getCampaignFromId {
        contactcenter_campaigns(where: {id: {_eq: ${campaignId}}}) {
          workflowSid
          name
        }
      }
    `;

    const campaignRecordsResponse = await requestGQL({
      query: GET_CAMPAIGN_FROM_ID,
      isAdmin: true,
      variables: {},
    });

    const campaignRecords = campaignRecordsResponse.contactcenter_campaigns;
    const { workflowSid, name } = campaignRecords.pop();

    const recodData = {
      dtStamp: new Date(),
      accountId: req.body.AccountSid,
      caller: req.body.Caller,
      campaignId: workflowSid,
      campaignName: name,
      callSid: req.body.CallSid,
      callerName: req.body.CallerName,
      callerCity: req.body.CallerCity,
      callerState: req.body.CallerState,
      callerZip: req.body.CallerZip,
      callerCountry: req.body.CallerCountry,
      callStatus: req.body.CallStatus,
      number: req.body.Called,
      recordingUrl: req.path,
      workflowSid
    };

    const callLogRecord = await save(recodData);
    const response = new twiml.VoiceResponse();
    console.log('callLogRecord -------> ', callLogRecord);
    res.send(response.toString());
  }
}
