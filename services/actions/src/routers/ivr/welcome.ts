/* eslint-disable id-blacklist */
/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
import { twiml } from 'twilio';
import gql from 'graphql-tag';
import { Request, Response } from 'express';

import { requestGQL } from '../../shared/http-client';

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

  const callLogRecrod = createCallLogResponse.insert_contactcenter_call_logs_one;

  return callLogRecrod;
}

export const welcomeHandler = async (
  _req: Request,
  res: Response
): Promise<void> => {
  console.log('welcomeHandler -------> ',  _req.body);
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

  if (_req.method === 'POST') {
    const toNumber = _req.body.To;

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
      accountId: _req.body.AccountSid,
      caller: _req.body.Caller,
      campaignId: workflowSid,
      campaignName: name,
      callSid: _req.body.CallSid,
      callerName: _req.body.CallerName,
      callerCity: _req.body.CallerCity,
      callerState: _req.body.CallerState,
      callerZip: _req.body.CallerZip,
      callerCountry: _req.body.CallerCountry,
      callStatus: _req.body.CallStatus,
      number: _req.body.Called,
      recordingUrl: _req.path,
      workflowSid
    };

    const callLogRecord = await save(recodData);

    console.log('callLogRecord -------> ', callLogRecord);
  }

  const response = new twiml.VoiceResponse();

  /* add the team names as hints to the automatic speech recognition  */

  // const keywords: string[] = ivr?.data?.options.map(
  //   (option) => option.friendlyName
  // );

  // response.gather({
  //   // @ts-ignore
  //   input: 'dtmf speech',
  //   action: 'select-team',
  //   method: 'GET',
  //   numDigits: 1,
  //   timeout: 4,
  //   language: 'en-US',
  //   hints: keywords.join(),
  // });

  response.redirect({ method: 'GET' }, 'select-team');

  // gather.say(ivr?.data?.text);

  // response.say('You did not say anything or enter any digits.');
  // response.pause({ length: 2 });
  // response.redirect({ method: 'GET' }, 'welcome');
  res.setHeader('Content-Type', 'text/xml');
  res.send(response.toString());
};

export default welcomeHandler;
