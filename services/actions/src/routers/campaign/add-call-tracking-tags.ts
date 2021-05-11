/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable id-blacklist */
import { Request, Response } from 'express';
import gql from 'graphql-tag';
import { requestGQL } from '../../shared/http-client';

export const addCampaignCallTrackingHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log('req.body', req.body);

  const { campaignId, tagName, numberId, replaceNumber, poolId } = req.body;

  const tagData = {
    name: tagName,
    value: replaceNumber,
    type: "Campaign",
    source: "Call"
  }
  try {
    const CREATE_CALL_TRACKING_TAGS = gql`
      mutation add_tags($object: contactcenter_tags_insert_input!) {
        insert_contactcenter_tags_one(object: $object) {
          id
        }
      }
    `;

    const createCallTrackingTagsResponse = await requestGQL({
      query: CREATE_CALL_TRACKING_TAGS,
      isAdmin: true,
      variables: {
        object: {
          ...tagData
        }
      }
    });

    console.log('createCallTrackingTagsResponse', createCallTrackingTagsResponse.insert_contactcenter_tags_one);

    const tagId = createCallTrackingTagsResponse.insert_contactcenter_tags_one.id;

    const numberTag = {
      numberId,
      campaignId,
      tagId
    }

    const CREATE_NUMBER_TAGS = gql`
      mutation add_number_tags($object: contactcenter_number_tags_insert_input!) {
        insert_contactcenter_number_tags_one(object: $object) {
          id
        }
      }
    `;

    const createNumberTagsResposne = await requestGQL({
      query: CREATE_NUMBER_TAGS,
      isAdmin: true,
      variables: {
        object: {
          ...numberTag
        }
      }
    });

    console.log('createNumberTagsResposne', createNumberTagsResposne.insert_contactcenter_number_tags_one);

    const UPDATE_NUMBERS_QUERY = gql`
      mutation update_numbers($id: Int!, $numberPoolId: Int!) {
        update_contactcenter_numbers(
          where: { id: { _eq: $id } }
          _set: {
            numberPoolId: $numberPoolId
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
        id: numberId,
        numberPoolId: poolId
      }
    });

    console.log('updateNumbersResponse', updateNumbersResponse.update_contactcenter_numbers);

    res.status(201).json(updateNumbersResponse.update_contactcenter_numbers);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }

}

export default addCampaignCallTrackingHandler;
