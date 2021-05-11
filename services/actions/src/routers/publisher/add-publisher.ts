/* eslint-disable id-blacklist */
/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
import { Request, Response } from 'express';
import gql from 'graphql-tag';
import { requestGQL } from '../../shared/http-client';

export const addPublisherHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, subId, createNumbers, accessToRecordings, blockCallsIfCapped } = req.body;

  try {
    const ADD_AFFILATE_QUERY = gql`
      mutation add_affiliate($object: contactcenter_affiliates_insert_input!) {
        insert_contactcenter_affiliates_one(object: $object) {
          id
        }
      }
    `;

    const addAffiliatesResponse = await requestGQL({
      query: ADD_AFFILATE_QUERY,
      isAdmin: true,
      variables: {
        object: {
            name, subId, createNumbers, accessToRecordings, blockCallsIfCapped
        }
      }
    });

    console.log('addAffiliatesResponse ------> ', addAffiliatesResponse.insert_contactcenter_affiliates_one);

    res.status(201).json(addAffiliatesResponse);

  } catch(error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }
}

export default addPublisherHandler;
