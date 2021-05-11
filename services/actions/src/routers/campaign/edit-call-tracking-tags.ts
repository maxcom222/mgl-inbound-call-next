/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable id-blacklist */
import { Request, Response } from 'express';
import gql from 'graphql-tag';
import { requestGQL } from '../../shared/http-client';

export const editCampaignCallTrackingHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log('req.body', req.body);

  const { callTrackingId, tagName, replaceNumber } = req.body;

  try {
    const GET_NUMBER_TAGS_QUERY = gql`
      query getNumberTags($id: Int!) {
        contactcenter_number_tags(
          where: { id: { _eq: $id } }
        ) {
          numberId
          tagId
        }
      }
    `;

    const getNumberTagsResponse = await requestGQL({
      query: GET_NUMBER_TAGS_QUERY,
      isAdmin: true,
      variables: {
        id: callTrackingId
      }
    });

    console.log('getNumberTagsResponse', getNumberTagsResponse.contactcenter_number_tags);

    const UPDATE_TAGS_QUERY = gql`
      mutation updateTags($id: Int!, $name: String!, $value: String!) {
        update_contactcenter_number_tags(
          where: { id: { _eq: $id } }
          _set: {
            name: $name,
            value: $value
          }
        )
      }
    `;

    const updateTagsResponse = await requestGQL({
      query: UPDATE_TAGS_QUERY,
      isAdmin: true,
      variables: {
        id: getNumberTagsResponse.contactcenter_number_tags.tagId,
        name: tagName,
        value: replaceNumber
      }
    });

    console.log('updateTagsResponse', updateTagsResponse.update_contactcenter_number_tags);

    const UPDATE_NUMBERS_QUERY = gql`
      mutation updateNumbers($id: Int!) {
        update_contactcenter_numbers(
          where: { id: { _eq: $id } }
          _set: {
            numberPoolId: null
          }
        ) {
          affected_rows
          returning {
            id
          }
        }
      }
    `;

    const updateNumbersResponse = await requestGQL({
      query: UPDATE_NUMBERS_QUERY,
      isAdmin: true,
      variables: {
        id: getNumberTagsResponse.contactcenter_number_tags.numberId
      }
    });

    console.log('updateNumbersResponse', updateNumbersResponse.update_contactcenter_numbers);

    res.status(201).json(updateTagsResponse);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }
}

export default editCampaignCallTrackingHandler;
