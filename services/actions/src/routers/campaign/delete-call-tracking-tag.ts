/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable id-blacklist */
import { Request, Response } from 'express';
import gql from 'graphql-tag';
import { requestGQL } from '../../shared/http-client';

export const deleteCampaignCallTrackingHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log('req.body', req.body);

  const { callTrackingId } = req.body;

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

    const DELETE_NUMBER_TAGS_QUERY = gql`
      mutation deleteNumberTags($id: Int!) {
        delete_contactcenter_number_tags(
          where: { id: { _eq: $id } }
        ) {
          affected_rows
          returning {
            id
          }
        }
      }
    `;

    const deleteNumberTagsResponse = await requestGQL({
      query: DELETE_NUMBER_TAGS_QUERY,
      isAdmin: true,
      variables: {
        id: callTrackingId,
      }
    });

    console.log('deleteNumberTagsResponse', deleteNumberTagsResponse.delete_contactcenter_number_tags);

    const DELETE_TAGS_QUERY = gql`
      mutation deleteTags($id: Int!) {
        delete_contactcenter_tags(
          where: { id: { _eq: $id } }
        ) {
          affected_rows
          returning {
            id
          } 
        }
      }
    `;

    const deleteTagsResponse = await requestGQL({
      query: DELETE_TAGS_QUERY,
      isAdmin: true,
      variables: {
        id: getNumberTagsResponse.contactcenter_number_tags[0].tagId,
      }
    });

    console.log('deleteTagsResponse', deleteTagsResponse.delete_contactcenter_tags);

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
        id: getNumberTagsResponse.contactcenter_number_tags[0].numberId
      }
    });

    console.log('updateNumbersResponse', updateNumbersResponse.update_contactcenter_numbers);

    res.status(201).json("successfully deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }
}

export default deleteCampaignCallTrackingHandler;
