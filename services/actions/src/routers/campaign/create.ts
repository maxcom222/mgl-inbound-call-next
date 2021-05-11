/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable id-blacklist */
import { Request, Response } from 'express';
import gql from 'graphql-tag';

import { Campaign } from '../../shared/queries/campaigns';

import { createQueues, createWorkflow } from '../../shared/twilio';
import { requestGQL } from '../../shared/http-client';
import { buy, buildNumberRecord } from '../numbers/buy';

const save = async (
  record: Record<string, any>
): Promise<Record<string, any>> => {
  console.log("campaign record ----------> ");
  const CREATE_CAMPAIGN_QUERY = gql`
    mutation add_campaign($object: contactcenter_campaigns_insert_input!) {
      insert_contactcenter_campaigns_one(object: $object) {
        ...Campaign
      }
    }
    ${Campaign.fragments.campaign}
  `;
  const campaignRecordResponse = await requestGQL({
    query: CREATE_CAMPAIGN_QUERY,
    isAdmin: true,
    variables: {
      object: {
        ...record,
      },
    },
  });
  const campaignRecord =
    campaignRecordResponse.insert_contactcenter_campaigns_one;

  return campaignRecord;
};

export const campaignCreateHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { affiliates, targetIds, countryCode, name, accountId } = req.body;

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

  const { workspaceSid, applicationSid } = twilioConfig?.data;

  const routes: Record<string, any> = { data: [] };
  targetIds.forEach((targetId) => {
    const routeData = {
      route: {
        data: {
          priority: { data: { priority: 1, weight: 1 } },
          callTargetId: targetId,
          conversionSettings: {
            data: [
              {
                conversionValue: 0.0,
                payoutValue: 0.0,
                deDupeSetting: { data: { secondsFromLastCall: 0 } },
                conversionType: 'connectedCall',
              },
            ],
          },
          name: `${name as string}:${targetId as number}`,
          accountId,
        },
      },
    };
    routes.data.push(routeData);
  });

  console.log("routes ------------> ", routes);

  const affiliatesData: Record<string, any> = { data: [] };

  const affilateNumbersData: Record<string, any> = { data: [] };

  try {
    for (const affiliate of affiliates) {
      const { affiliateId, phoneNumber } = affiliate;
      const data = {
        affiliateId,
      };
      console.log('affiliate data ------> ', data);
      affiliatesData.data.push(data);
      await buy(phoneNumber, applicationSid);
      const record = buildNumberRecord(phoneNumber, affiliateId, accountId);
      affilateNumbersData.data.push(record);
    }

    const campaignData = {
      distributionSetting: 'WEIGHT_BY_TARGETS_AVAILABLE',
      deDupeSettings: {
        data: {
          routeToOriginal: false,
          routeToDifferent: false,
        },
      },
      duplicateSettings: {
        data: {
          duplicateSetting: 'ON_CONNECT',
          callLengthInSeconds: 0,
        },
      },
      dialSettings: { data: { dialAttempts: 3 } },
      recordSetting: {
        data: {
          record: true,
          recordFromAnswer: true,
          trimSilence: false,
        },
      },
      spamDetection: {
        data: {
          blockDuplicatesForSeconds: 0,
          trackAnonymous: false,
        },
      },
      defaultPayoutSettings: {
        data: [
          {
            payoutType: "FIXED",
            conversionType: "IN_COMING",
            payoutValue: 0,
            deDupeSetting: { data: { secondsFromLastCall: 0 } },
            schedule: {
              data: {
                allTimeCap: -1,
                allTimeSumCap: -1,
                monthlyCap: -1,
                monthlySumCap: -1,
                dailyCap: -1,
                dailySumCap: -1,
                hourlyCap: -1,
                hourlySumCap: -1,
                concurrencyCap: -1,
                hoursOfOperation: {
                  data: []
                },
              }
            }
          }
        ],
      },
      routes,
      affiliates: affiliatesData,
      affiliateNumbers: affilateNumbersData,
      countryCode,
      name,
      accountId,
      completed: true
    };

    console.log('campaignData ----------> ', campaignData.affiliates.data);

    const campaignRecord = await save(campaignData);

    console.log('campaignData', campaignData);
    const queues = [];
    for (const item of targetIds) {
      const queue: Record<string, any> = {
        friendlyName: `${campaignData.name as string}:${item as number}:Queue`,
        filterFriendlyName: `${campaignData.name as string}:${item as number}`,
        expression: `campaignId == ${campaignRecord.id as number}`,
        targetWorkers: `id IN [${item as number}]`,
        targetWorkerExpression: `task.campaignId == ${campaignRecord.id as number} AND worker.id == ${item as number}`,
        targetQueuePriority: 1,
      };
      const queueRecordResult = await createQueues(
        workspaceSid,
        queue
      );
      const GET_CAMPAIGN_CALL_ROUTE = gql`
        query getCallRouteId($campaignId: Int!, $targetId: Int!) {
          contactcenter_campaign_call_routes(
            where: {
              _and: [
                { campaignId: { _eq: $campaignId } }
                { route: { callTargetId: { _eq: $targetId } } }
              ]
            }
          ) {
            callRouteId
          }
        }
      `;

      const campaignCallRouteResponse = await requestGQL({
        query: GET_CAMPAIGN_CALL_ROUTE,
        isAdmin: true,
        variables: {
          campaignId: campaignRecord.id,
          targetId: item,
        },
      });

      const {
        callRouteId,
      } = campaignCallRouteResponse.contactcenter_campaign_call_routes[0];

      const UPDATE_CALL_ROUTE_QUERY = gql`
        mutation updateCallRoute($id: Int!, $queueSid: String!) {
          update_contactcenter_call_routes(
            where: { id: { _eq: $id } }
            _set: { queueSid: $queueSid }
          ) {
            affected_rows
            returning {
              id
            }
          }
        }
      `;

      const updateCallRouteQuery = await requestGQL({
        query: UPDATE_CALL_ROUTE_QUERY,
        isAdmin: true,
        variables: {
          id: callRouteId,
          queueSid: queueRecordResult.queueSid,
        },
      });

      console.log("updateCallRouteQuery ----------> ", updateCallRouteQuery);
      queue.taskQueueSid = queueRecordResult.queueSid;
      queues.push(queue);
    }

    const workflow = {
      friendlyName: `${campaignRecord.name as string}:Workflow`,
    };

    const twilioResult = await createWorkflow(
      workspaceSid,
      workflow,
      queues
    );

    console.log('twilioResult', twilioResult);
    const UPDATE_CAMPAIGN_TWILIO_QUERY = gql`
      mutation update_campaign_twilio($id: Int!, $workflowSid: String) {
        update_contactcenter_campaigns_by_pk(
          pk_columns: { id: $id }
          _set: { workflowSid: $workflowSid }
        ) {
          id
        }
      }
      ${Campaign.fragments.campaign}
    `;
    await requestGQL({
      query: UPDATE_CAMPAIGN_TWILIO_QUERY,
      isAdmin: true,
      variables: {
        id: campaignRecord.id,
        workflowSid: twilioResult.workflowSid,
      },
    });

    const GET_CAMPAIGN = gql`
      query getCampaignById($id: Int!) {
        contactcenter_campaigns_by_pk(id: $id) {
          ...Campaign
        }
      }
      ${Campaign.fragments.campaign}
    `;

    const getCampaignByIdResponse = await requestGQL({
      query: GET_CAMPAIGN,
      isAdmin: true,
      variables: {
        id: campaignRecord.id,
      },
    });

    const getCampaignById =
      getCampaignByIdResponse.contactcenter_campaigns_by_pk;

    console.log('Campaign updated with Twilio', getCampaignById);
    res.status(201).json(getCampaignById);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }
};

export default campaignCreateHandler;
