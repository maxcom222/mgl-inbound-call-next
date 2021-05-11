/* eslint-disable id-blacklist */
import * as twilio from 'twilio';
import gql from 'graphql-tag';
import { Request, Response } from 'express';

import { requestGQL } from '../../shared/http-client';

import { Number } from '../../shared/queries/numbers';

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
  const ADD_NUMBER_QUERY = gql`
    mutation add_number($object: contactcenter_numbers_insert_input!) {
      insert_contactcenter_numbers_one(object: $object) {
        ...Number
      }
    }
    ${Number.fragments.number}
  `;
  const numberRecordResponse = await requestGQL({
    query: ADD_NUMBER_QUERY,
    isAdmin: true,
    variables: {
      object: {
        ...record,
      },
    },
  });
  const numberRecord = numberRecordResponse.insert_contactcenter_numbers_one;

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

export const buyHandler = async (
  req: Request,
  res: Response
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

  const twilioConfig: Record<string, any> =
    appConfig.contactcenter_app_configuration.find(
      (e) => e.name === 'twilio'
    ) || {};

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

export default buyHandler;
