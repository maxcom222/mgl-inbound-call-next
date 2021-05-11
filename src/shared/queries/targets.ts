import { gql } from '@apollo/client';

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
          # sip {
          #   username
          #   password
          #   number
          # }
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

export const VIEW_TARGETS = gql`
  query Targets {
    targets: contactcenter_targets(order_by: {created_at: desc}) {
      ...Target
    }
  }
  ${Target.fragments.target}
`;

export const GET_TARGET = gql`
  query Target($id: Int!) {
    target: contactcenter_targets_by_pk(id: $id) {
      ...Target
    }
  }
  ${Target.fragments.target}
`;

export const INSERT_TARGET = gql`
  mutation Target(
    $name: String!, 
    $subId: String!,
    $ownerId: uuid!,
    $callType: String!,
    $number: String!,
    $connectionTimeOut: Int!,
    $timeZoneId: String!,
    $allTimeCap: Int!,
    $monthlyCap: Int!,
    $dailyCap: Int!,
    $hourlyCap: Int!,
    $concurrencyCap: Int!,
    $enabled: Boolean!
  ) {
    target: insert_contactcenter_targets_one(object: {
      name: $name,
      subId: $subId,
      ownerId: $ownerId,
      instructions: {
        data: {
          callType: $callType, 
          number: $number,
          connectionTimeOut: $connectionTimeOut
        }
      },
      schedule: {
        data: {
          timeZoneId: $timeZoneId,
          allTimeCap: $allTimeCap,
          monthlyCap: $monthlyCap,
          dailyCap: $dailyCap,
          hourlyCap: $hourlyCap,
          concurrencyCap: $concurrencyCap
        }
      },
      enabled: $enabled
    }) {
      id
    }
  }
`;

export const UPDATE_TARGET = gql`
  mutation Target(
    $id: Int!,
    $name: String!, 
    $subId: String!,
    $ownerId: uuid!,
    $enabled: Boolean!

    $instructionId: Int!,
    $callType: String!,
    $number: String!,
    $connectionTimeOut: Int!,
    
    $scheduleId: Int!,
    $timeZoneId: String!,
    $allTimeCap: Int!,
    $monthlyCap: Int!,
    $dailyCap: Int!,
    $hourlyCap: Int!,
    $concurrencyCap: Int!,
  ) {
    target: update_contactcenter_targets_by_pk(
      pk_columns: {id: $id}, 
      _set: {
        name: $name,
        subId: $subId,
        ownerId: $ownerId,

        # instructions: {
        #   data: {
        #     callType: $callType, 
        #     number: $number,
        #     connectionTimeOut: $connectionTimeOut
        #   }
        # },

        # schedule: {
        #   data: {
        #     timeZoneId: $timeZoneId,
        #     allTimeCap: $allTimeCap,
        #     monthlyCap: $monthlyCap,
        #     dailyCap: $dailyCap,
        #     hourlyCap: $hourlyCap,
        #     concurrencyCap: $concurrencyCap
        #   }
        # },
        
        enabled: $enabled
      }
    ) {
      id
    }
  }
`;
