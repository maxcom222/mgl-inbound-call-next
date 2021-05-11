/* eslint-disable functional/no-loop-statement */
import { Request, Response } from 'express';
import gql from 'graphql-tag';

import { Target } from '../../shared/queries/targets';

import { createWorker } from '../../shared/twilio';
import { requestGQL } from '../../shared/http-client';

const save = async (
  record: Record<string, any>
): Promise<Record<string, any>> => {
  console.log("record ---------> ", record);
  const CREATE_TARGET_QUERY = gql`
    mutation add_target($object: contactcenter_targets_insert_input!) {
      insert_contactcenter_targets_one(object: $object) {
        ...Target
      }
    }
    ${Target.fragments.target}
  `;
  const targetRecordResponse = await requestGQL({
    query: CREATE_TARGET_QUERY,
    isAdmin: true,
    variables: {
      object: {
        ...record,
      },
    },
  });

  const targetRecord = targetRecordResponse.insert_contactcenter_targets_one;

  return targetRecord;
};

export const targetCreateHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const target = req.body;

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

  console.log('twilioConfig', twilioConfig);

  const { workspaceSid } = twilioConfig?.data;

  try {
    const { sid } = await createWorker(workspaceSid, target);

    const targetData = {
      ...target,
      workerSid: sid,
    };
    console.log("targetData ------> ", targetData);
    const targetRecord = await save(targetData);

    console.log('targetRecord', targetRecord);
    console.log('Target created with Twilio', targetRecord);
    res.status(201).json(targetRecord);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }
};

export default targetCreateHandler;
