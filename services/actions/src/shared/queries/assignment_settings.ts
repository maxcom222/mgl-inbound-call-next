import gql from 'graphql-tag';

export const AssignmentSettings = {
  fragments: {
    assignmentSettings: gql`
      fragment AssignmentSettings on contactcenter_number_assignment_settings {
        areaCode
        contains
        countryCode
        id
        isTollFree
        region
        zipCode
      }
    `,
  },
};

export const ASSIGNMENT_SETTINGS_QUERY = gql`
  query AssignmentSettings {
    contactcenter_number_assignment_settings {
      ...AssignmentSettings
    }
  }
  ${AssignmentSettings.fragments.assignmentSettings}
`;
