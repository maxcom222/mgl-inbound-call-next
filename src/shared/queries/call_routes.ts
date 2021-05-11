import { gql } from '@apollo/client';

export const Route = {
  fragments: {
    route: gql`
      fragment Route on contactcenter_call_routes {
        name
        id
        enabled
        created_at
        callPingTreeId
        callTargetGroupId
        callTargetId
        campaignId
        priority {
          priority
          weight
        }
        conversionSettings {
          conversionArgs
          conversionType
          conversionValue
          payoutValue
          deDupeSetting {
            secondsFromLastCall
          }
        }
        callTarget {
          name
        }
      }
    `,
  },
};

export const GET_ROUTE = gql`
  query Route ($id: Int!) {
    route: contactcenter_call_routes_by_pk(id: $id) {
      ...Route
    }
  }
  ${Route.fragments.route}
`;
