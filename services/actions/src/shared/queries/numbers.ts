/* eslint-disable id-blacklist */
import gql from 'graphql-tag';

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

export const NUMBER_QUERY = gql`
  query Numbers {
    contactcenter_numbers {
      ...Number
    }
  }
  ${Number.fragments.number}
`;
