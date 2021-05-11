/* eslint-disable functional/no-loop-statement, camelcase */
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_API_KEY_SID,
  process.env.TWILIO_API_KEY_SECRET,
  {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
  }
);

const createOrUpdateQueue = async (
  workspaceSid,
  queue
): Promise<Record<string, any>> => {
  if (queue.sid) {
    return client.taskrouter
      .workspaces(workspaceSid)
      .taskQueues(queue.sid)
      .update(queue);
  } else {
    return client.taskrouter.workspaces(workspaceSid).taskQueues.create(queue);
  }
};

const createOrUpdateWorkflow = async (
  workspaceSid,
  workflow,
  queues
): Promise<Record<string, any>> => {
  const workflowConfig: Record<string, any> = { task_routing: { filters: [] } };

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

    const item: Record<string, any> = {
      targets: [target],
      expression: queue.expression,
      filterFriendlyName: queue.filterFriendlyName,
    };

    workflowConfig.task_routing.filters.push(item);
  }

  const payload = {
    sid: workflow.sid,
    friendlyName: workflow.friendlyName,
    assignmentCallbackUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/phone/call/assignment`,
    fallbackAssignmentCallbackUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/phone/call/assignment`,
    taskReservationTimeout: 1200,
    configuration: JSON.stringify(workflowConfig),
  };

  if (workflow.sid) {
    payload.friendlyName = 'Twilio Contact Center Workflow';

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
  const { sid: taskQueueSid } = await createOrUpdateQueue(workspaceSid, queue);
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
