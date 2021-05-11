import { gql } from '@apollo/client';

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

export const VIEW_OWNERS = gql`
  query Owners {
    buyers: contactcenter_buyers(order_by: {created_at: desc}) {
      ...Owner
    }
  }
  ${Owner.fragments.owner}
`;

export const GET_OWNER = gql`
  query Owner($id: uuid!) {
    buyer: contactcenter_buyers_by_pk(id: $id) {
      id
      name
      subId
      canDisputeConversions
      canPauseTargets
      canSetConcurrencyCaps
      enabled
    }
  }
`;

export const INSERT_OWNER = gql`
  mutation Owner(
    $name: String!, 
    $subId: String,
    $canDisputeConversions: Boolean!,
    $canPauseTargets: Boolean!,
    $canSetConcurrencyCaps: Boolean!
    $enabled: Boolean!
  ) {
    buyer: insert_contactcenter_buyers_one(object: {
      name: $name, 
      subId: $subId,
      canDisputeConversions: $canDisputeConversions,
      canPauseTargets: $canPauseTargets,
      canSetConcurrencyCaps: $canSetConcurrencyCaps,
      enabled: $enabled
    }) {
      id
    }
  }
`;

export const UPDATE_OWNER = gql`
  mutation Owner(
    $id: uuid!,
    $name: String!, 
    $subId: String,
    $canDisputeConversions: Boolean!,
    $canPauseTargets: Boolean!,
    $canSetConcurrencyCaps: Boolean!
    $enabled: Boolean!
  ) {
    buyer: update_contactcenter_buyers_by_pk(
      pk_columns: {id: $id}, 
      _set: {
        name: $name, 
        subId: $subId,
        canDisputeConversions: $canDisputeConversions,
        canPauseTargets: $canPauseTargets,
        canSetConcurrencyCaps: $canSetConcurrencyCaps,
        enabled: $enabled
      }
    ) {
      id
    }
  }
`;

export const UPDATE_OWNER_CAN_PAUSE_TARGETS = gql`
  mutation Owner(
    $id: uuid!,
    $canPauseTargets: Boolean!,
  ) {
    buyer: update_contactcenter_buyers_by_pk(
      pk_columns: {id: $id}, 
      _set: {
        canPauseTargets: $canPauseTargets,
      }
    ) {
      id
    }
  }
`;

export const UPDATE_OWNER_CAN_SET_CONCURRENCY_CAPS = gql`
  mutation Owner(
    $id: uuid!,
    $canSetConcurrencyCaps: Boolean!
  ) {
    buyer: update_contactcenter_buyers_by_pk(
      pk_columns: {id: $id}, 
      _set: {
        canSetConcurrencyCaps: $canSetConcurrencyCaps,
      }
    ) {
      id
    }
  }
`;

export const UPDATE_OWNER_CAN_DISPUTE_CONVERSION = gql`
  mutation Owner(
    $id: uuid!,
    $canDisputeConversions: Boolean!,
  ) {
    buyer: update_contactcenter_buyers_by_pk(
      pk_columns: {id: $id}, 
      _set: {
        canDisputeConversions: $canDisputeConversions,
      }
    ) {
      id
    }
  }
`;

export const DELETE_OWNER = gql`
  mutation Owner($id: uuid!) {
    buyer: delete_contactcenter_buyers_by_pk(id: $id) {
      id
    }
  }
`;
