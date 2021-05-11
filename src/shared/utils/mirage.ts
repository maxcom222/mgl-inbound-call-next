/* eslint-disable */
import { Server, Model } from 'miragejs';

export const makeServer = ({ environment = 'test' } = {}) => {
  var ENV = {
    api: {
      host: process.env.API_URL,
      namespace: 'api',
    },
  };

  if (environment === 'test') {
    ENV.api.host = '/';
  }
  let server = new Server({
    environment,

    models: {
      number: Model,
    },

    seeds(server) {
      server.create('number', {
        friendlyName: '(833) 972-2623',
        phoneNumber: '+18339722623',
        lata: null,
        locality: null,
        rateCenter: null,
        latitude: null,
        longitude: null,
        region: null,
        postalCode: null,
        isoCountry: 'US',
        addressRequirements: 'none',
        beta: false,
        capabilities: {
          voice: true,
          SMS: true,
          MMS: false,
          fax: true,
        },
        isTollFree: true,
      });
      server.create('number', {
        friendlyName: '(833) 975-2408',
        phoneNumber: '+18339752408',
        lata: null,
        locality: null,
        rateCenter: null,
        latitude: null,
        longitude: null,
        region: null,
        postalCode: null,
        isoCountry: 'US',
        addressRequirements: 'none',
        beta: false,
        capabilities: {
          voice: true,
          SMS: true,
          MMS: false,
          fax: true,
        },
        isTollFree: true,
      });
      server.create('number', {
        friendlyName: '(786) 304-2400',
        phoneNumber: '+17863042400',
        lata: null,
        locality: null,
        rateCenter: null,
        latitude: null,
        longitude: null,
        region: 'FL',
        postalCode: null,
        isoCountry: 'US',
        addressRequirements: 'none',
        beta: false,
        capabilities: {
          voice: true,
          SMS: true,
          MMS: true,
          fax: false,
        },
        isTollFree: false,
      });
    },

    routes() {
      this.urlPrefix = `${ENV.api.host}/${ENV.api.namespace}`;
      console.log(`here========= ${ENV.api.host}/${ENV.api.namespace}`);
      // this.namespace = '/api';
      this.passthrough(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/assets/**`);
      this.passthrough(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/_next/**`);
      this.passthrough(
        `http://${process.env.NEXT_PUBLIC_DATA_DOMAIN}/v1/graphql`
      );

      this.get('/numbers/search', (schema, request) => {
        const resourceType = request.queryParams['resource_type'];
        // const areaCode = request.queryParams['area_code'];
        return schema.numbers.where({
          isTollFree: resourceType === 'tollfree',
        });
      });

      this.post('/numbers/buy', () => ({
        account_sid: 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        address_requirements: 'none',
        address_sid: 'ADXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        api_version: '2010-04-01',
        beta: false,
        capabilities: {
          voice: true,
          sms: false,
          mms: true,
          fax: false,
        },
        date_created: 'Thu, 30 Jul 2015 23:19:04 +0000',
        date_updated: 'Thu, 30 Jul 2015 23:19:04 +0000',
        emergency_status: 'Active',
        emergency_address_sid: 'ADXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        friendly_name: 'friendly_name',
        identity_sid: 'RIXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        origin: 'origin',
        phone_number: '+18089255327',
        sid: 'PNXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        sms_application_sid: 'APXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        sms_fallback_method: 'GET',
        sms_fallback_url: 'https://example.com',
        sms_method: 'GET',
        sms_url: 'https://example.com',
        status_callback: 'https://example.com',
        status_callback_method: 'GET',
        trunk_sid: null,
        uri:
          '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/IncomingPhoneNumbers/PNXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.json',
        voice_application_sid: 'APXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        voice_caller_id_lookup: false,
        voice_fallback_method: 'GET',
        voice_fallback_url: 'https://example.com',
        voice_method: 'GET',
        voice_url: 'https://example.com',
        bundle_sid: 'BUXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        voice_receive_mode: 'voice',
        status: 'in-use',
      }));
    },
  });

  return server;
};

export default makeServer;
