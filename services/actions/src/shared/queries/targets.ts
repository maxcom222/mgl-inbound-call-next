import gql from 'graphql-tag';

import { Owner } from './owners';

export const Target = {
  fragments: {
    target: gql`
      fragment Target on contactcenter_targets {
        accountId
        callInstructionsId
        conversionTimerOffset
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
            targetCriteriaId
          }
          targetId
        }
        enabled
        id
        workerSid
        instructions {
          callType
          connectionTimeOut
          id
          number
          sendDigits
          sip {
            username
            password
            number
          }
        }
        isHighRateTarget
        name
        owner {
          ...Owner
        }
        ownerId
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
        scheduleId
        subId
        targetCallIncrement
        targetGroupId
      }
      ${Owner.fragments.owner}
    `,
  },
};

export const TARGET_QUERY = gql`
  query Targets {
    contactcenter_targets {
      ...Target
    }
  }
  ${Target.fragments.target}
`;
