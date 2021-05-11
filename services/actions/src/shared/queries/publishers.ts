import gql from 'graphql-tag';

export const Affiliate = {
  fragments: {
    affiliate: gql`
      fragment Affiliate on contactcenter_affiliates {
        accessToRecordings
        accountId
        blockCallsIfCapped
        createNumbers
        enabled
        id
        isSelf
        name
        subId
        userIds
      }
    `,
  },
};

export const AFFILIATE_QUERY = gql`
  query Affiliates {
    contactcenter_affiliates {
      ...Affiliate
    }
  }
  ${Affiliate.fragments.affiliate}
`;
