/* eslint-disable functional/no-loop-statement */
import { NextApiResponse } from 'next';
import { gql } from '@apollo/client';

import withAppConfig, {
  NextApiRequestWithAppConfig,
} from 'shared/utils/withAppConfig';
import { GRAPHQL_QUERY_ROOT_PREFIX } from 'shared/constants';
import queryGraphql from 'shared/utils/queryGraphql';
import { Campaign } from 'shared/queries/campaigns';

import { createOrUpdateWorkflowWithQueue } from 'shared/vendor/twilio';

import { buy, buildNumberRecord } from '../numbers/buy';

const save = async (
  record: Record<string, any>
): Promise<Record<string, any>> => {
  const query = gql`
    mutation add_campaign($object: ${GRAPHQL_QUERY_ROOT_PREFIX}campaigns_insert_input!) {
      insert_${GRAPHQL_QUERY_ROOT_PREFIX}campaigns_one(object: $object) {
        ...Campaign
      }
    }
    ${Campaign.fragments.campaign}
  `;
  const campaignRecord = await queryGraphql({
    query,
    prefix: `insert_${GRAPHQL_QUERY_ROOT_PREFIX}campaigns_one`,
    variables: {
      object: {
        ...record,
      },
    },
  });

  return campaignRecord;
};

const create = async (
  req: NextApiRequestWithAppConfig,
  res: NextApiResponse
): Promise<void> => {
  const { affiliates, targetIds, countryCode, name, accountId } = req.body;

  const twilioConfig: Record<string, any> =
    req.appConfig.find((e) => e.name === 'twilio') || {};

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
          name: `${name as string}${targetId as number}`,
          accountId,
        },
      },
    };
    routes.data.push(routeData);
  });

  const affiliatesData: Record<string, any> = { data: [] };

  const affilateNumbersData: Record<string, any> = { data: [] };

  try {
    for (const affiliate of affiliates) {
      const { affiliateId, phoneNumber } = affiliate;
      affiliatesData.data.push({ affiliateId });
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
      routes,
      affiliates: affiliatesData,
      affiliateNumbers: affilateNumbersData,
      countryCode,
      name,
      accountId,
    };

    console.log('campaignData', campaignData);

    const campaignRecord = await save(campaignData);

    console.log('campaignRecord', campaignRecord);
    const queue = {
      friendlyName: `${campaignRecord.name as string}:Queue`,
      filterFriendlyName: `${campaignRecord.name as string}:${
        targetIds[0] as number
      }`,
      expression: `campaignId == ${campaignRecord.id as number}`,
      targetWorkers: `id IN [${targetIds[0] as number}]`,
      targetWorkerExpression: `task.campaignId == ${
        campaignRecord.id as number
      } AND worker.id == ${targetIds[0] as number}`,
      targetQueuePriority: 1,
    };
    const workflow = {
      friendlyName: `${campaignRecord.name as string}:Workflow`,
    };
    const twilioResult = await createOrUpdateWorkflowWithQueue(
      workspaceSid,
      workflow,
      queue
    );

    console.log('twilioResult', twilioResult);
    const query = gql`
        mutation update_campaign_twilio($id: Int!, $workflowSid: String, $queueSid: String) {
          update_${GRAPHQL_QUERY_ROOT_PREFIX}campaigns_by_pk (
            pk_columns: {id: $id}
            _set: { workflowSid: $workflowSid, queueSid:$queueSid }
          ) {
            ...Campaign
          }
        }
        ${Campaign.fragments.campaign}
      `;
    const updatedCampaignRecord = await queryGraphql({
      query,
      prefix: `update_${GRAPHQL_QUERY_ROOT_PREFIX}campaigns_by_pk`,
      variables: {
        id: campaignRecord.id,
        ...twilioResult,
      },
    });
    console.log('Campaign updated with Twilio', updatedCampaignRecord);
    res.status(201).json(updatedCampaignRecord);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }
};

export default withAppConfig(create);
