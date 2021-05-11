import { gql } from '@apollo/client';

export const Tag = {
  fragments: {
    tag: gql`
      fragment Tag on contactcenter_tags {
        id
        name
        value
        type
        source
      }
    `,
  },
};

export const VIEW_TAGS = gql`
  query Tags {
    tags: contactcenter_tags{
      ...Tag
    }
  }
  ${Tag.fragments.tag}
`;
