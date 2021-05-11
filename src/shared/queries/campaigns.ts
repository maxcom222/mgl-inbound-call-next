/* eslint-disable id-blacklist */
import { gql } from '@apollo/client';

import { Number } from './numbers';
import { Affiliate } from './publishers';
import { Target } from './targets';

export const CampaignRelated = {
  fragments: {
    deDupeSettings: gql`
      fragment DeDupeSettings on contactcenter_duplicate_call_settings {
        id
        routeToDifferent
        routeToOriginal
        strict
      }
    `,
    dialSettings: gql`
      fragment DialSettings on contactcenter_dial_settings {
        dialAttempts
        id
      }
    `,
    duplicateSettings: gql`
      fragment DuplicateSettings on contactcenter_duplicate_settings {
        id
        secondsFromLastCall
      }
    `,
    markasDuplicateSettings: gql`
      fragment MarkAsDuplicateSettings on contactcenter_mark_as_duplicate_settings {
        callLengthInSeconds
        duplicateSetting
        id
      }
    `,
    recordSettings: gql`
      fragment RecordSettings on contactcenter_record_call_settings {
        dualChannelRecording
        id
        record
        recordFromAnswer
        trimSilence
      }
    `,
    spamDetectionSettings: gql`
      fragment SpamDetectionSettings on contactcenter_spam_detection_settings {
        blockDuplicatesForSeconds
        id
        trackAnonymous
      }
    `,
    route: gql`
      fragment Route on contactcenter_call_routes {
        accountId
        callPingTreeId
        queueSid
        callTarget {
          ...Target
        }
        callTargetGroupId
        callTargetId
        campaignId
        conversionSettings {
          callRouteId
          conversionArgs
          conversionType
          conversionValue
          deDupeSetting {
            ...DuplicateSettings
          }
          deDupeSettingId
          id
          payoutValue
        }
        enabled
        id
        name
        priority {
          id
          priority
          weight
        }
        priorityId
      }
    `,
    campaignAffiliates: gql`
      fragment CampaignAffiliates on contactcenter_campaigns {
        affiliates {
          affiliate {
            ...Affiliate
          }
          id
          campaignId
          affiliateId
        }
      }
      ${Affiliate.fragments.affiliate}
    `,
    defaultPayoutSettings: gql`
      fragment DefaultPayoutSettings on contactcenter_default_payout_settings{
        id
        campaignId
        conversionArgs
        conversionType
        conversionValue
        deDupeSettingId
        payoutType
        payoutValue
        criteria {
          id
          tagRoutableRule {
            id
            tagCriteria {
              comparisonType
              id
              isNegativeMatch
              isNumber
              tagId
              tagIds
              value
              tagRoutableRuleId
            }
          }
        }
        schedule {
          allTimeCap
          allTimeSumCap
          concurrencyCap
          dailyCap
          dailySumCap
          hourlyCap
          hourlySumCap
          hoursOfOperation {
            breaks {
              id
              lengthInMin
              openSettingsId
              startTimeId
            }
            closeTime {
              hour
              minute
            }
            closeTimeId
            id
            inverted
            isClosed
            isoWeekday
            openTime {
              hour
              minute
            }
            openTimeId
            scheduleId
          }
          id
          monthlyCap
          monthlySumCap
          timeZoneId
        }
        deDupeSetting{
          secondsFromLastCall
        }
      }
    `,
  },
};

export const Campaign = {
  fragments: {
    campaign: gql`
      fragment Campaign on contactcenter_campaigns {
        accountId
        completed
        countryCode
        deDupeSettingsId
        defaultNumberId
        defaultTargetId
        dialSettingsId
        distributionSetting
        duplicateSettingsId
        enabled
        evalAnonymDuplication
        filterCallsThroughTCPAShield
        id
        name
        numberDisplayFormat
        offerDraftId
        offerId
        payoutDupesGlobal
        poolId
        recordSettingId
        spamDetectionSettingsId
        userCampaignId
        workflowSid
        affiliateNumbers {
          ...Number
        }
        ...CampaignAffiliates
        deDupeSettings {
          ...DeDupeSettings
        }
        defaultNumber {
          ...Number
        }
        defaultTarget {
          ...Target
        }
        dialSettings {
          ...DialSettings
        }
        duplicateSettings {
          ...MarkAsDuplicateSettings
        }
        recordSetting {
          ...RecordSettings
        }
        routes {
          id
          route {
            ...Route
          }
        }
        spamDetection {
          ...SpamDetectionSettings
        }
        defaultPayoutSettings{
          ...DefaultPayoutSettings
        }
      }
      ${CampaignRelated.fragments.deDupeSettings}
      ${CampaignRelated.fragments.dialSettings}
      ${CampaignRelated.fragments.duplicateSettings}
      ${CampaignRelated.fragments.markasDuplicateSettings}
      ${CampaignRelated.fragments.recordSettings}
      ${CampaignRelated.fragments.spamDetectionSettings}
      ${CampaignRelated.fragments.route}
      ${CampaignRelated.fragments.campaignAffiliates}
      ${CampaignRelated.fragments.defaultPayoutSettings}
      ${Target.fragments.target}
      ${Number.fragments.number}
    `,
  },
};

