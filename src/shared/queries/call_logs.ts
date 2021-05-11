/* eslint-disable id-blacklist */
import { gql } from '@apollo/client';

export const CallLog = {
  fragments: {
    call_logs: gql`
      fragment CallLog on contactcenter_call_logs {
        id
        number
        timeToConnect
        affiliateId
        accountId
        affiliateName
        callCompletedDt
        callConnectionDt
        callConnectionLength
        callLengthInSeconds
        callSid
        callStatus
        caller
        callerCity
        callerCountry
        callerName
        callerState
        callerZip
        campaignId
        campaignName
        created_at
        dialCallDuration
        dialCallSid
        dialCallStatus
        dtStamp
        inboundCallId
        inboundPhoneNumber
        numberPoolId
        numberPoolName
        payoutAmount
        previouseCallCallId
        previouseCallDateTime
        previouseCallTargetName
        profit
        queueSid
        recordingDuration
        recordingSid
        recordingUrl
        source
        targetBuyer
        targetBuyerId
        targetId
        targetName
        targetNumber
        taskPriority
        taskQueueSid
        taskSid
        totalAmount
        workflowSid
        workerSid
      }
    `,
  },
};

export const VIEW_CALL_LOGS = gql`
  subscription CallLog {
    call_logs: contactcenter_call_logs(order_by: {created_at: desc}) {
      ...CallLog
    }
  }
  ${CallLog.fragments.call_logs}
`;
