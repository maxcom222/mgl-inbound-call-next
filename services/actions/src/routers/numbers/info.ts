import * as twilio from 'twilio';
import { Request, Response } from 'express';

const client = twilio(
  process.env.TWILIO_API_KEY_SID,
  process.env.TWILIO_API_KEY_SECRET,
  {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
  }
);

export const infoHandler = async (
  req: Request,
  res: Response
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
