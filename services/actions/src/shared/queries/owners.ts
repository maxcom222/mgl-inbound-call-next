import gql from 'graphql-tag';

export const Owner = {
  fragments: {
    owner: gql`
      fragment Owner on contactcenter_buyers {
        accountId
        canDisputeConversions
        canPauseTargets
        canSetConcurrencyCaps
        email
        enabled
        id
        name
        subId
      }
    `,
  },
};

export const OWNER_QUERY = gql`
  query Owners {
    contactcenter_buyers {
      ...Owner
    }
  }
  ${Owner.fragments.owner}
`;
