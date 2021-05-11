import twilio from 'twilio';
import { NextApiRequest, NextApiResponse } from 'next';

const client = twilio(
  process.env.TWILIO_API_KEY_SID,
  process.env.TWILIO_API_KEY_SECRET,
  {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
  }
);

const infoHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const phoneNumber: string = req.query.phone_number?.toString();
  try {
    const incomingPhoneNumbers = await client.incomingPhoneNumbers.list({
      phoneNumber,
      limit: 20,
    });
    res.status(200).json(incomingPhoneNumbers);
  } catch (e) {
    console.log('Failed to fetch numbers from API');
    console.log('Error was:');
    console.log(e);
    res.status(500).send('Could not contact Twilio API');
  }
};

export default infoHandler;
