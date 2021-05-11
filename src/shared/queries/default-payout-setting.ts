/* eslint-disable id-blacklist */
import { gql } from '@apollo/client';

export const DefaultPayoutSetting = {
  fragments: {
    defaultPayoutSetting: gql`
      fragment DefaultPayoutSetting on contactcenter_default_payout_settings {
        id
      }
    `,
  },
};

