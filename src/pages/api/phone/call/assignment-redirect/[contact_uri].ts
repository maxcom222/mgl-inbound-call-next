import { twiml } from 'twilio';
import { NextApiRequest, NextApiResponse } from 'next';

const assignRedirect = (req: NextApiRequest, res: NextApiResponse): void => {
  const {
    query: { contact_uri: forwardingNumber },
  } = req;
  const response = new twiml.VoiceResponse();

  response.dial(
    {
      action: `${process.env.HOST as string}/api/dial_action_handler`,
      answerOnBridge: true,
      record: true ? 'record-from-answer' : 'do-not-record', // eslint-disable-line no-constant-condition
      // @ts-ignore
      recordingStatusCallbackEvent: 'completed',
      trim: 'trim-silence',
      recordingStatusCallback: `${
        process.env.HOST as string
      }/api/recording_status_callback`,
      timeLimit: 14400, // in seconds 4hrs default
      timeout: 30, // in seconds default
    },
    forwardingNumber
  );

  res.setHeader('Content-Type', 'text/xml');
  res.send(response.toString());
};

export default assignRedirect;
