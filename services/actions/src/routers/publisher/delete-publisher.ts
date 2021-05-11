/* eslint-disable id-blacklist */
/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
import { Request, Response } from 'express';
import gql from 'graphql-tag';
import { requestGQL } from '../../shared/http-client';

export const deletePublisherHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.body;

  try {
    const DELETE_AFFILIATE_QUERY = gql`
      mutation delete_affiliates($uuid: String!) {
        delete_contactcenter_affiliates(
          where: { id: { _eq: $uuid } }
        ) {
          affected_rows
          returning {
            id
          }
        }
      }
    `;

    const deleteAffiliatesResponse = await requestGQL({
      query: DELETE_AFFILIATE_QUERY,
      isAdmin: true,
      variables: {
        uuid: id
      }
    });

    console.log('deleteAffiliatesResponse --------> ', deleteAffiliatesResponse);

    res.status(201).json(deleteAffiliatesResponse);
  } catch(error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }
}

export default deletePublisherHandler;
