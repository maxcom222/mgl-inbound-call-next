CREATE SCHEMA contactcenter;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA contactcenter;
CREATE TYPE contactcenter.comparison_type AS ENUM (
    'EQUALS',
    'CONTAINS',
    'BEGINS_WITH',
    'GREATER_THAN',
    'LESS_THAN',
    'EXISTS'
);
CREATE TYPE contactcenter.distribution_type AS ENUM (
    'WEIGHT_BY_TARGETS_AVAILABLE',
    'BY_CAMPAIGN'
);
CREATE TYPE contactcenter.duplicate_setting AS ENUM (
    'ON_CONNECT',
    'ON_INCOMMING',
    'ON_CALL_LENGTH'
);
CREATE TYPE contactcenter.iso_weekday_type AS ENUM (
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
);
CREATE TABLE contactcenter.accounts (
    id uuid DEFAULT contactcenter.uuid_generate_v4() NOT NULL,
    email character varying(255),
    name character varying(255),
    enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE contactcenter.affiliates (
    id uuid DEFAULT contactcenter.uuid_generate_v4() NOT NULL,
    "subId" character varying(255),
    "createNumbers" boolean DEFAULT false,
    "accessToRecordings" boolean DEFAULT false,
    "userIds" uuid[],
    "isSelf" boolean DEFAULT false,
    "blockCallsIfCapped" boolean DEFAULT false,
    name character varying(255),
    "accountId" uuid,
    enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE contactcenter.app_configuration (
    id integer NOT NULL,
    name character varying(255),
    data jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.app_configuration_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.app_configuration_id_seq OWNED BY contactcenter.app_configuration.id;
CREATE TABLE contactcenter.buyers (
    id uuid DEFAULT contactcenter.uuid_generate_v4() NOT NULL,
    email character varying(255),
    "canPauseTargets" boolean DEFAULT false,
    "canSetConcurrencyCaps" boolean DEFAULT false,
    "canDisputeConversions" boolean DEFAULT false,
    "subId" character varying(255),
    name character varying(255),
    "accountId" uuid,
    enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE contactcenter.call_conversion_settings (
    id integer NOT NULL,
    "conversionValue" numeric(8,2),
    "payoutValue" numeric(8,2),
    "conversionType" character varying(255),
    "conversionArgs" jsonb,
    "deDupeSettingId" integer,
    "callRouteId" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.call_conversion_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.call_conversion_settings_id_seq OWNED BY contactcenter.call_conversion_settings.id;
CREATE TABLE contactcenter.call_instructions (
    id integer NOT NULL,
    "connectionTimeOut" integer,
    "callType" character varying(255),
    number character varying(255),
    "sendDigits" character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.call_instructions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.call_instructions_id_seq OWNED BY contactcenter.call_instructions.id;
CREATE SEQUENCE contactcenter.call_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE contactcenter.call_logs (
    id integer DEFAULT nextval('contactcenter.call_logs_id_seq'::regclass) NOT NULL,
    "dtStamp" timestamp with time zone NOT NULL,
    "accountId" character varying,
    "campaignId" character varying,
    "campaignName" character varying,
    "affiliateId" integer,
    "affiliateName" character varying,
    number character varying,
    "numberPoolId" integer,
    "numberPoolName" character varying,
    "inboundCallId" integer,
    "inboundPhoneNumber" character varying,
    caller character varying,
    "callSid" character varying,
    "callerName" character varying,
    "callerCity" character varying,
    "callerState" character varying,
    "callerZip" character varying,
    "callerCountry" character varying,
    "callStatus" character varying,
    "taskSid" character varying,
    "taskQueueSid" character varying,
    "taskPriority" character varying,
    "workerSid" character varying,
    "workflowSid" character varying,
    "queueSid" character varying,
    "dialCallDuration" character varying,
    "dialCallSid" character varying,
    "dialCallStatus" character varying,
    "recordingDuration" character varying,
    "recordingSid" character varying,
    "previouseCallTargetName" character varying,
    "previouseCallCallId" boolean,
    "previouseCallDateTime" timestamp with time zone,
    "totalAmount" numeric,
    "targetName" character varying,
    "targetId" integer,
    "targetBuyerId" uuid,
    "targetBuyer" character varying,
    "timeToConnect" numeric,
    "callConnectionDt" timestamp with time zone,
    "targetNumber" character varying,
    "callLengthInSeconds" numeric,
    "callCompletedDt" timestamp with time zone,
    "payoutAmount" numeric,
    source character varying,
    "recordingUrl" character varying,
    "callConnectionLength" numeric,
    profit numeric,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE contactcenter.call_routes (
    id integer NOT NULL,
    "priorityId" integer,
    "callTargetId" integer,
    "callTargetGroupId" integer,
    "callPingTreeId" integer,
    "campaignId" integer,
    name character varying(255),
    "accountId" uuid NOT NULL,
    enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "queueSid" character varying
);
CREATE SEQUENCE contactcenter.call_routes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.call_routes_id_seq OWNED BY contactcenter.call_routes.id;
CREATE TABLE contactcenter.campaign_affiliates (
    id integer NOT NULL,
    "campaignId" integer,
    "affiliateId" uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.campaign_affiliates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.campaign_affiliates_id_seq OWNED BY contactcenter.campaign_affiliates.id;
CREATE TABLE contactcenter.campaign_call_routes (
    id integer NOT NULL,
    "campaignId" integer,
    "callRouteId" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.campaign_call_routes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.campaign_call_routes_id_seq OWNED BY contactcenter.campaign_call_routes.id;
CREATE TABLE contactcenter.campaigns (
    id integer NOT NULL,
    "userCampaignId" character varying(255),
    "numberDisplayFormat" character varying(255),
    "countryCode" character varying(255),
    completed boolean DEFAULT false,
    "distributionSetting" text,
    "offerId" character varying(255),
    "offerDraftId" character varying(255),
    "evalAnonymDuplication" boolean DEFAULT true,
    "payoutDupesGlobal" boolean DEFAULT false,
    "spamDetectionSettingsId" integer,
    "defaultNumberId" integer,
    "poolId" integer,
    "defaultTargetId" integer,
    "filterCallsThroughTCPAShield" boolean DEFAULT false,
    name character varying(255),
    "accountId" uuid,
    enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deDupeSettingsId" integer,
    "duplicateSettingsId" integer,
    "dialSettingsId" integer,
    "recordSettingId" integer,
    "workflowSid" character varying(255),
    "queueSid" character varying(255)
);
CREATE SEQUENCE contactcenter.campaigns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.campaigns_id_seq OWNED BY contactcenter.campaigns.id;
CREATE TABLE contactcenter.comparisons_type (
    value text NOT NULL
);
INSERT INTO contactcenter.comparisons_type (value) (SELECT unnest(enum_range(NULL::contactcenter.comparison_type))::text);
CREATE TABLE contactcenter.criterias (
    id integer NOT NULL,
    "comparisonType" text,
    value character varying(255),
    "isNegativeMatch" boolean DEFAULT false,
    "isNumber" boolean DEFAULT false,
    "tagRoutableRuleId" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tagId" character varying(255),
    "tagIds" jsonb
);
CREATE SEQUENCE contactcenter.criterias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.criterias_id_seq OWNED BY contactcenter.criterias.id;
CREATE TABLE contactcenter.dial_settings (
    id integer NOT NULL,
    "dialAttempts" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.dial_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.dial_settings_id_seq OWNED BY contactcenter.dial_settings.id;
CREATE TABLE contactcenter.distributions_type (
    value text NOT NULL
);
INSERT INTO contactcenter.distributions_type (value) (SELECT unnest(enum_range(NULL::contactcenter.distribution_type))::text);
CREATE TABLE contactcenter.duplicate_call_settings (
    id integer NOT NULL,
    "routeToOriginal" boolean DEFAULT false,
    "routeToDifferent" boolean DEFAULT false,
    strict boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.duplicate_call_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.duplicate_call_settings_id_seq OWNED BY contactcenter.duplicate_call_settings.id;
CREATE TABLE contactcenter.duplicate_setting_type (
    value text NOT NULL
);
INSERT INTO contactcenter.duplicate_setting_type (value) (SELECT unnest(enum_range(NULL::contactcenter.duplicate_setting))::text);
CREATE TABLE contactcenter.duplicate_settings (
    id integer NOT NULL,
    "secondsFromLastCall" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.duplicate_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.duplicate_settings_id_seq OWNED BY contactcenter.duplicate_settings.id;
CREATE TABLE contactcenter.integration_conversion_sets (
    id integer NOT NULL,
    name character varying(255),
    enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.integration_conversion_sets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.integration_conversion_sets_id_seq OWNED BY contactcenter.integration_conversion_sets.id;
CREATE TABLE contactcenter.integration_settings (
    id integer NOT NULL,
    "integrationId" integer,
    name character varying(255),
    "jsTagId" integer,
    configuration jsonb,
    "eventCode" character varying(255),
    "callerIdOnlyConversion" boolean DEFAULT false,
    "conversionSetId" integer,
    "numberId" integer,
    "accountId" uuid,
    enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.integration_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.integration_settings_id_seq OWNED BY contactcenter.integration_settings.id;
CREATE TABLE contactcenter.integrations (
    id integer NOT NULL,
    type character varying(255),
    "securityContextId" integer,
    "platformPrimaryId" integer,
    "platformSubId" integer,
    status character varying(255),
    name character varying(255),
    "accountId" uuid NOT NULL,
    enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.integrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.integrations_id_seq OWNED BY contactcenter.integrations.id;
CREATE TABLE contactcenter.iso_weekdays_type (
    value text NOT NULL
);
INSERT INTO contactcenter.iso_weekdays_type (value) (SELECT unnest(enum_range(NULL::contactcenter.iso_weekday_type))::text);
CREATE TABLE contactcenter.knex_migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);
CREATE SEQUENCE contactcenter.knex_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.knex_migrations_id_seq OWNED BY contactcenter.knex_migrations.id;
CREATE TABLE contactcenter.knex_migrations_lock (
    index integer NOT NULL,
    is_locked integer
);
CREATE SEQUENCE contactcenter.knex_migrations_lock_index_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.knex_migrations_lock_index_seq OWNED BY contactcenter.knex_migrations_lock.index;
CREATE TABLE contactcenter.mark_as_duplicate_settings (
    id integer NOT NULL,
    "duplicateSetting" text,
    "callLengthInSeconds" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.mark_as_duplicate_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.mark_as_duplicate_settings_id_seq OWNED BY contactcenter.mark_as_duplicate_settings.id;
CREATE TABLE contactcenter.missed_calls (
    id integer NOT NULL,
    "phoneNumber" character varying(255),
    "campaignId" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.missed_calls_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.missed_calls_id_seq OWNED BY contactcenter.missed_calls.id;
CREATE TABLE contactcenter.number_assignment_settings (
    id integer NOT NULL,
    "countryCode" character varying(255),
    region character varying(255),
    "areaCode" character varying(255),
    contains character varying(255),
    "zipCode" character varying(255),
    "isTollFree" boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.number_assignment_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.number_assignment_settings_id_seq OWNED BY contactcenter.number_assignment_settings.id;
CREATE TABLE contactcenter.number_tags (
    id integer NOT NULL,
    "numberId" integer,
    "tagId" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.number_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.number_tags_id_seq OWNED BY contactcenter.number_tags.id;
CREATE TABLE contactcenter.numbers (
    id integer NOT NULL,
    name character varying(255),
    "accountId" uuid,
    "friendlyName" character varying(255),
    "phoneNumber" character varying(255),
    lata character varying(255),
    locality character varying(255),
    "rateCenter" character varying(255),
    latitude numeric(8,2),
    longitude numeric(8,2),
    region character varying(255),
    "postalCode" character varying(255),
    "isoCountry" character varying(255),
    "addressRequirements" character varying(255),
    beta boolean DEFAULT false,
    capabilities jsonb,
    "numberPoolId" integer,
    "campaignId" integer,
    "jsTagId" integer,
    "offerId" integer,
    "allocationDT" timestamp with time zone,
    "lastBillDT" timestamp with time zone,
    "nextChargeDT" timestamp with time zone,
    "lastChargeDT" timestamp with time zone,
    "deAllocationDT" timestamp with time zone,
    "autoRenew" boolean DEFAULT true,
    "renewDOM" integer,
    "isTollFree" boolean DEFAULT false,
    "isActivated" boolean DEFAULT false,
    "assignmentSettingsId" integer,
    "deallocFlag" boolean DEFAULT false,
    "failedRechargeAttempts" integer,
    "isCarrierNumber" boolean DEFAULT false,
    "affiliateId" uuid,
    enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "localNumber" character varying(255),
    "displayNumber" character varying(255),
    provider character varying(255),
    "providerAccountId" character varying(255),
    "providerId" character varying(255),
    "carrierNumberId" character varying(255),
    "intSettingIds" character varying[]
);
CREATE SEQUENCE contactcenter.numbers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.numbers_id_seq OWNED BY contactcenter.numbers.id;
CREATE TABLE contactcenter.office_breaks (
    id integer NOT NULL,
    "startTimeId" integer,
    "lengthInMin" integer,
    "openSettingsId" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.office_breaks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.office_breaks_id_seq OWNED BY contactcenter.office_breaks.id;
CREATE TABLE contactcenter.open_settings (
    id integer NOT NULL,
    "openTimeId" integer,
    "closeTimeId" integer,
    inverted boolean DEFAULT false,
    "isClosed" boolean DEFAULT false,
    "scheduleId" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isoWeekday" text
);
CREATE SEQUENCE contactcenter.open_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.open_settings_id_seq OWNED BY contactcenter.open_settings.id;
CREATE TABLE contactcenter.operation_times (
    id integer NOT NULL,
    minute integer,
    hour integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.operation_times_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.operation_times_id_seq OWNED BY contactcenter.operation_times.id;
CREATE TABLE contactcenter.record_call_settings (
    id integer NOT NULL,
    record boolean DEFAULT true,
    "recordFromAnswer" boolean DEFAULT true,
    "trimSilence" boolean DEFAULT false,
    "dualChannelRecording" boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.record_call_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.record_call_settings_id_seq OWNED BY contactcenter.record_call_settings.id;
CREATE TABLE contactcenter.routing_priorities (
    id integer NOT NULL,
    priority integer,
    weight integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.routing_priorities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.routing_priorities_id_seq OWNED BY contactcenter.routing_priorities.id;
CREATE TABLE contactcenter.schedules_and_capacities (
    id integer NOT NULL,
    "concurrencyCap" integer,
    "timeZoneId" character varying(255),
    "allTimeSumCap" numeric(8,2),
    "monthlySumCap" numeric(8,2),
    "dailySumCap" numeric(8,2),
    "hourlySumCap" numeric(8,2),
    "allTimeCap" integer,
    "monthlyCap" integer,
    "dailyCap" integer,
    "hourlyCap" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.schedules_and_capacities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.schedules_and_capacities_id_seq OWNED BY contactcenter.schedules_and_capacities.id;
CREATE TABLE contactcenter.sip_numbers (
    id integer NOT NULL,
    number character varying(255),
    username character varying(255),
    password character varying(255),
    "callInstructionsId" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.sip_numbers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.sip_numbers_id_seq OWNED BY contactcenter.sip_numbers.id;
CREATE TABLE contactcenter.spam_detection_settings (
    id integer NOT NULL,
    "blockDuplicatesForSeconds" integer,
    "trackAnonymous" boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.spam_detection_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.spam_detection_settings_id_seq OWNED BY contactcenter.spam_detection_settings.id;
CREATE TABLE contactcenter.tag_routing_tables (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "targetCriteriaId" integer
);
CREATE SEQUENCE contactcenter.tag_routing_tables_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.tag_routing_tables_id_seq OWNED BY contactcenter.tag_routing_tables.id;
CREATE TABLE contactcenter.tags (
    id integer NOT NULL,
    name character varying(255),
    value character varying(255),
    type character varying(255),
    source character varying(255),
    "criteriaId" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.tags_id_seq OWNED BY contactcenter.tags.id;
CREATE TABLE contactcenter.target_criterias (
    id integer NOT NULL,
    "targetId" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE contactcenter.target_criterias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.target_criterias_id_seq OWNED BY contactcenter.target_criterias.id;
CREATE TABLE contactcenter.targets (
    id integer NOT NULL,
    "targetGroupId" character varying(255),
    "callInstructionsId" integer,
    "isHighRateTarget" boolean DEFAULT false,
    "subId" character varying(255),
    "targetCallIncrement" character varying(255),
    "ownerId" uuid,
    "conversionTimerOffset" integer,
    "scheduleId" integer,
    name character varying(255),
    "accountId" uuid,
    enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "workerSid" character varying,
    activity_sid character varying
);
CREATE SEQUENCE contactcenter.targets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE contactcenter.targets_id_seq OWNED BY contactcenter.targets.id;
ALTER TABLE ONLY contactcenter.app_configuration ALTER COLUMN id SET DEFAULT nextval('contactcenter.app_configuration_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.call_conversion_settings ALTER COLUMN id SET DEFAULT nextval('contactcenter.call_conversion_settings_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.call_instructions ALTER COLUMN id SET DEFAULT nextval('contactcenter.call_instructions_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.call_routes ALTER COLUMN id SET DEFAULT nextval('contactcenter.call_routes_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.campaign_affiliates ALTER COLUMN id SET DEFAULT nextval('contactcenter.campaign_affiliates_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.campaign_call_routes ALTER COLUMN id SET DEFAULT nextval('contactcenter.campaign_call_routes_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.campaigns ALTER COLUMN id SET DEFAULT nextval('contactcenter.campaigns_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.criterias ALTER COLUMN id SET DEFAULT nextval('contactcenter.criterias_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.dial_settings ALTER COLUMN id SET DEFAULT nextval('contactcenter.dial_settings_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.duplicate_call_settings ALTER COLUMN id SET DEFAULT nextval('contactcenter.duplicate_call_settings_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.duplicate_settings ALTER COLUMN id SET DEFAULT nextval('contactcenter.duplicate_settings_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.integration_conversion_sets ALTER COLUMN id SET DEFAULT nextval('contactcenter.integration_conversion_sets_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.integration_settings ALTER COLUMN id SET DEFAULT nextval('contactcenter.integration_settings_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.integrations ALTER COLUMN id SET DEFAULT nextval('contactcenter.integrations_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.knex_migrations ALTER COLUMN id SET DEFAULT nextval('contactcenter.knex_migrations_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.knex_migrations_lock ALTER COLUMN index SET DEFAULT nextval('contactcenter.knex_migrations_lock_index_seq'::regclass);
ALTER TABLE ONLY contactcenter.mark_as_duplicate_settings ALTER COLUMN id SET DEFAULT nextval('contactcenter.mark_as_duplicate_settings_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.missed_calls ALTER COLUMN id SET DEFAULT nextval('contactcenter.missed_calls_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.number_assignment_settings ALTER COLUMN id SET DEFAULT nextval('contactcenter.number_assignment_settings_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.number_tags ALTER COLUMN id SET DEFAULT nextval('contactcenter.number_tags_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.numbers ALTER COLUMN id SET DEFAULT nextval('contactcenter.numbers_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.office_breaks ALTER COLUMN id SET DEFAULT nextval('contactcenter.office_breaks_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.open_settings ALTER COLUMN id SET DEFAULT nextval('contactcenter.open_settings_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.operation_times ALTER COLUMN id SET DEFAULT nextval('contactcenter.operation_times_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.record_call_settings ALTER COLUMN id SET DEFAULT nextval('contactcenter.record_call_settings_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.routing_priorities ALTER COLUMN id SET DEFAULT nextval('contactcenter.routing_priorities_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.schedules_and_capacities ALTER COLUMN id SET DEFAULT nextval('contactcenter.schedules_and_capacities_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.sip_numbers ALTER COLUMN id SET DEFAULT nextval('contactcenter.sip_numbers_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.spam_detection_settings ALTER COLUMN id SET DEFAULT nextval('contactcenter.spam_detection_settings_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.tag_routing_tables ALTER COLUMN id SET DEFAULT nextval('contactcenter.tag_routing_tables_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.tags ALTER COLUMN id SET DEFAULT nextval('contactcenter.tags_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.target_criterias ALTER COLUMN id SET DEFAULT nextval('contactcenter.target_criterias_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.targets ALTER COLUMN id SET DEFAULT nextval('contactcenter.targets_id_seq'::regclass);
ALTER TABLE ONLY contactcenter.accounts
    ADD CONSTRAINT accounts_email_unique UNIQUE (email);
ALTER TABLE ONLY contactcenter.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.affiliates
    ADD CONSTRAINT affiliates_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.app_configuration
    ADD CONSTRAINT app_configuration_name_unique UNIQUE (name);
ALTER TABLE ONLY contactcenter.app_configuration
    ADD CONSTRAINT app_configuration_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.buyers
    ADD CONSTRAINT buyers_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.call_conversion_settings
    ADD CONSTRAINT call_conversion_settings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.call_instructions
    ADD CONSTRAINT call_instructions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.call_logs
    ADD CONSTRAINT call_logs_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.call_routes
    ADD CONSTRAINT call_routes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.campaign_affiliates
    ADD CONSTRAINT campaign_affiliates_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.campaign_call_routes
    ADD CONSTRAINT campaign_call_routes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.comparisons_type
    ADD CONSTRAINT comparisons_type_pkey PRIMARY KEY (value);
ALTER TABLE ONLY contactcenter.criterias
    ADD CONSTRAINT criterias_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.dial_settings
    ADD CONSTRAINT dial_settings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.distributions_type
    ADD CONSTRAINT distributions_type_pkey PRIMARY KEY (value);
ALTER TABLE ONLY contactcenter.duplicate_call_settings
    ADD CONSTRAINT duplicate_call_settings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.duplicate_setting_type
    ADD CONSTRAINT duplicate_setting_type_pkey PRIMARY KEY (value);
ALTER TABLE ONLY contactcenter.duplicate_settings
    ADD CONSTRAINT duplicate_settings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.integration_conversion_sets
    ADD CONSTRAINT integration_conversion_sets_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.integration_settings
    ADD CONSTRAINT integration_settings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.integrations
    ADD CONSTRAINT integrations_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.iso_weekdays_type
    ADD CONSTRAINT iso_weekdays_type_pkey PRIMARY KEY (value);
ALTER TABLE ONLY contactcenter.knex_migrations_lock
    ADD CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index);
ALTER TABLE ONLY contactcenter.knex_migrations
    ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.mark_as_duplicate_settings
    ADD CONSTRAINT mark_as_duplicate_settings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.missed_calls
    ADD CONSTRAINT missed_calls_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.number_assignment_settings
    ADD CONSTRAINT number_assignment_settings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.number_tags
    ADD CONSTRAINT number_tags_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.numbers
    ADD CONSTRAINT numbers_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.office_breaks
    ADD CONSTRAINT office_breaks_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.open_settings
    ADD CONSTRAINT open_settings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.operation_times
    ADD CONSTRAINT operation_times_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.record_call_settings
    ADD CONSTRAINT record_call_settings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.routing_priorities
    ADD CONSTRAINT routing_priorities_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.schedules_and_capacities
    ADD CONSTRAINT schedules_and_capacities_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.sip_numbers
    ADD CONSTRAINT sip_numbers_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.spam_detection_settings
    ADD CONSTRAINT spam_detection_settings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.tag_routing_tables
    ADD CONSTRAINT tag_routing_tables_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.target_criterias
    ADD CONSTRAINT target_criterias_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.targets
    ADD CONSTRAINT targets_pkey PRIMARY KEY (id);
ALTER TABLE ONLY contactcenter.affiliates
    ADD CONSTRAINT affiliates_accountid_foreign FOREIGN KEY ("accountId") REFERENCES contactcenter.accounts(id) ON DELETE CASCADE;
ALTER TABLE ONLY contactcenter.buyers
    ADD CONSTRAINT buyers_accountid_foreign FOREIGN KEY ("accountId") REFERENCES contactcenter.accounts(id) ON DELETE CASCADE;
ALTER TABLE ONLY contactcenter.call_conversion_settings
    ADD CONSTRAINT call_conversion_settings_callrouteid_foreign FOREIGN KEY ("callRouteId") REFERENCES contactcenter.call_routes(id);
ALTER TABLE ONLY contactcenter.call_conversion_settings
    ADD CONSTRAINT call_conversion_settings_dedupesettingid_foreign FOREIGN KEY ("deDupeSettingId") REFERENCES contactcenter.duplicate_settings(id);
ALTER TABLE ONLY contactcenter.call_routes
    ADD CONSTRAINT call_routes_accountid_foreign FOREIGN KEY ("accountId") REFERENCES contactcenter.accounts(id) ON DELETE CASCADE;
ALTER TABLE ONLY contactcenter.call_routes
    ADD CONSTRAINT call_routes_calltargetid_foreign FOREIGN KEY ("callTargetId") REFERENCES contactcenter.targets(id);
ALTER TABLE ONLY contactcenter.call_routes
    ADD CONSTRAINT call_routes_priorityid_foreign FOREIGN KEY ("priorityId") REFERENCES contactcenter.routing_priorities(id);
ALTER TABLE ONLY contactcenter.campaign_affiliates
    ADD CONSTRAINT campaign_affiliates_affiliateid_foreign FOREIGN KEY ("affiliateId") REFERENCES contactcenter.affiliates(id);
ALTER TABLE ONLY contactcenter.campaign_affiliates
    ADD CONSTRAINT campaign_affiliates_campaignid_foreign FOREIGN KEY ("campaignId") REFERENCES contactcenter.campaigns(id);
ALTER TABLE ONLY contactcenter.campaign_call_routes
    ADD CONSTRAINT campaign_call_routes_callrouteid_foreign FOREIGN KEY ("callRouteId") REFERENCES contactcenter.call_routes(id);
ALTER TABLE ONLY contactcenter.campaign_call_routes
    ADD CONSTRAINT campaign_call_routes_campaignid_foreign FOREIGN KEY ("campaignId") REFERENCES contactcenter.campaigns(id);
ALTER TABLE ONLY contactcenter.campaigns
    ADD CONSTRAINT campaigns_accountid_foreign FOREIGN KEY ("accountId") REFERENCES contactcenter.accounts(id) ON DELETE CASCADE;
ALTER TABLE ONLY contactcenter.campaigns
    ADD CONSTRAINT campaigns_dedupesettingsid_foreign FOREIGN KEY ("deDupeSettingsId") REFERENCES contactcenter.duplicate_call_settings(id);
ALTER TABLE ONLY contactcenter.campaigns
    ADD CONSTRAINT campaigns_defaultnumberid_foreign FOREIGN KEY ("defaultNumberId") REFERENCES contactcenter.numbers(id);
ALTER TABLE ONLY contactcenter.campaigns
    ADD CONSTRAINT campaigns_defaulttargetid_foreign FOREIGN KEY ("defaultTargetId") REFERENCES contactcenter.targets(id);
ALTER TABLE ONLY contactcenter.campaigns
    ADD CONSTRAINT campaigns_dialsettingsid_foreign FOREIGN KEY ("dialSettingsId") REFERENCES contactcenter.dial_settings(id);
ALTER TABLE ONLY contactcenter.campaigns
    ADD CONSTRAINT "campaigns_distributionSetting_fkey" FOREIGN KEY ("distributionSetting") REFERENCES contactcenter.distributions_type(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY contactcenter.campaigns
    ADD CONSTRAINT campaigns_duplicatesettingsid_foreign FOREIGN KEY ("duplicateSettingsId") REFERENCES contactcenter.mark_as_duplicate_settings(id);
ALTER TABLE ONLY contactcenter.campaigns
    ADD CONSTRAINT campaigns_recordsettingid_foreign FOREIGN KEY ("recordSettingId") REFERENCES contactcenter.record_call_settings(id);
ALTER TABLE ONLY contactcenter.campaigns
    ADD CONSTRAINT campaigns_spamdetectionsettingsid_foreign FOREIGN KEY ("spamDetectionSettingsId") REFERENCES contactcenter.spam_detection_settings(id);
ALTER TABLE ONLY contactcenter.criterias
    ADD CONSTRAINT "criterias_comparisonType_fkey" FOREIGN KEY ("comparisonType") REFERENCES contactcenter.comparisons_type(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY contactcenter.criterias
    ADD CONSTRAINT criterias_tagroutableruleid_foreign FOREIGN KEY ("tagRoutableRuleId") REFERENCES contactcenter.tag_routing_tables(id);
ALTER TABLE ONLY contactcenter.integration_settings
    ADD CONSTRAINT integration_settings_accountid_foreign FOREIGN KEY ("accountId") REFERENCES contactcenter.accounts(id) ON DELETE CASCADE;
ALTER TABLE ONLY contactcenter.integration_settings
    ADD CONSTRAINT integration_settings_conversionsetid_foreign FOREIGN KEY ("conversionSetId") REFERENCES contactcenter.integration_conversion_sets(id);
ALTER TABLE ONLY contactcenter.integration_settings
    ADD CONSTRAINT integration_settings_integrationid_foreign FOREIGN KEY ("integrationId") REFERENCES contactcenter.integrations(id);
ALTER TABLE ONLY contactcenter.integrations
    ADD CONSTRAINT integrations_accountid_foreign FOREIGN KEY ("accountId") REFERENCES contactcenter.accounts(id) ON DELETE CASCADE;
ALTER TABLE ONLY contactcenter.mark_as_duplicate_settings
    ADD CONSTRAINT "mark_as_duplicate_settings_duplicateSetting_fkey" FOREIGN KEY ("duplicateSetting") REFERENCES contactcenter.duplicate_setting_type(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY contactcenter.number_tags
    ADD CONSTRAINT number_tags_numberid_foreign FOREIGN KEY ("numberId") REFERENCES contactcenter.numbers(id);
ALTER TABLE ONLY contactcenter.number_tags
    ADD CONSTRAINT number_tags_tagid_foreign FOREIGN KEY ("tagId") REFERENCES contactcenter.tags(id);
ALTER TABLE ONLY contactcenter.numbers
    ADD CONSTRAINT numbers_accountid_foreign FOREIGN KEY ("accountId") REFERENCES contactcenter.accounts(id) ON DELETE CASCADE;
ALTER TABLE ONLY contactcenter.numbers
    ADD CONSTRAINT numbers_affiliateid_foreign FOREIGN KEY ("affiliateId") REFERENCES contactcenter.affiliates(id);
ALTER TABLE ONLY contactcenter.numbers
    ADD CONSTRAINT numbers_assignmentsettingsid_foreign FOREIGN KEY ("assignmentSettingsId") REFERENCES contactcenter.number_assignment_settings(id);
ALTER TABLE ONLY contactcenter.numbers
    ADD CONSTRAINT numbers_campaignid_foreign FOREIGN KEY ("campaignId") REFERENCES contactcenter.campaigns(id);
ALTER TABLE ONLY contactcenter.office_breaks
    ADD CONSTRAINT office_breaks_opensettingsid_foreign FOREIGN KEY ("openSettingsId") REFERENCES contactcenter.open_settings(id);
ALTER TABLE ONLY contactcenter.office_breaks
    ADD CONSTRAINT office_breaks_starttimeid_foreign FOREIGN KEY ("startTimeId") REFERENCES contactcenter.operation_times(id);
ALTER TABLE ONLY contactcenter.open_settings
    ADD CONSTRAINT open_settings_closetimeid_foreign FOREIGN KEY ("closeTimeId") REFERENCES contactcenter.operation_times(id);
ALTER TABLE ONLY contactcenter.open_settings
    ADD CONSTRAINT "open_settings_isoWeekday_fkey" FOREIGN KEY ("isoWeekday") REFERENCES contactcenter.iso_weekdays_type(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY contactcenter.open_settings
    ADD CONSTRAINT open_settings_opentimeid_foreign FOREIGN KEY ("openTimeId") REFERENCES contactcenter.operation_times(id);
ALTER TABLE ONLY contactcenter.open_settings
    ADD CONSTRAINT open_settings_scheduleid_foreign FOREIGN KEY ("scheduleId") REFERENCES contactcenter.schedules_and_capacities(id);
ALTER TABLE ONLY contactcenter.sip_numbers
    ADD CONSTRAINT sip_numbers_callinstructionsid_foreign FOREIGN KEY ("callInstructionsId") REFERENCES contactcenter.call_instructions(id);
ALTER TABLE ONLY contactcenter.tags
    ADD CONSTRAINT tags_criteriaid_foreign FOREIGN KEY ("criteriaId") REFERENCES contactcenter.criterias(id);
ALTER TABLE ONLY contactcenter.target_criterias
    ADD CONSTRAINT target_criterias_targetid_foreign FOREIGN KEY ("targetId") REFERENCES contactcenter.targets(id);
ALTER TABLE ONLY contactcenter.targets
    ADD CONSTRAINT targets_accountid_foreign FOREIGN KEY ("accountId") REFERENCES contactcenter.accounts(id) ON DELETE CASCADE;
ALTER TABLE ONLY contactcenter.targets
    ADD CONSTRAINT targets_callinstructionsid_foreign FOREIGN KEY ("callInstructionsId") REFERENCES contactcenter.call_instructions(id);
ALTER TABLE ONLY contactcenter.targets
    ADD CONSTRAINT targets_ownerid_foreign FOREIGN KEY ("ownerId") REFERENCES contactcenter.buyers(id);
ALTER TABLE ONLY contactcenter.targets
    ADD CONSTRAINT targets_scheduleid_foreign FOREIGN KEY ("scheduleId") REFERENCES contactcenter.schedules_and_capacities(id);
