/* eslint-disable functional/no-loop-statement */

import gql from "graphql-tag";
import { requestGQL } from "../../shared/http-client";
import { Request, Response } from 'express';
import { deleteWorker } from "../../shared/twilio";

const deleteTarget = async (
  sid: string
): Promise<Record<string, any>> => {
  const GET_TARGET_QUERY = gql`
    query getTarget($workerSid: String!) {
      contactcenter_targets(
        where: { workerSid: { _eq: $workerSid } }
      ) {
        id
      }
    }
  `;

  const getTargetById = await requestGQL({
    query: GET_TARGET_QUERY,
    isAdmin: true,
    variables: {
      workerSid: sid,
    }
  });

  console.log("getTargetById --------> ", getTargetById.contactcenter_targets);

  const DELETE_TARGET_CRITERIAS = gql`
    mutation delete_target_criterias($targetId: Int!) {
      delete_contactcenter_target_criterias(
        where: { targetId: { _eq: $targetId } }
      ) {
        affected_rows
        returning {
          id
        }
      }
    }
  `;

  for (const item of getTargetById.contactcenter_targets) {
    await requestGQL({
      query: DELETE_TARGET_CRITERIAS,
      isAdmin: true,
      variables: {
        targetId: item.id,
      }
    });
  }

  const DELETE_CALL_ROUTES = gql`
    mutation delete_call_routes($targetId: Int!) {
      delete_contactcenter_call_routes(
        where: { callTargetId: { _eq: $targetId } }
      ) {
        affected_rows
        returning {
          id
        }
      }
    }
  `;

  for (const item of getTargetById.contactcenter_targets) {
    await requestGQL({
      query: DELETE_CALL_ROUTES,
      isAdmin: true,
      variables: {
        targetId: item.id,
      }
    });
  }

  const DELETE_TARGET_QUERY = gql`
    mutation delete_target($workerSid: String!) {
      delete_contactcenter_targets(
        where: { workerSid: { _eq: $workerSid } },
      ) {
        affected_rows
        returning {
          id
        }
      }
    }
  `;
  const deleteTargetResponse = await requestGQL({
    query: DELETE_TARGET_QUERY,
    isAdmin: true,
    variables: {
      workerSid: sid
    },
  });

  const deleteResult = deleteTargetResponse.delete_contactcenter_targets;
  console.log("deleteResult ----------> ", deleteResult);

  return deleteResult;
};

export const targetDeleteHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const sid = req.body.workerSid;

  console.log("body", req.body);

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
    const deleteResult = await deleteWorker(workspaceSid, sid);

    console.log("target delete result ----> ", deleteResult);

    const deleteData = await deleteTarget(sid);

    console.log('deleteData', deleteData);
    console.log('Target delete with Twilio', deleteData);
    res.status(201).json(deleteData);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }
};

export default targetDeleteHandler;
