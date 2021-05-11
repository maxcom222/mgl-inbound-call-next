/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable id-blacklist */
import gql from 'graphql-tag';

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
      fragment CampaignAffiliates on contactcenter_campaign_affiliates {
        affiliate {
          ...Affiliate
        }
        id
        campaignId
        affiliateId
        payoutSettings {
          ...AffiliatePayoutSettings
        }
      }
      ${Affiliate.fragments.affiliate}
    `,
    affiliatePayoutSetting: gql`
      fragment AffiliatePayoutSettings on contactcenter_affiliate_payout_settings {
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
              startTime {
                hour
                minute
              }
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
        deDupeSetting {
          ...DuplicateSettings
        }
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
            affPayoutSettingCriteriaId
          }
          affPayoutSettingId
        }
        scheduleId
        payoutType
        conversionType
        conversionArgs
        payoutValue
        conversionValue
        deDupeSettingId
        campaignAffiliateId
      }
    `,
    defaultPayoutSettings: gql`
      fragment DefaultPayoutSettings on contactcenter_default_payout_settings {
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
              startTime {
                hour
                minute
              }
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
        deDupeSetting {
          ...DuplicateSettings
        }
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
            dePayoutSettingCriteriaId
          }
          dePayoutSettingId
        }
        scheduleId
        campaignId
        payoutType
        conversionType
        conversionArgs
        payoutValue
        conversionValue
        deDupeSettingId
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
        affiliates {
          ...CampaignAffiliates
        }
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
        defaultPayoutSettings {
          ...DefaultPayoutSettings
        }
      }
      ${CampaignRelated.fragments.deDupeSettings}
      ${CampaignRelated.fragments.dialSettings}
      ${CampaignRelated.fragments.duplicateSettings}
      ${CampaignRelated.fragments.markasDuplicateSettings}
      ${CampaignRelated.fragments.recordSettings}
      ${CampaignRelated.fragments.spamDetectionSettings}
      ${CampaignRelated.fragments.affiliatePayoutSetting}
      ${CampaignRelated.fragments.route}
      ${CampaignRelated.fragments.campaignAffiliates}
      ${CampaignRelated.fragments.defaultPayoutSettings}
      ${Target.fragments.target}
      ${Number.fragments.number}
    `,
  },
};

export const CAMPAIGN_QUERY = gql`
  query Campaigns {
    contactcenter_campaigns {
      ...Campaign
    }
  }
  ${Campaign.fragments.campaign}
`;
