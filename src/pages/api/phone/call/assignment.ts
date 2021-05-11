import { NextApiRequest, NextApiResponse } from 'next';

const assignWorker = (req: NextApiRequest, res: NextApiResponse): void => {
  const taskAttributes = req.body.TaskAttributes
    ? JSON.parse(req.body.TaskAttributes)
    : {};
  const workerAttributes = req.body.WorkerAttributes
    ? JSON.parse(req.body.WorkerAttributes)
    : {};

  res.status(200).json({
    instruction: 'redirect',
    call_sid: taskAttributes.call_sid, // eslint-disable-line camelcase
    url: `${process.env.HOST}/api/phone/call/assignment_redirect/${workerAttributes.contact_uri}`,
    accept: true,
  });
};

export default assignWorker;
