/* eslint-disable functional/no-loop-statement, camelcase */
import * as twilio from 'twilio';

import { API_URL } from './env';

const client = twilio(
  process.env.TWILIO_API_KEY_SID,
  process.env.TWILIO_API_KEY_SECRET,
  {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
  }
);

export const createOrUpdateQueue = async (
  workspaceSid,
  queue
): Promise<Record<string, any>> => {
  if (queue.taskQueueSid) {
    const updateQue = {
      ...queue
    };
    delete updateQue.taskQueueSid;
    delete updateQue.friendlyName;
    delete updateQue.filterFriendlyName;
    delete updateQue.expression;
    delete updateQue.targetWorkerExpression;
    delete updateQue.targetQueuePriority;
    console.log("updateQue --------> ", workspaceSid, queue.taskQueueSid, updateQue);

    return client.taskrouter
      .workspaces(workspaceSid)
      .taskQueues(queue.sid)
      .update(updateQue);
  } else {
    console.log("createQue", workspaceSid, queue.taskQueueSid);

    return client.taskrouter.workspaces(workspaceSid).taskQueues.create(queue);
  }
};

export const deleteTaskQueue = async (
  workspaceSid,
  queueSid
): Promise<boolean> => {
  console.log('queueSid ---------> ', queueSid);

  return client.taskrouter
    .workspaces(workspaceSid)
    .taskQueues(queueSid)
    .remove();
};

export const createOrUpdateWorkflow = async (
  workspaceSid,
  workflow,
  queues
): Promise<Record<string, any>> => {
  const workflowConfig: Record<string, any> = { task_routing: { filters: [] } };
  const targetValues = [];
  for (const queue of queues) {
    const target: Record<string, any> = {
      queue: queue.taskQueueSid,
    };

    if (queue.targetWorkerExpression) {
      target.expression = queue.targetWorkerExpression;
    }

    if (queue.targetQueuePriority) {
      target.priority = queue.targetQueuePriority;
    }

    targetValues.push(target);
  }

  const item: Record<string, any> = {
    targets: targetValues,
    expression: queues[0].expression,
    filterFriendlyName: queues[0].filterFriendlyName,
  };

  workflowConfig.task_routing.filters.push(item);
  console.log('workflowConfig ---------> ', targetValues);
  const payload = {
    sid: workflow.sid,
    friendlyName: workflow.friendlyName,
    assignmentCallbackUrl: `${API_URL}/api/phone/call/assignment`,
    fallbackAssignmentCallbackUrl: `${API_URL}/api/phone/call/assignment`,
    taskReservationTimeout: 1200,
    configuration: JSON.stringify(workflowConfig),
  };

  console.log('workflow sid1++++++++++++++++++', workflow.sid);
  if (workflow.sid) {
    console.log('workflow sid2++++++++++++++++++++', workflow.sid);

    return client.taskrouter
      .workspaces(workspaceSid)
      .workflows(workflow.sid)
      .update(payload);
  } else {
    return client.taskrouter.workspaces(workspaceSid).workflows.create(payload);
  }
};

export const createOrUpdateWorkflowWithQueue = async (
  workspaceSid,
  workflow,
  queue
): Promise<{ workflowSid: string; queueSid: string }> => {
  console.log('workflow sid1++++++++++++++++++', workflow.sid);
  const { sid: taskQueueSid } = await createOrUpdateQueue(workspaceSid, queue);
  console.log("taskQueueSid ------------> ", taskQueueSid)
  const queueWithSid = {
    ...queue,
    taskQueueSid,
  };

  const { sid: workflowSid } = await createOrUpdateWorkflow(
    workspaceSid,
    workflow,
    [queueWithSid]
  );

  return {
    workflowSid,
    queueSid: taskQueueSid,
  };
};

export const createWorkflow = async (
  workspaceSid,
  workflow,
  queues
): Promise<{ workflowSid: string }> => {
  console.log('workflow sid1++++++++++++++++++', workflow.sid);
  const { sid: workflowSid } = await createOrUpdateWorkflow(
    workspaceSid,
    workflow,
    queues
  );

  return {
    workflowSid
  };
}

export const createQueues = async (
  workspaceSid,
  queue
): Promise<{queueSid: string}> => {
  console.log('queue ----------> ', queue);
  const { sid: taskQueueSid } = await createOrUpdateQueue(workspaceSid, queue);
  console.log("taskQueueSid ------------> ", taskQueueSid);

  return {
    queueSid: taskQueueSid,
  }
}

export const updateWorkflow = async (
  workspaceSid,
  workflow,
): Promise<Record<string, any>> => {
  const payload = {
    friendlyName: workflow.friendlyName,
  }
  console.log('workflow ------------->', workspaceSid);

  return client.taskrouter
    .workspaces(workspaceSid)
    .workflows(workflow.sid)
    .update(payload);
}

export const deleteWorkflow = async (
  workspaceSid,
  sid
): Promise<boolean> => {
  console.log('workflow sid ------->', sid);

  return client.taskrouter.workspaces(workspaceSid).workflows(sid).remove();
}

export const createWorker = async (
  workspaceSid,
  target
): Promise<Record<string, any>> => {
  const worker = {
    friendlyName: target.name,
    attributes: JSON.stringify({
      ...target,
      contact_uri: target.instructions.number,
    }),
  };

  return client.taskrouter.workspaces(workspaceSid).workers.create(worker);
};

export const updateWorker = async (
  workspaceSid,
  target
): Promise<Record<string, any>> => {
  const worker = {
    activitySid: target.activity_sid,
    attributes: JSON.stringify({
      ...target,
      contact_uri: target.instructions.number,
    }),
  };
  console.log("update target value ------> ", target.workerSid);

  return client.taskrouter.workspaces(workspaceSid).workers(target.workerSid).update(worker);
};

export const deleteWorker = async (
  workspaceSid,
  sid
): Promise<boolean> => {
  console.log("delete target value ------> ", sid);

  return client.taskrouter.workspaces(workspaceSid).workers(sid).remove();
};

