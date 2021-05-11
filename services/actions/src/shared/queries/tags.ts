/* eslint-disable id-blacklist */
import gql from 'graphql-tag';

export const Tags = {
  fragments: {
    tags: gql`
      fragment Tags on contactcenter_tags {
        id
        name
        value
        type
        source
        criteriaId
      }
    `,
  },
};

export const TAGS_QUERY = gql`
  query Tags {
    contactcenter_tags {
      ...Tags
    }
  }
  ${Tags.fragments.tags}
`;