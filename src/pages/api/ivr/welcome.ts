import { twiml } from 'twilio';
import { NextApiResponse } from 'next';

import withAppConfig, {
  NextApiRequestWithAppConfig,
} from 'shared/utils/withAppConfig';

const welcomeHandler = (
  req: NextApiRequestWithAppConfig,
  res: NextApiResponse
): void => {
  const response = new twiml.VoiceResponse();
  const ivr = req.appConfig.find((e) => e.name === 'ivr');

  /* add the team names as hints to the automatic speech recognition  */

  const keywords: string[] = ivr?.data?.options.map(
    (option) => option.friendlyName
  );

  const gather = response.gather({
    input: 'dtmf speech',
    action: 'select-team',
    method: 'GET',
    numDigits: 1,
    timeout: 4,
    language: 'en-US',
    hints: keywords.join(),
  });

  gather.say(ivr?.data?.text);

  response.say('You did not say anything or enter any digits.');
  response.pause({ length: 2 });
  response.redirect({ method: 'GET' }, 'welcome');
  res.setHeader('Content-Type', 'text/xml');
  res.send(response.toString());
};

export default withAppConfig(welcomeHandler);
