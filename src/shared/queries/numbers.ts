/* eslint-disable id-blacklist */
import { gql } from '@apollo/client';

import { Affiliate } from './publishers';
import { AssignmentSettings } from './assignment_settings';

export const Number = {
  fragments: {
    number: gql`
      fragment Number on contactcenter_numbers {
        accountId
        addressRequirements
        affiliateId
        allocationDT
        assignmentSettingsId
        autoRenew
        beta
        campaignId
        capabilities
        carrierNumberId
        deAllocationDT
        deallocFlag
        displayNumber
        enabled
        failedRechargeAttempts
        friendlyName
        id
        intSettingIds
        isActivated
        isCarrierNumber
        isTollFree
        isoCountry
        jsTagId
        lastBillDT
        lastChargeDT
        lata
        latitude
        localNumber
        locality
        longitude
        name
        nextChargeDT
        numberPoolId
        offerId
        phoneNumber
        postalCode
        provider
        providerAccountId
        providerId
        rateCenter
        region
        renewDOM
        affiliate {
          ...Affiliate
        }
        assignmentSettings {
          ...AssignmentSettings
        }
      }
      ${AssignmentSettings.fragments.assignmentSettings}
      ${Affiliate.fragments.affiliate}
    `,
  },
};

export const VIEW_NUMBERS = gql`
  query Numbers {
    numbers: contactcenter_numbers(order_by: {created_at: desc}) {
      ...Number
    }
  }
  ${Number.fragments.number}
`;

export const GET_NUMBER = gql`
  query Number($id: Int!) {
    number: contactcenter_numbers_by_pk(id: $id) {
      ...Number
    }
  }
  ${Number.fragments.number}
`;

export const GET_NUMBERS_BY_PUBLISHER = gql`
  query Number($id: uuid!) {
    numbers: contactcenter_numbers(where: {affiliateId: {_eq: $id}}) {
      phoneNumber
      id
    }
  }
`;

