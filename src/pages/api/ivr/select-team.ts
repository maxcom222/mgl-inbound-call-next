import { twiml } from 'twilio';
import { NextApiResponse } from 'next';
import { gql } from '@apollo/client';

import withAppConfig, {
  NextApiRequestWithAppConfig,
} from 'shared/utils/withAppConfig';
import { GRAPHQL_QUERY_ROOT_PREFIX } from 'shared/constants';
import queryGraphql from 'shared/utils/queryGraphql';

const analyzeKeypadInput = (digits, options): string | undefined =>
  options.find((option) => option.digit === parseInt(digits, 10));

const analyzeSpeechInput = (text, options): string | undefined =>
  options.find((option) =>
    text.toLowerCase().includes(option.friendlyName.toLowerCase())
  );

const selectTeamHander = async (
  req: NextApiRequestWithAppConfig,
  res: NextApiResponse
): Promise<void> => {
  let team;

  const ivr = req.appConfig.find((e) => e.name === 'ivr');

  /* check if we got a dtmf input or a speech-to-text */
  if (req.query.SpeechResult) {
    console.log('SpeechResult: ', req.query.SpeechResult);
    team = analyzeSpeechInput(req.query.SpeechResult, ivr?.data?.options);
  }

  if (req.query.Digits) {
    team = analyzeKeypadInput(req.query.Digits, ivr?.data?.options);
  }

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

    const query = gql`
      query getCampaignIdFromNumber{
        ${GRAPHQL_QUERY_ROOT_PREFIX}numbers(where: {phoneNumber: {_eq: "${toNumber}"}})  {
        campaignId
      }
    }
      `;

    const numberRecords = await queryGraphql({
      query,
      prefix: `${GRAPHQL_QUERY_ROOT_PREFIX}numbers`,
    });

    console.log(numberRecords);

    const campaignId = numberRecords[0].campaignId;

    const getCampaignIdFromNumberQuery = gql`
    query getCampaignIdFromNumber {
    ${GRAPHQL_QUERY_ROOT_PREFIX}campaigns(where: {id: {_eq: ${campaignId}}}) {
        workflowSid
      }
  }
    `;

    const campaignRecords = await queryGraphql({
      query: getCampaignIdFromNumberQuery,
      prefix: `${GRAPHQL_QUERY_ROOT_PREFIX}campaigns`,
    });

    const workflowSid = campaignRecords[0].workflowSid;

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

export default withAppConfig(selectTeamHander);
