import { twiml } from 'twilio';
import gql from 'graphql-tag';
import { Request, Response } from 'express';

import { requestGQL } from '../shared/http-client';

export const workspaceEventCallbackHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log('workspaceEventCallbackHandler -----------> ', req.body);

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

  console.log('appConfig', appConfig);

  const ivr: Record<string, any> =
    appConfig.contactcenter_app_configuration.find((e) => e.name === 'ivr') ||
    {};

  console.log('ivr', ivr);

  const response = new twiml.VoiceResponse();

  console.log('response ----------> ', response);

  res.status(201).send(`workSpaceEventCallbackhandler`);
}

export default workspaceEventCallbackHandler;
