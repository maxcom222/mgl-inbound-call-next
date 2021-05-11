// /* eslint-disable id-blacklist */
// /* eslint-disable functional/no-loop-statement */
// /* eslint-disable max-lines */
// /* eslint-disable max-len */
// import { Request, Response } from 'express';
// import gql from 'graphql-tag';
// import { requestGQL } from '../../shared/http-client';

// export const deleteNumberHandler = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   console.log('body', req.body);

//   const APP_CONFIG_QUERY = gql`
//     query getAppConfig {
//       contactcenter_app_configuration {
//         name
//         data
//       }
//     }
//   `;

//   const appConfig = await requestGQL({
//     query: APP_CONFIG_QUERY,
//     isAdmin: true,
//     variables: {},
//   });

//   console.log('selectTeamHander - appConfig', appConfig);

//   const twilioConfig: Record<string, any> =
//     appConfig.contactcenter_app_configuration.find(
//       (e) => e.name === 'twilio'
//     ) || {};

//   console.log('twilioConfig', twilioConfig);

// //   const { applicationSid } = twilioConfig?.data;
// }
