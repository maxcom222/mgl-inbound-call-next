/* eslint-disable id-blacklist */
/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
import { twiml } from 'twilio';
import gql from 'graphql-tag';
import { Request, Response } from 'express';

import { requestGQL } from '../../shared/http-client';

const analyzeKeypadInput = (digits, options): string =>
  options.find((option) => option.digit === Number.parseInt(digits, 10)) || '';

const analyzeSpeechInput = (text, options): string =>
  options.find((option) =>
    text.toLowerCase().includes(option.friendlyName.toLowerCase())
  ) || '';

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

export const selectTeamHander = async (
  req: Request,
  res: Response
): Promise<void> => {
  let team;

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

  const ivr: Record<string, any> =
    appConfig.contactcenter_app_configuration.find((e) => e.name === 'ivr') ||
    {};

  console.log('selectTeamHander - ivr', ivr);

  /* check if we got a dtmf input or a speech-to-text */
  if (req.query.SpeechResult) {
    console.log('SpeechResult: ', req.query.SpeechResult);
    team = analyzeSpeechInput(req.query.SpeechResult, ivr?.data?.options);
  }

  if (req.query.Digits) {
    team = analyzeKeypadInput(req.query.Digits, ivr?.data?.options);
  }

  team = 1;

  const response = new twiml.VoiceResponse();

  /* the caller pressed a key that does not match any team */
  if (team === null) {
    // redirect the call to the previous twiml
    response.say('Your selection was not valid, please try again');
    response.pause({ length: 2 });
    response.redirect({ method: 'GET' }, 'welcome');
  } else {
    const gather = response.gather({
      action: `create-task?teamId=${
        team.id
      }&teamFriendlyName= ${encodeURIComponent(team.friendlyName)}`,
      method: 'GET',
      numDigits: 1,
      timeout: 5,
    });

    gather.say(
      `Press a key if you want a callback from ${team.friendlyName} ', or stay on the line`
    );

    const toNumber = req.query.To;

    console.log('toNumber', toNumber);

    const FIND_CAMPAIGNID_FROM_NUMBER = gql`
      query getCampaignIdFromNumber{
        contactcenter_numbers(where: {phoneNumber: {_eq: "${toNumber}"}})  {
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

    console.log('callLogRecord -------> ', callLogRecord);
    /* create task attributes */
    const attributes = {
      text: `Caller answered IVR with option "${team.friendlyName}"`,
      channel: 'phone',
      phone: req.query.From,
      name: req.query.From,
      title: 'Inbound call',
      team: team.id,
      campaignId,
    };

    response
      .enqueue({
        workflowSid,
      })
      .task({ priority: 2, timeout: 3600 }, JSON.stringify(attributes));
  }

  res.send(response.toString());
};

export default selectTeamHander;
