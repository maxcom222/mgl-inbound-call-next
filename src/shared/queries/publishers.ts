import { gql } from '@apollo/client';

export const Affiliate = {
  fragments: {
    affiliate: gql`
      fragment Affiliate on contactcenter_affiliates {
        id
        name
        subId
        accessToRecordings
        blockCallsIfCapped
        createNumbers
        enabled
        isSelf
        userIds
        accountId
      }
    `,
  },
};

export const VIEW_AFFILIATES = gql`
  query Affiliates {
    affiliates: contactcenter_affiliates(order_by: {created_at: desc}) {
      ...Affiliate
    }
  }
  ${Affiliate.fragments.affiliate}
`;

export const GET_AFFILIATE = gql`
  query Affiliate($id: uuid!) {
    affiliate: contactcenter_affiliates_by_pk(id: $id) {
      id
      name
      subId
      createNumbers
      blockCallsIfCapped
      accessToRecordings
    }
  }
`;

export const INSERT_AFFILIATE = gql`
  mutation Affiliate(
    $name: String!, 
    $subId: String,
    $createNumbers: Boolean!,
    $accessToRecordings: Boolean!,
    $blockCallsIfCapped: Boolean!
  ) {
    affiliate: insert_contactcenter_affiliates_one(object: {
      name: $name, 
      subId: $subId,
      createNumbers: $createNumbers,
      accessToRecordings: $accessToRecordings,
      blockCallsIfCapped: $blockCallsIfCapped
    }) {
      id
    }
  }
`;

export const UPDATE_AFFILIATE = gql`
  mutation Affiliate(
    $id: uuid!,
    $name: String!,
    $subId: String!,
    $createNumbers: Boolean!
    $accessToRecordings: Boolean!,
    $blockCallsIfCapped: Boolean!,
  ) {
    affiliate: update_contactcenter_affiliates_by_pk(
      pk_columns: {id: $id}, 
      _set: {
        name: $name, 
        subId: $subId
        createNumbers: $createNumbers,
        accessToRecordings: $accessToRecordings,
        blockCallsIfCapped: $blockCallsIfCapped, 
      }
    ) {
      id
    }
  }
`;

export const DELETE_AFFILIATE = gql`
  mutation Affiliate($id: uuid!) {
    affiliate: delete_contactcenter_affiliates_by_pk(id: $id) {
      id
    }
  }
`;
