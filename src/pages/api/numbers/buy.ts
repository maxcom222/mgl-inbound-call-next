/* eslint-disable id-blacklist */
import twilio from 'twilio';
import { NextApiResponse } from 'next';
import { gql } from '@apollo/client';

import withAppConfig, {
  NextApiRequestWithAppConfig,
} from 'shared/utils/withAppConfig';
import { GRAPHQL_QUERY_ROOT_PREFIX } from 'shared/constants';
import queryGraphql from 'shared/utils/queryGraphql';
import { Number } from 'shared/queries/numbers';

const client = twilio(
  process.env.TWILIO_API_KEY_SID,
  process.env.TWILIO_API_KEY_SECRET,
  {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
  }
);

export const buildNumberRecord = (
  phoneNumberToPurchase,
  affiliateId,
  accountId
): Record<string, any> => {
  const {
    friendlyName,
    phoneNumber,
    lata,
    locality,
    rateCenter,
    latitude = 0,
    longitude = 0,
    region,
    postalCode,
    isoCountry = 'US',
    addressRequirements,
    beta,
    capabilities,
    isTollFree,
  } = phoneNumberToPurchase;

  const record = {
    accountId,
    friendlyName,
    phoneNumber,
    lata,
    locality,
    rateCenter,
    latitude,
    longitude,
    region,
    postalCode,
    isoCountry,
    addressRequirements,
    beta,
    capabilities,
    localNumber: friendlyName,
    displayNumber: phoneNumber.replace(/^\+/, ''),
    provider: 'twilio',
    providerAccountId: process.env.TWILIO_ACCOUNT_SID,
    providerId: '1',
    allocationDT: new Date(),
    lastBillDT: new Date(),
    isTollFree,
    isActivated: true,
    failedRechargeAttempts: 0,
    affiliateId,
    assignmentSettings: {
      data: {
        countryCode: isoCountry,
        isTollFree,
      },
    },
    enabled: true,
  };

  console.log(JSON.stringify(record));

  return record;
};

const save = async (
  record: Record<string, any>
): Promise<Record<string, any>> => {
  const query = gql`
  mutation add_number($object: contactcenter_numbers_insert_input!) {
    insert_${GRAPHQL_QUERY_ROOT_PREFIX}numbers_one(object: $object) {
      ...Number
    }
  }
  ${Number.fragments.number}
  `;
  const numberRecord = await queryGraphql({
    query,
    prefix: `insert_${GRAPHQL_QUERY_ROOT_PREFIX}numbers_one`,
    variables: {
      object: {
        ...record,
      },
    },
  });

  return numberRecord;
};

export const buy = async (
  phoneNumberToPurchase,
  applicationSid
): Promise<Record<string, any>> => {
  const incomingPhoneNumbers = await client.incomingPhoneNumbers.list();
  const isAlreadyBought = incomingPhoneNumbers.some(
    (number) => number.phoneNumber === phoneNumberToPurchase.phoneNumber
  );
  console.log('isAlreadyBought', isAlreadyBought);
  if (!isAlreadyBought) {
    return client.incomingPhoneNumbers.create({
      phoneNumber: phoneNumberToPurchase.phoneNumber,
      voiceCallerIdLookup: true,
      voiceApplicationSid: applicationSid,
    });
  } else {
    return Promise.resolve({});
  }
};

const buyHandler = async (
  req: NextApiRequestWithAppConfig,
  res: NextApiResponse
): Promise<void> => {
  const {
    phoneNumber: phoneNumberToPurchase,
    affiliateId,
    accountId,
  }: {
    phoneNumber: Record<string, any>;
    affiliateId: string;
    accountId: string;
  } = req.body;
  console.log('body', req.body);
  const twilioConfig = req.appConfig.find((e) => e.name === 'twilio');

  const applicationSid: string = twilioConfig?.data?.applicationSid;

  try {
    await buy(phoneNumberToPurchase, applicationSid);
    const record = buildNumberRecord(
      phoneNumberToPurchase,
      affiliateId,
      accountId
    );
    const result = await save(record);
    console.log('Saving lead source');
    res.status(201).json(result);
  } catch (e) {
    console.log('Could not purchase a number for lead source:');
    console.log(e);
    res.status(500).send('Could not contact Twilio API');
  }
};

export default withAppConfig(buyHandler);