export const VIEW_CAMPAIGNS = gql`
  query Campaigns {
    campaigns: contactcenter_campaigns(order_by: {created_at: desc}) {
      ...Campaign
    }
  }
  ${Campaign.fragments.campaign}
`;

export const GET_CAMPAIGN = gql`
  query Campaign ($id: Int!) {
    campaign: contactcenter_campaigns_by_pk(id: $id) {
      ...Campaign
    }
  }
  ${Campaign.fragments.campaign}
`;

export const CREATE_DRAFT_CAMPAIGN = gql`
  mutation Campaign(
    $name: String!, 
    $countryCode: String!
  ) {
    campaign: insert_contactcenter_campaigns_one(object: {
      name: $name,
      countryCode: $countryCode,
      completed: false,
      enabled: false
    }) {
      id,
      name,
      countryCode
    }
  }
`;

export const UPDATE_DRAFT_CAMPAIGN = gql`
  mutation Campaign(
    $id: Int!,
    $name: String!, 
    $countryCode: String!
  ) {
    campaign: update_contactcenter_campaigns_by_pk(
      pk_columns: {id: $id}, 
      _set: {
        name: $name, 
        countryCode: $countryCode
      }
    ) {
      id,
      name,
      countryCode
    }
  }
`;

export const UPDATE_CAMPAIGN = gql`
  mutation Campaign(
    $RoutePreviouslyConnectedCalls: String!,

    $id: Int!,
    $name: String!,
    $numberDisplayFormat: String!,
    $evalAnonymDuplication: Boolean!,
    $payoutDupesGlobal: Boolean!,

    $duplicateSettingsId: Int!,
    $duplicateSetting: contactcenter_duplicate_setting_type_enum!,

    $deDupeSettingsId: Int!,
    $routeToDifferent: Boolean!,
    $routeToOriginal: Boolean!,
    $strict: Boolean!,

    $recordSettingId: Int!,
    $record: Boolean!,
    $recordFromAnswer: Boolean!,
    $trimSilence: Boolean!,

    $dialSettingsId: Int!,
    $dialAttempts: Int!
  ) {
    campaign: update_contactcenter_campaigns_by_pk(
      pk_columns: {id: $id}, 
      _set: {
        name: $name,
        evalAnonymDuplication: $evalAnonymDuplication,
        numberDisplayFormat: $numberDisplayFormat,
        payoutDupesGlobal: $payoutDupesGlobal,

      }
    ) {
      id,
    }

    duplicateSettings: update_contactcenter_mark_as_duplicate_settings_by_pk(
      pk_columns: {
        id: $duplicateSettingsId
      },
      _set: {
        duplicateSetting: $duplicateSetting,
      }
    ){
      id
    }

    deDupeSettings: update_contactcenter_duplicate_call_settings_by_pk(
      pk_columns: {
        id: $deDupeSettingsId
      },
      _set: {
        routeToDifferent: $routeToDifferent,
        routeToOriginal: $routeToOriginal,
        strict: $strict,
      }
    ){
      id
    }
    
    recordCallSettings: update_contactcenter_record_call_settings_by_pk(
      pk_columns: {id: $recordSettingId}, 
      _set: {
        record: $record,
        recordFromAnswer: $recordFromAnswer,
        trimSilence: $trimSilence,
      }
    ) {
      id
    }

    dialSettings: update_contactcenter_dial_settings_by_pk(
      pk_columns: {
        id: $dialSettingsId
      },
      _set: {
        dialAttempts: $dialAttempts
      }
    ){
      id
    }
  }
`;

export const CREATE_CAMPAIGN_SPAM_DETECTION_SETTINGS = gql`
  mutation SpamDetectionSettings(
    $id: Int!,
    $blockDuplicatesForSeconds: Int!,
    $trackAnonymous: Boolean!
  ){
    spamDetectionCampaign: insert_contactcenter_spam_detection_settings_one(
      object: {
        blockDuplicatesForSeconds: $blockDuplicatesForSeconds,
        trackAnonymous: $trackAnonymous
      }
    ){
      id
    }

    # campaign: update_contactcenter_campaigns_by_pk(
    #   pk_columns: {
    #     id: $campaignId
    #   },
    #   _set: {
    #     duplicateSettingsId: $id
    #   }
    # ){
    #   id
    # }
  }
`;

export const UPDATE_CAMPAIGN_SPAM_DETECTION_SETTINGS = gql`
  mutation SpamDetectionSettings(
    $id: Int!,
    $blockDuplicatesForSeconds: Int!,
    $trackAnonymous: Boolean!
  ){
    spamDetectionCampaign: update_contactcenter_spam_detection_settings_by_pk(
      pk_columns: {
        id: $id
      },
      _set: {
        blockDuplicatesForSeconds: $blockDuplicatesForSeconds,
        trackAnonymous: $trackAnonymous
      }
    ){
      id
    }
  }
`;

export const DELETE_CAMPAIGN = gql`
  mutation Campaign($id: Int!){
    campaign: delete_contactcenter_campaigns_by_pk(id: $id){
      id
    }
  }
`;

