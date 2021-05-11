import { urlencoded, json } from 'body-parser';
import * as express from 'express';
import { newRouter } from './handler';
import * as cors from 'cors';

export const newServer = (): Promise<express.Express> =>
  Promise.resolve(
    express()
      .use(cors())
      .use(json())
      .use(urlencoded({ extended: true }))
      .set('trust proxy', true)
      .use(newRouter())
  );
