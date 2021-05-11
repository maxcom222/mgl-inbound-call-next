/* eslint-disable functional/no-loop-statement */
/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable id-blacklist */
import { Request, Response } from 'express';
import gql from 'graphql-tag';
import { requestGQL } from '../../shared/http-client';

export const deletePublisherNumberHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log('req.body', req.body);

  const { phoneNumberId } = req.body;

  try {
    const UPDATE_NUMBERS_QUERY = gql`
      mutation updateNumbersData($id: Int!) {
        update_contactcenter_numbers(
          where: { id: { _eq: $id } }
          _set: {
            affiliateId: null,
            campaignId: null
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
        id: phoneNumberId,
      }
    });

    const updatedNumber = updateNumbersResponse.update_contactcenter_numbers;
    res.status(201).json(updatedNumber);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something broke!: ${error}`);
  }
}

export default deletePublisherNumberHandler;
