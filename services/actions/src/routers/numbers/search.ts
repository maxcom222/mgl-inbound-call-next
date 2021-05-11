import * as twilio from 'twilio';
import { Request, Response } from 'express';

const client = twilio(
  process.env.TWILIO_API_KEY_SID,
  process.env.TWILIO_API_KEY_SECRET,
  {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
  }
);

export const searchHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const areaCode: string = req.query.area_code?.toString();
  const resourceType: string = req.query.resource_type?.toString();

  let availableNumbers;
  try {
    switch (resourceType) {
      case 'local':
        availableNumbers = await client.availablePhoneNumbers('US').local.list({
          areaCode: parseInt(areaCode, 10),
          limit: 20,
        });
        break;
      case 'tollfree':
        availableNumbers = await client
          .availablePhoneNumbers('US')
          .tollFree.list({
            limit: 20,
          });
        break;
      case 'mobile':
        availableNumbers = await client
          .availablePhoneNumbers('US')
          .mobile.list({
            limit: 20,
          });
        break;
      default:
        availableNumbers = await client.availablePhoneNumbers('US').local.list({
          areaCode: parseInt(areaCode, 10),
          limit: 20,
        });
    }

    const availableNumbersWithResourceType = availableNumbers.map((num) => {
      {
        num.isTollFree = resourceType === 'tollfree';

        return num;
      }
    });

    res.status(200).json(availableNumbersWithResourceType);
  } catch (e) {
    console.log('Failed to fetch numbers from API');
    console.log('Error was:');
    console.log(e);
    res.status(500).send('Could not contact Twilio API');
  }
};

export default searchHandler;
