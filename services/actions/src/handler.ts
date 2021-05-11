import { Response, Router } from 'express';
import actions from './actions';
import { withExpress } from 'hasura-node-types';
import { DEBUG } from './shared/env';
import { logger } from './shared/logger';
import { selectTeamHander } from './routers/ivr/select-team';
import { welcomeHandler } from './routers/ivr/welcome';
import { searchHandler } from './routers/numbers/search';
import { infoHandler } from './routers/numbers/info';
import { buyHandler } from './routers/numbers/buy';
import { campaignCreateHandler } from './routers/campaign/create';
import { assignmentHandler } from './routers/call/assignment';
import { assignmentRedirectHandler } from './routers/call/assignment-redirect';
import { targetCreateHandler } from './routers/target/create';
import { addCampaignRouteHandler } from './routers/campaign/add-route';
import { targetUpdateHandler } from './routers/target/update';
import { targetDeleteHandler } from './routers/target/delete';
import { campaignUpdateHandler } from './routers/campaign/update';
import { campaignDeleteHandler } from './routers/campaign/delete';
import { campaignSpamDetectionUpdateHandler } from './routers/campaign/updateSpamDetection';
import { deleteCallRouteHandler } from './routers/campaign/delete-route';
import { twimlappStatusCallbackhandler } from './routers/twimlapp-status-callback';
import { dialActionHandler } from './routers/dial-action-handler';
import { recordingStatusCallbackHandler } from './routers/recording-status-callback';
import { addCampaignPublisherHandler } from './routers/campaign/add-campaign-publisher';
import { addPublisherHandler } from './routers/publisher/add-publisher';
import { deletePublisherHandler } from './routers/publisher/delete-publisher';
import { addCampaignPayOutSettingHandler } from './routers/campaign/add-payout-setting';
import { setPriorityHandler } from './routers/campaign/set-priority';
import { setWeightHandler } from './routers/campaign/set-weight';
import { updateCampaignRouteHandler } from './routers/campaign/update-route';
import { updateCamapaignPayoutSettingHandler } from './routers/campaign/update-payout-setting';
import { deleteCampaignPayoutSettingHandler } from './routers/campaign/delete-payout-setting';
import { setCampaignPayoutSettingsHandler } from './routers/campaign/set-payout-setting';
import { setCampaignPublisherPayoutSettingsHandler } from './routers/campaign/set-publisher-payout-settings';
import { addPublisherNumberHandler } from './routers/campaign/add-publisher-number';
import { deletePublisherNumberHandler } from './routers/campaign/delete-publisher-number';
import { workspaceEventCallbackHandler } from './routers/workspace-event-callback';
import { deleteCampaignPublisherHandler } from './routers/campaign/delete-campaign-publisher';
import { addCampaignCallTrackingHandler } from './routers/campaign/add-call-tracking-tags';
import { deleteCampaignCallTrackingHandler } from './routers/campaign/delete-call-tracking-tag';

const healthHandler = (_, res: Response): Response =>
  res.status(200).send('OK');

export function newRouter(): Router {
  const router = Router();

  router.post(
    '/actions',
    withExpress({
      debug: DEBUG,
      logger,
    }).useActions(actions)
  );

  router.get('/health', healthHandler);

  router.get('/api/ivr/select-team', selectTeamHander);
  router.get('/api/ivr/welcome', welcomeHandler);
  router.post('/api/ivr/welcome', welcomeHandler);
  router.post('/api/workspace_event_callback', workspaceEventCallbackHandler);
  router.post('/api/phone/call/assignment', assignmentHandler);
  router.post('/api/twimlapp_status_callback', twimlappStatusCallbackhandler);
  router.get('/api/numbers/search', searchHandler);
  router.get('/api/numbers/info', infoHandler);
  router.post('/api/numbers/buy', buyHandler);
  router.post('/api/campaign/create', campaignCreateHandler);
  router.post('/api/campaign/update', campaignUpdateHandler);
  router.post('/api/campaign/set-priority', setPriorityHandler);
  router.post('/api/campaign/set-weight', setWeightHandler);
  router.post('/api/campaign/update-spam-detection', campaignSpamDetectionUpdateHandler);
  router.post('/api/campaign/delete', campaignDeleteHandler);
  router.post('/api/campaign/add-route', addCampaignRouteHandler);
  router.post('/api/campaign/delete-call-route', deleteCallRouteHandler);
  router.post('/api/campaign/add-campaign-publisher', addCampaignPublisherHandler);
  router.post('/api/campaign/delete-campaign-publisher', deleteCampaignPublisherHandler);
  router.post('/api/campaign/update-route', updateCampaignRouteHandler);
  router.post('/api/campaign/add-campaign-payout-setting', addCampaignPayOutSettingHandler);
  router.post('/api/campaign/update-campaign-payout-setting', updateCamapaignPayoutSettingHandler);
  router.post('/api/campaign/delete-campaign-payout-setting', deleteCampaignPayoutSettingHandler);
  router.post('/api/campaign/delete-call-tracking-tags', deleteCampaignCallTrackingHandler);
  router.post('/api/campaign/set-campaign-payout-settings', setCampaignPayoutSettingsHandler);
  router.post('/api/campaign/set-campaign-publisher-payout-settings', setCampaignPublisherPayoutSettingsHandler);
  router.post('/api/campaign/add-publisher-number', addPublisherNumberHandler);
  router.post('/api/campaign/delete-publisher-number', deletePublisherNumberHandler);
  router.post('/api/campaign/add-call-tracking-tags', addCampaignCallTrackingHandler)
  router.post('/api/publisher/add', addPublisherHandler);
  router.post('/api/publisher/delete', deletePublisherHandler);
  router.post(
    '/api/phone/call/assignment-redirect/:contact_uri',
    assignmentRedirectHandler
  );
  router.post('/api/dial_action_handler', dialActionHandler);
  router.post('/api/recording_status_callback', recordingStatusCallbackHandler);
  router.post('/api/target/create', targetCreateHandler);
  router.post('/api/target/update', targetUpdateHandler);
  router.post('/api/target/delete', targetDeleteHandler);

  return router;
}
