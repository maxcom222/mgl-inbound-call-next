--
-- PostgreSQL database dump
--

-- Dumped from database version 12.4 (Debian 12.4-1.pgdg100+1)
-- Dumped by pg_dump version 12.4 (Debian 12.4-1.pgdg100+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: contactcenter; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA contactcenter;


ALTER SCHEMA contactcenter OWNER TO postgres;

--
-- Name: hdb_catalog; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA hdb_catalog;


ALTER SCHEMA hdb_catalog OWNER TO postgres;

--
-- Name: hdb_views; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA hdb_views;


ALTER SCHEMA hdb_views OWNER TO postgres;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA contactcenter;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: comparison_type; Type: TYPE; Schema: contactcenter; Owner: postgres
--

CREATE TYPE contactcenter.comparison_type AS ENUM (
    'EQUALS',
    'CONTAINS',
    'BEGINS_WITH',
    'GREATER_THAN',
    'LESS_THAN',
    'EXISTS'
);


ALTER TYPE contactcenter.comparison_type OWNER TO postgres;

--
-- Name: distribution_type; Type: TYPE; Schema: contactcenter; Owner: postgres
--

CREATE TYPE contactcenter.distribution_type AS ENUM (
    'WEIGHT_BY_TARGETS_AVAILABLE',
    'BY_CAMPAIGN'
);


ALTER TYPE contactcenter.distribution_type OWNER TO postgres;

--
-- Name: duplicate_setting; Type: TYPE; Schema: contactcenter; Owner: postgres
--

CREATE TYPE contactcenter.duplicate_setting AS ENUM (
    'ON_CONNECT',
    'ON_INCOMMING',
    'ON_CALL_LENGTH'
);


ALTER TYPE contactcenter.duplicate_setting OWNER TO postgres;

--
-- Name: iso_weekday_type; Type: TYPE; Schema: contactcenter; Owner: postgres
--

CREATE TYPE contactcenter.iso_weekday_type AS ENUM (
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
);


ALTER TYPE contactcenter.iso_weekday_type OWNER TO postgres;

--
-- Name: check_violation(text); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.check_violation(msg text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
  BEGIN
    RAISE check_violation USING message=msg;
  END;
$$;


ALTER FUNCTION hdb_catalog.check_violation(msg text) OWNER TO postgres;

--
-- Name: hdb_schema_update_event_notifier(); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.hdb_schema_update_event_notifier() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  DECLARE
    instance_id uuid;
    occurred_at timestamptz;
    invalidations json;
    curr_rec record;
  BEGIN
    instance_id = NEW.instance_id;
    occurred_at = NEW.occurred_at;
    invalidations = NEW.invalidations;
    PERFORM pg_notify('hasura_schema_update', json_build_object(
      'instance_id', instance_id,
      'occurred_at', occurred_at,
      'invalidations', invalidations
      )::text);
    RETURN curr_rec;
  END;
$$;


ALTER FUNCTION hdb_catalog.hdb_schema_update_event_notifier() OWNER TO postgres;

--
-- Name: inject_table_defaults(text, text, text, text); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.inject_table_defaults(view_schema text, view_name text, tab_schema text, tab_name text) RETURNS void
    LANGUAGE plpgsql
    AS $$
    DECLARE
        r RECORD;
    BEGIN
      FOR r IN SELECT column_name, column_default FROM information_schema.columns WHERE table_schema = tab_schema AND table_name = tab_name AND column_default IS NOT NULL LOOP
          EXECUTE format('ALTER VIEW %I.%I ALTER COLUMN %I SET DEFAULT %s;', view_schema, view_name, r.column_name, r.column_default);
      END LOOP;
    END;
$$;


ALTER FUNCTION hdb_catalog.inject_table_defaults(view_schema text, view_name text, tab_schema text, tab_name text) OWNER TO postgres;

--
-- Name: insert_event_log(text, text, text, text, json); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.insert_event_log(schema_name text, table_name text, trigger_name text, op text, row_data json) RETURNS text
    LANGUAGE plpgsql
    AS $$
  DECLARE
    id text;
    payload json;
    session_variables json;
    server_version_num int;
    trace_context json;
  BEGIN
    id := gen_random_uuid();
    server_version_num := current_setting('server_version_num');
    IF server_version_num >= 90600 THEN
      session_variables := current_setting('hasura.user', 't');
      trace_context := current_setting('hasura.tracecontext', 't');
    ELSE
      BEGIN
        session_variables := current_setting('hasura.user');
      EXCEPTION WHEN OTHERS THEN
                  session_variables := NULL;
      END;
      BEGIN
        trace_context := current_setting('hasura.tracecontext');
      EXCEPTION WHEN OTHERS THEN
        trace_context := NULL;
      END;
    END IF;
    payload := json_build_object(
      'op', op,
      'data', row_data,
      'session_variables', session_variables,
      'trace_context', trace_context
    );
    INSERT INTO hdb_catalog.event_log
                (id, schema_name, table_name, trigger_name, payload)
    VALUES
    (id, schema_name, table_name, trigger_name, payload);
    RETURN id;
  END;
$$;


ALTER FUNCTION hdb_catalog.insert_event_log(schema_name text, table_name text, trigger_name text, op text, row_data json) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.accounts (
    id uuid DEFAULT contactcenter.uuid_generate_v4() NOT NULL,
    email character varying(255),
    name character varying(255),
    enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE contactcenter.accounts OWNER TO postgres;

--
-- Name: affiliates; Type: TABLE; Schema: contactcenter; Owner: postgres
--

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


ALTER TABLE contactcenter.affiliates OWNER TO postgres;

--
-- Name: app_configuration; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.app_configuration (
    id integer NOT NULL,
    name character varying(255),
    data jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE contactcenter.app_configuration OWNER TO postgres;

--
-- Name: app_configuration_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.app_configuration_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.app_configuration_id_seq OWNER TO postgres;

--
-- Name: app_configuration_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.app_configuration_id_seq OWNED BY contactcenter.app_configuration.id;


--
-- Name: buyers; Type: TABLE; Schema: contactcenter; Owner: postgres
--

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


ALTER TABLE contactcenter.buyers OWNER TO postgres;

--
-- Name: call_conversion_settings; Type: TABLE; Schema: contactcenter; Owner: postgres
--

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


ALTER TABLE contactcenter.call_conversion_settings OWNER TO postgres;

--
-- Name: call_conversion_settings_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.call_conversion_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.call_conversion_settings_id_seq OWNER TO postgres;

--
-- Name: call_conversion_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.call_conversion_settings_id_seq OWNED BY contactcenter.call_conversion_settings.id;


--
-- Name: call_instructions; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.call_instructions (
    id integer NOT NULL,
    "connectionTimeOut" integer,
    "callType" character varying(255),
    number character varying(255),
    "sendDigits" character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE contactcenter.call_instructions OWNER TO postgres;

--
-- Name: call_instructions_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.call_instructions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.call_instructions_id_seq OWNER TO postgres;

--
-- Name: call_instructions_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.call_instructions_id_seq OWNED BY contactcenter.call_instructions.id;


--
-- Name: call_logs_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.call_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.call_logs_id_seq OWNER TO postgres;

--
-- Name: call_logs; Type: TABLE; Schema: contactcenter; Owner: postgres
--

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


ALTER TABLE contactcenter.call_logs OWNER TO postgres;

--
-- Name: call_routes; Type: TABLE; Schema: contactcenter; Owner: postgres
--

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


ALTER TABLE contactcenter.call_routes OWNER TO postgres;

--
-- Name: call_routes_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.call_routes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.call_routes_id_seq OWNER TO postgres;

--
-- Name: call_routes_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.call_routes_id_seq OWNED BY contactcenter.call_routes.id;


--
-- Name: campaign_affiliates; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.campaign_affiliates (
    id integer NOT NULL,
    "campaignId" integer,
    "affiliateId" uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE contactcenter.campaign_affiliates OWNER TO postgres;

--
-- Name: campaign_affiliates_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.campaign_affiliates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.campaign_affiliates_id_seq OWNER TO postgres;

--
-- Name: campaign_affiliates_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.campaign_affiliates_id_seq OWNED BY contactcenter.campaign_affiliates.id;


--
-- Name: campaign_call_routes; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.campaign_call_routes (
    id integer NOT NULL,
    "campaignId" integer,
    "callRouteId" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE contactcenter.campaign_call_routes OWNER TO postgres;

--
-- Name: campaign_call_routes_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.campaign_call_routes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.campaign_call_routes_id_seq OWNER TO postgres;

--
-- Name: campaign_call_routes_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.campaign_call_routes_id_seq OWNED BY contactcenter.campaign_call_routes.id;


--
-- Name: campaigns; Type: TABLE; Schema: contactcenter; Owner: postgres
--

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


ALTER TABLE contactcenter.campaigns OWNER TO postgres;

--
-- Name: campaigns_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.campaigns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.campaigns_id_seq OWNER TO postgres;

--
-- Name: campaigns_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.campaigns_id_seq OWNED BY contactcenter.campaigns.id;


--
-- Name: comparisons_type; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.comparisons_type (
    value text NOT NULL
);


ALTER TABLE contactcenter.comparisons_type OWNER TO postgres;

--
-- Name: criterias; Type: TABLE; Schema: contactcenter; Owner: postgres
--

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


ALTER TABLE contactcenter.criterias OWNER TO postgres;

--
-- Name: criterias_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.criterias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.criterias_id_seq OWNER TO postgres;

--
-- Name: criterias_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.criterias_id_seq OWNED BY contactcenter.criterias.id;


--
-- Name: dial_settings; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.dial_settings (
    id integer NOT NULL,
    "dialAttempts" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE contactcenter.dial_settings OWNER TO postgres;

--
-- Name: dial_settings_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.dial_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.dial_settings_id_seq OWNER TO postgres;

--
-- Name: dial_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.dial_settings_id_seq OWNED BY contactcenter.dial_settings.id;


--
-- Name: distributions_type; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.distributions_type (
    value text NOT NULL
);


ALTER TABLE contactcenter.distributions_type OWNER TO postgres;

--
-- Name: duplicate_call_settings; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.duplicate_call_settings (
    id integer NOT NULL,
    "routeToOriginal" boolean DEFAULT false,
    "routeToDifferent" boolean DEFAULT false,
    strict boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE contactcenter.duplicate_call_settings OWNER TO postgres;

--
-- Name: duplicate_call_settings_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.duplicate_call_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.duplicate_call_settings_id_seq OWNER TO postgres;

--
-- Name: duplicate_call_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.duplicate_call_settings_id_seq OWNED BY contactcenter.duplicate_call_settings.id;


--
-- Name: duplicate_setting_type; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.duplicate_setting_type (
    value text NOT NULL
);


ALTER TABLE contactcenter.duplicate_setting_type OWNER TO postgres;

--
-- Name: duplicate_settings; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.duplicate_settings (
    id integer NOT NULL,
    "secondsFromLastCall" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE contactcenter.duplicate_settings OWNER TO postgres;

--
-- Name: duplicate_settings_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.duplicate_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.duplicate_settings_id_seq OWNER TO postgres;

--
-- Name: duplicate_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.duplicate_settings_id_seq OWNED BY contactcenter.duplicate_settings.id;


--
-- Name: integration_conversion_sets; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.integration_conversion_sets (
    id integer NOT NULL,
    name character varying(255),
    enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE contactcenter.integration_conversion_sets OWNER TO postgres;

--
-- Name: integration_conversion_sets_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.integration_conversion_sets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.integration_conversion_sets_id_seq OWNER TO postgres;

--
-- Name: integration_conversion_sets_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.integration_conversion_sets_id_seq OWNED BY contactcenter.integration_conversion_sets.id;


--
-- Name: integration_settings; Type: TABLE; Schema: contactcenter; Owner: postgres
--

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


ALTER TABLE contactcenter.integration_settings OWNER TO postgres;

--
-- Name: integration_settings_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.integration_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.integration_settings_id_seq OWNER TO postgres;

--
-- Name: integration_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.integration_settings_id_seq OWNED BY contactcenter.integration_settings.id;


--
-- Name: integrations; Type: TABLE; Schema: contactcenter; Owner: postgres
--

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


ALTER TABLE contactcenter.integrations OWNER TO postgres;

--
-- Name: integrations_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.integrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.integrations_id_seq OWNER TO postgres;

--
-- Name: integrations_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.integrations_id_seq OWNED BY contactcenter.integrations.id;


--
-- Name: iso_weekdays_type; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.iso_weekdays_type (
    value text NOT NULL
);


ALTER TABLE contactcenter.iso_weekdays_type OWNER TO postgres;

--
-- Name: knex_migrations; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.knex_migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);


ALTER TABLE contactcenter.knex_migrations OWNER TO postgres;

--
-- Name: knex_migrations_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.knex_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.knex_migrations_id_seq OWNER TO postgres;

--
-- Name: knex_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.knex_migrations_id_seq OWNED BY contactcenter.knex_migrations.id;


--
-- Name: knex_migrations_lock; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.knex_migrations_lock (
    index integer NOT NULL,
    is_locked integer
);


ALTER TABLE contactcenter.knex_migrations_lock OWNER TO postgres;

--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.knex_migrations_lock_index_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.knex_migrations_lock_index_seq OWNER TO postgres;

--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.knex_migrations_lock_index_seq OWNED BY contactcenter.knex_migrations_lock.index;


--
-- Name: mark_as_duplicate_settings; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.mark_as_duplicate_settings (
    id integer NOT NULL,
    "duplicateSetting" text,
    "callLengthInSeconds" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE contactcenter.mark_as_duplicate_settings OWNER TO postgres;

--
-- Name: mark_as_duplicate_settings_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.mark_as_duplicate_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.mark_as_duplicate_settings_id_seq OWNER TO postgres;

--
-- Name: mark_as_duplicate_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.mark_as_duplicate_settings_id_seq OWNED BY contactcenter.mark_as_duplicate_settings.id;


--
-- Name: missed_calls; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.missed_calls (
    id integer NOT NULL,
    "phoneNumber" character varying(255),
    "campaignId" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE contactcenter.missed_calls OWNER TO postgres;

--
-- Name: missed_calls_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.missed_calls_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.missed_calls_id_seq OWNER TO postgres;

--
-- Name: missed_calls_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.missed_calls_id_seq OWNED BY contactcenter.missed_calls.id;


--
-- Name: number_assignment_settings; Type: TABLE; Schema: contactcenter; Owner: postgres
--

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


ALTER TABLE contactcenter.number_assignment_settings OWNER TO postgres;

--
-- Name: number_assignment_settings_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.number_assignment_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.number_assignment_settings_id_seq OWNER TO postgres;

--
-- Name: number_assignment_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.number_assignment_settings_id_seq OWNED BY contactcenter.number_assignment_settings.id;


--
-- Name: number_tags; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.number_tags (
    id integer NOT NULL,
    "numberId" integer,
    "tagId" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE contactcenter.number_tags OWNER TO postgres;

--
-- Name: number_tags_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.number_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.number_tags_id_seq OWNER TO postgres;

--
-- Name: number_tags_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.number_tags_id_seq OWNED BY contactcenter.number_tags.id;


--
-- Name: numbers; Type: TABLE; Schema: contactcenter; Owner: postgres
--

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


ALTER TABLE contactcenter.numbers OWNER TO postgres;

--
-- Name: numbers_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.numbers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.numbers_id_seq OWNER TO postgres;

--
-- Name: numbers_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.numbers_id_seq OWNED BY contactcenter.numbers.id;


--
-- Name: office_breaks; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.office_breaks (
    id integer NOT NULL,
    "startTimeId" integer,
    "lengthInMin" integer,
    "openSettingsId" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE contactcenter.office_breaks OWNER TO postgres;

--
-- Name: office_breaks_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.office_breaks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.office_breaks_id_seq OWNER TO postgres;

--
-- Name: office_breaks_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.office_breaks_id_seq OWNED BY contactcenter.office_breaks.id;


--
-- Name: open_settings; Type: TABLE; Schema: contactcenter; Owner: postgres
--

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


ALTER TABLE contactcenter.open_settings OWNER TO postgres;

--
-- Name: open_settings_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.open_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.open_settings_id_seq OWNER TO postgres;

--
-- Name: open_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.open_settings_id_seq OWNED BY contactcenter.open_settings.id;


--
-- Name: operation_times; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.operation_times (
    id integer NOT NULL,
    minute integer,
    hour integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE contactcenter.operation_times OWNER TO postgres;

--
-- Name: operation_times_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.operation_times_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.operation_times_id_seq OWNER TO postgres;

--
-- Name: operation_times_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.operation_times_id_seq OWNED BY contactcenter.operation_times.id;


--
-- Name: record_call_settings; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.record_call_settings (
    id integer NOT NULL,
    record boolean DEFAULT true,
    "recordFromAnswer" boolean DEFAULT true,
    "trimSilence" boolean DEFAULT false,
    "dualChannelRecording" boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE contactcenter.record_call_settings OWNER TO postgres;

--
-- Name: record_call_settings_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.record_call_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.record_call_settings_id_seq OWNER TO postgres;

--
-- Name: record_call_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.record_call_settings_id_seq OWNED BY contactcenter.record_call_settings.id;


--
-- Name: routing_priorities; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.routing_priorities (
    id integer NOT NULL,
    priority integer,
    weight integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE contactcenter.routing_priorities OWNER TO postgres;

--
-- Name: routing_priorities_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.routing_priorities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.routing_priorities_id_seq OWNER TO postgres;

--
-- Name: routing_priorities_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.routing_priorities_id_seq OWNED BY contactcenter.routing_priorities.id;


--
-- Name: schedules_and_capacities; Type: TABLE; Schema: contactcenter; Owner: postgres
--

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


ALTER TABLE contactcenter.schedules_and_capacities OWNER TO postgres;

--
-- Name: schedules_and_capacities_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.schedules_and_capacities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.schedules_and_capacities_id_seq OWNER TO postgres;

--
-- Name: schedules_and_capacities_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.schedules_and_capacities_id_seq OWNED BY contactcenter.schedules_and_capacities.id;


--
-- Name: sip_numbers; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.sip_numbers (
    id integer NOT NULL,
    number character varying(255),
    username character varying(255),
    password character varying(255),
    "callInstructionsId" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE contactcenter.sip_numbers OWNER TO postgres;

--
-- Name: sip_numbers_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.sip_numbers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.sip_numbers_id_seq OWNER TO postgres;

--
-- Name: sip_numbers_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.sip_numbers_id_seq OWNED BY contactcenter.sip_numbers.id;


--
-- Name: spam_detection_settings; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.spam_detection_settings (
    id integer NOT NULL,
    "blockDuplicatesForSeconds" integer,
    "trackAnonymous" boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE contactcenter.spam_detection_settings OWNER TO postgres;

--
-- Name: spam_detection_settings_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.spam_detection_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.spam_detection_settings_id_seq OWNER TO postgres;

--
-- Name: spam_detection_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.spam_detection_settings_id_seq OWNED BY contactcenter.spam_detection_settings.id;


--
-- Name: tag_routing_tables; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.tag_routing_tables (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "targetCriteriaId" integer
);


ALTER TABLE contactcenter.tag_routing_tables OWNER TO postgres;

--
-- Name: tag_routing_tables_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.tag_routing_tables_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.tag_routing_tables_id_seq OWNER TO postgres;

--
-- Name: tag_routing_tables_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.tag_routing_tables_id_seq OWNED BY contactcenter.tag_routing_tables.id;


--
-- Name: tags; Type: TABLE; Schema: contactcenter; Owner: postgres
--

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


ALTER TABLE contactcenter.tags OWNER TO postgres;

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.tags_id_seq OWNER TO postgres;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.tags_id_seq OWNED BY contactcenter.tags.id;


--
-- Name: target_criterias; Type: TABLE; Schema: contactcenter; Owner: postgres
--

CREATE TABLE contactcenter.target_criterias (
    id integer NOT NULL,
    "targetId" integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE contactcenter.target_criterias OWNER TO postgres;

--
-- Name: target_criterias_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.target_criterias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.target_criterias_id_seq OWNER TO postgres;

--
-- Name: target_criterias_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.target_criterias_id_seq OWNED BY contactcenter.target_criterias.id;


--
-- Name: targets; Type: TABLE; Schema: contactcenter; Owner: postgres
--

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


ALTER TABLE contactcenter.targets OWNER TO postgres;

--
-- Name: targets_id_seq; Type: SEQUENCE; Schema: contactcenter; Owner: postgres
--

CREATE SEQUENCE contactcenter.targets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactcenter.targets_id_seq OWNER TO postgres;

--
-- Name: targets_id_seq; Type: SEQUENCE OWNED BY; Schema: contactcenter; Owner: postgres
--

ALTER SEQUENCE contactcenter.targets_id_seq OWNED BY contactcenter.targets.id;


--
-- Name: event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.event_invocation_logs (
    id text DEFAULT public.gen_random_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.event_invocation_logs OWNER TO postgres;

--
-- Name: event_log; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.event_log (
    id text DEFAULT public.gen_random_uuid() NOT NULL,
    schema_name text NOT NULL,
    table_name text NOT NULL,
    trigger_name text NOT NULL,
    payload jsonb NOT NULL,
    delivered boolean DEFAULT false NOT NULL,
    error boolean DEFAULT false NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    locked boolean DEFAULT false NOT NULL,
    next_retry_at timestamp without time zone,
    archived boolean DEFAULT false NOT NULL
);


ALTER TABLE hdb_catalog.event_log OWNER TO postgres;

--
-- Name: event_triggers; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.event_triggers (
    name text NOT NULL,
    type text NOT NULL,
    schema_name text NOT NULL,
    table_name text NOT NULL,
    configuration json,
    comment text
);


ALTER TABLE hdb_catalog.event_triggers OWNER TO postgres;

--
-- Name: hdb_action; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_action (
    action_name text NOT NULL,
    action_defn jsonb NOT NULL,
    comment text,
    is_system_defined boolean DEFAULT false
);


ALTER TABLE hdb_catalog.hdb_action OWNER TO postgres;

--
-- Name: hdb_action_log; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_action_log (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    action_name text,
    input_payload jsonb NOT NULL,
    request_headers jsonb NOT NULL,
    session_variables jsonb NOT NULL,
    response_payload jsonb,
    errors jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    response_received_at timestamp with time zone,
    status text NOT NULL,
    CONSTRAINT hdb_action_log_status_check CHECK ((status = ANY (ARRAY['created'::text, 'processing'::text, 'completed'::text, 'error'::text])))
);


ALTER TABLE hdb_catalog.hdb_action_log OWNER TO postgres;

--
-- Name: hdb_action_permission; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_action_permission (
    action_name text NOT NULL,
    role_name text NOT NULL,
    definition jsonb DEFAULT '{}'::jsonb NOT NULL,
    comment text
);


ALTER TABLE hdb_catalog.hdb_action_permission OWNER TO postgres;

--
-- Name: hdb_allowlist; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_allowlist (
    collection_name text
);


ALTER TABLE hdb_catalog.hdb_allowlist OWNER TO postgres;

--
-- Name: hdb_check_constraint; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_check_constraint AS
 SELECT (n.nspname)::text AS table_schema,
    (ct.relname)::text AS table_name,
    (r.conname)::text AS constraint_name,
    pg_get_constraintdef(r.oid, true) AS "check"
   FROM ((pg_constraint r
     JOIN pg_class ct ON ((r.conrelid = ct.oid)))
     JOIN pg_namespace n ON ((ct.relnamespace = n.oid)))
  WHERE (r.contype = 'c'::"char");


ALTER TABLE hdb_catalog.hdb_check_constraint OWNER TO postgres;

--
-- Name: hdb_computed_field; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_computed_field (
    table_schema text NOT NULL,
    table_name text NOT NULL,
    computed_field_name text NOT NULL,
    definition jsonb NOT NULL,
    comment text
);


ALTER TABLE hdb_catalog.hdb_computed_field OWNER TO postgres;

--
-- Name: hdb_computed_field_function; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_computed_field_function AS
 SELECT hdb_computed_field.table_schema,
    hdb_computed_field.table_name,
    hdb_computed_field.computed_field_name,
        CASE
            WHEN (((hdb_computed_field.definition -> 'function'::text) ->> 'name'::text) IS NULL) THEN (hdb_computed_field.definition ->> 'function'::text)
            ELSE ((hdb_computed_field.definition -> 'function'::text) ->> 'name'::text)
        END AS function_name,
        CASE
            WHEN (((hdb_computed_field.definition -> 'function'::text) ->> 'schema'::text) IS NULL) THEN 'public'::text
            ELSE ((hdb_computed_field.definition -> 'function'::text) ->> 'schema'::text)
        END AS function_schema
   FROM hdb_catalog.hdb_computed_field;


ALTER TABLE hdb_catalog.hdb_computed_field_function OWNER TO postgres;

--
-- Name: hdb_cron_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_cron_event_invocation_logs (
    id text DEFAULT public.gen_random_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.hdb_cron_event_invocation_logs OWNER TO postgres;

--
-- Name: hdb_cron_events; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_cron_events (
    id text DEFAULT public.gen_random_uuid() NOT NULL,
    trigger_name text NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


ALTER TABLE hdb_catalog.hdb_cron_events OWNER TO postgres;

--
-- Name: hdb_cron_triggers; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_cron_triggers (
    name text NOT NULL,
    webhook_conf json NOT NULL,
    cron_schedule text NOT NULL,
    payload json,
    retry_conf json,
    header_conf json,
    include_in_metadata boolean DEFAULT false NOT NULL,
    comment text
);


ALTER TABLE hdb_catalog.hdb_cron_triggers OWNER TO postgres;

--
-- Name: hdb_cron_events_stats; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_cron_events_stats AS
 SELECT ct.name,
    COALESCE(ce.upcoming_events_count, (0)::bigint) AS upcoming_events_count,
    COALESCE(ce.max_scheduled_time, now()) AS max_scheduled_time
   FROM (hdb_catalog.hdb_cron_triggers ct
     LEFT JOIN ( SELECT hdb_cron_events.trigger_name,
            count(*) AS upcoming_events_count,
            max(hdb_cron_events.scheduled_time) AS max_scheduled_time
           FROM hdb_catalog.hdb_cron_events
          WHERE ((hdb_cron_events.tries = 0) AND (hdb_cron_events.status = 'scheduled'::text))
          GROUP BY hdb_cron_events.trigger_name) ce ON ((ct.name = ce.trigger_name)));


ALTER TABLE hdb_catalog.hdb_cron_events_stats OWNER TO postgres;

--
-- Name: hdb_custom_types; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_custom_types (
    custom_types jsonb NOT NULL
);


ALTER TABLE hdb_catalog.hdb_custom_types OWNER TO postgres;

--
-- Name: hdb_foreign_key_constraint; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_foreign_key_constraint AS
 SELECT (q.table_schema)::text AS table_schema,
    (q.table_name)::text AS table_name,
    (q.constraint_name)::text AS constraint_name,
    (min(q.constraint_oid))::integer AS constraint_oid,
    min((q.ref_table_table_schema)::text) AS ref_table_table_schema,
    min((q.ref_table)::text) AS ref_table,
    json_object_agg(ac.attname, afc.attname) AS column_mapping,
    min((q.confupdtype)::text) AS on_update,
    min((q.confdeltype)::text) AS on_delete,
    json_agg(ac.attname) AS columns,
    json_agg(afc.attname) AS ref_columns
   FROM ((( SELECT ctn.nspname AS table_schema,
            ct.relname AS table_name,
            r.conrelid AS table_id,
            r.conname AS constraint_name,
            r.oid AS constraint_oid,
            cftn.nspname AS ref_table_table_schema,
            cft.relname AS ref_table,
            r.confrelid AS ref_table_id,
            r.confupdtype,
            r.confdeltype,
            unnest(r.conkey) AS column_id,
            unnest(r.confkey) AS ref_column_id
           FROM ((((pg_constraint r
             JOIN pg_class ct ON ((r.conrelid = ct.oid)))
             JOIN pg_namespace ctn ON ((ct.relnamespace = ctn.oid)))
             JOIN pg_class cft ON ((r.confrelid = cft.oid)))
             JOIN pg_namespace cftn ON ((cft.relnamespace = cftn.oid)))
          WHERE (r.contype = 'f'::"char")) q
     JOIN pg_attribute ac ON (((q.column_id = ac.attnum) AND (q.table_id = ac.attrelid))))
     JOIN pg_attribute afc ON (((q.ref_column_id = afc.attnum) AND (q.ref_table_id = afc.attrelid))))
  GROUP BY q.table_schema, q.table_name, q.constraint_name;


ALTER TABLE hdb_catalog.hdb_foreign_key_constraint OWNER TO postgres;

--
-- Name: hdb_function; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_function (
    function_schema text NOT NULL,
    function_name text NOT NULL,
    configuration jsonb DEFAULT '{}'::jsonb NOT NULL,
    is_system_defined boolean DEFAULT false
);


ALTER TABLE hdb_catalog.hdb_function OWNER TO postgres;

--
-- Name: hdb_function_agg; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_function_agg AS
 SELECT (p.proname)::text AS function_name,
    (pn.nspname)::text AS function_schema,
    pd.description,
        CASE
            WHEN (p.provariadic = (0)::oid) THEN false
            ELSE true
        END AS has_variadic,
        CASE
            WHEN ((p.provolatile)::text = ('i'::character(1))::text) THEN 'IMMUTABLE'::text
            WHEN ((p.provolatile)::text = ('s'::character(1))::text) THEN 'STABLE'::text
            WHEN ((p.provolatile)::text = ('v'::character(1))::text) THEN 'VOLATILE'::text
            ELSE NULL::text
        END AS function_type,
    pg_get_functiondef(p.oid) AS function_definition,
    (rtn.nspname)::text AS return_type_schema,
    (rt.typname)::text AS return_type_name,
    (rt.typtype)::text AS return_type_type,
    p.proretset AS returns_set,
    ( SELECT COALESCE(json_agg(json_build_object('schema', q.schema, 'name', q.name, 'type', q.type)), '[]'::json) AS "coalesce"
           FROM ( SELECT pt.typname AS name,
                    pns.nspname AS schema,
                    pt.typtype AS type,
                    pat.ordinality
                   FROM ((unnest(COALESCE(p.proallargtypes, (p.proargtypes)::oid[])) WITH ORDINALITY pat(oid, ordinality)
                     LEFT JOIN pg_type pt ON ((pt.oid = pat.oid)))
                     LEFT JOIN pg_namespace pns ON ((pt.typnamespace = pns.oid)))
                  ORDER BY pat.ordinality) q) AS input_arg_types,
    to_json(COALESCE(p.proargnames, ARRAY[]::text[])) AS input_arg_names,
    p.pronargdefaults AS default_args,
    (p.oid)::integer AS function_oid
   FROM ((((pg_proc p
     JOIN pg_namespace pn ON ((pn.oid = p.pronamespace)))
     JOIN pg_type rt ON ((rt.oid = p.prorettype)))
     JOIN pg_namespace rtn ON ((rtn.oid = rt.typnamespace)))
     LEFT JOIN pg_description pd ON ((p.oid = pd.objoid)))
  WHERE (((pn.nspname)::text !~~ 'pg_%'::text) AND ((pn.nspname)::text <> ALL (ARRAY['information_schema'::text, 'hdb_catalog'::text, 'hdb_views'::text])) AND (NOT (EXISTS ( SELECT 1
           FROM pg_aggregate
          WHERE ((pg_aggregate.aggfnoid)::oid = p.oid)))));


ALTER TABLE hdb_catalog.hdb_function_agg OWNER TO postgres;

--
-- Name: hdb_function_info_agg; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_function_info_agg AS
 SELECT hdb_function_agg.function_name,
    hdb_function_agg.function_schema,
    row_to_json(( SELECT e.*::record AS e
           FROM ( SELECT hdb_function_agg.description,
                    hdb_function_agg.has_variadic,
                    hdb_function_agg.function_type,
                    hdb_function_agg.return_type_schema,
                    hdb_function_agg.return_type_name,
                    hdb_function_agg.return_type_type,
                    hdb_function_agg.returns_set,
                    hdb_function_agg.input_arg_types,
                    hdb_function_agg.input_arg_names,
                    hdb_function_agg.default_args,
                    (EXISTS ( SELECT 1
                           FROM information_schema.tables
                          WHERE (((tables.table_schema)::name = hdb_function_agg.return_type_schema) AND ((tables.table_name)::name = hdb_function_agg.return_type_name)))) AS returns_table) e)) AS function_info
   FROM hdb_catalog.hdb_function_agg;


ALTER TABLE hdb_catalog.hdb_function_info_agg OWNER TO postgres;

--
-- Name: hdb_permission; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_permission (
    table_schema name NOT NULL,
    table_name name NOT NULL,
    role_name text NOT NULL,
    perm_type text NOT NULL,
    perm_def jsonb NOT NULL,
    comment text,
    is_system_defined boolean DEFAULT false,
    CONSTRAINT hdb_permission_perm_type_check CHECK ((perm_type = ANY (ARRAY['insert'::text, 'select'::text, 'update'::text, 'delete'::text])))
);


ALTER TABLE hdb_catalog.hdb_permission OWNER TO postgres;

--
-- Name: hdb_permission_agg; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_permission_agg AS
 SELECT hdb_permission.table_schema,
    hdb_permission.table_name,
    hdb_permission.role_name,
    json_object_agg(hdb_permission.perm_type, hdb_permission.perm_def) AS permissions
   FROM hdb_catalog.hdb_permission
  GROUP BY hdb_permission.table_schema, hdb_permission.table_name, hdb_permission.role_name;


ALTER TABLE hdb_catalog.hdb_permission_agg OWNER TO postgres;

--
-- Name: hdb_primary_key; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_primary_key AS
 SELECT tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    json_agg(constraint_column_usage.column_name) AS columns
   FROM (information_schema.table_constraints tc
     JOIN ( SELECT x.tblschema AS table_schema,
            x.tblname AS table_name,
            x.colname AS column_name,
            x.cstrname AS constraint_name
           FROM ( SELECT DISTINCT nr.nspname,
                    r.relname,
                    a.attname,
                    c.conname
                   FROM pg_namespace nr,
                    pg_class r,
                    pg_attribute a,
                    pg_depend d,
                    pg_namespace nc,
                    pg_constraint c
                  WHERE ((nr.oid = r.relnamespace) AND (r.oid = a.attrelid) AND (d.refclassid = ('pg_class'::regclass)::oid) AND (d.refobjid = r.oid) AND (d.refobjsubid = a.attnum) AND (d.classid = ('pg_constraint'::regclass)::oid) AND (d.objid = c.oid) AND (c.connamespace = nc.oid) AND (c.contype = 'c'::"char") AND (r.relkind = ANY (ARRAY['r'::"char", 'p'::"char"])) AND (NOT a.attisdropped))
                UNION ALL
                 SELECT nr.nspname,
                    r.relname,
                    a.attname,
                    c.conname
                   FROM pg_namespace nr,
                    pg_class r,
                    pg_attribute a,
                    pg_namespace nc,
                    pg_constraint c
                  WHERE ((nr.oid = r.relnamespace) AND (r.oid = a.attrelid) AND (nc.oid = c.connamespace) AND (r.oid =
                        CASE c.contype
                            WHEN 'f'::"char" THEN c.confrelid
                            ELSE c.conrelid
                        END) AND (a.attnum = ANY (
                        CASE c.contype
                            WHEN 'f'::"char" THEN c.confkey
                            ELSE c.conkey
                        END)) AND (NOT a.attisdropped) AND (c.contype = ANY (ARRAY['p'::"char", 'u'::"char", 'f'::"char"])) AND (r.relkind = ANY (ARRAY['r'::"char", 'p'::"char"])))) x(tblschema, tblname, colname, cstrname)) constraint_column_usage ON ((((tc.constraint_name)::text = (constraint_column_usage.constraint_name)::text) AND ((tc.table_schema)::text = (constraint_column_usage.table_schema)::text) AND ((tc.table_name)::text = (constraint_column_usage.table_name)::text))))
  WHERE ((tc.constraint_type)::text = 'PRIMARY KEY'::text)
  GROUP BY tc.table_schema, tc.table_name, tc.constraint_name;


ALTER TABLE hdb_catalog.hdb_primary_key OWNER TO postgres;

--
-- Name: hdb_query_collection; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_query_collection (
    collection_name text NOT NULL,
    collection_defn jsonb NOT NULL,
    comment text,
    is_system_defined boolean DEFAULT false
);


ALTER TABLE hdb_catalog.hdb_query_collection OWNER TO postgres;

--
-- Name: hdb_relationship; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_relationship (
    table_schema name NOT NULL,
    table_name name NOT NULL,
    rel_name text NOT NULL,
    rel_type text,
    rel_def jsonb NOT NULL,
    comment text,
    is_system_defined boolean DEFAULT false,
    CONSTRAINT hdb_relationship_rel_type_check CHECK ((rel_type = ANY (ARRAY['object'::text, 'array'::text])))
);


ALTER TABLE hdb_catalog.hdb_relationship OWNER TO postgres;

--
-- Name: hdb_remote_relationship; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_remote_relationship (
    remote_relationship_name text NOT NULL,
    table_schema name NOT NULL,
    table_name name NOT NULL,
    definition jsonb NOT NULL
);


ALTER TABLE hdb_catalog.hdb_remote_relationship OWNER TO postgres;

--
-- Name: hdb_role; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_role AS
 SELECT DISTINCT q.role_name
   FROM ( SELECT hdb_permission.role_name
           FROM hdb_catalog.hdb_permission
        UNION ALL
         SELECT hdb_action_permission.role_name
           FROM hdb_catalog.hdb_action_permission) q;


ALTER TABLE hdb_catalog.hdb_role OWNER TO postgres;

--
-- Name: hdb_scheduled_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_scheduled_event_invocation_logs (
    id text DEFAULT public.gen_random_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.hdb_scheduled_event_invocation_logs OWNER TO postgres;

--
-- Name: hdb_scheduled_events; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_scheduled_events (
    id text DEFAULT public.gen_random_uuid() NOT NULL,
    webhook_conf json NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    retry_conf json,
    payload json,
    header_conf json,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    comment text,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


ALTER TABLE hdb_catalog.hdb_scheduled_events OWNER TO postgres;

--
-- Name: hdb_schema_update_event; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_schema_update_event (
    instance_id uuid NOT NULL,
    occurred_at timestamp with time zone DEFAULT now() NOT NULL,
    invalidations json NOT NULL
);


ALTER TABLE hdb_catalog.hdb_schema_update_event OWNER TO postgres;

--
-- Name: hdb_table; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_table (
    table_schema name NOT NULL,
    table_name name NOT NULL,
    configuration jsonb,
    is_system_defined boolean DEFAULT false,
    is_enum boolean DEFAULT false NOT NULL
);


ALTER TABLE hdb_catalog.hdb_table OWNER TO postgres;

--
-- Name: hdb_table_info_agg; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_table_info_agg AS
 SELECT schema.nspname AS table_schema,
    "table".relname AS table_name,
    jsonb_build_object('oid', ("table".oid)::integer, 'columns', COALESCE(columns.info, '[]'::jsonb), 'primary_key', primary_key.info, 'unique_constraints', COALESCE(unique_constraints.info, '[]'::jsonb), 'foreign_keys', COALESCE(foreign_key_constraints.info, '[]'::jsonb), 'view_info',
        CASE "table".relkind
            WHEN 'v'::"char" THEN jsonb_build_object('is_updatable', ((pg_relation_is_updatable(("table".oid)::regclass, true) & 4) = 4), 'is_insertable', ((pg_relation_is_updatable(("table".oid)::regclass, true) & 8) = 8), 'is_deletable', ((pg_relation_is_updatable(("table".oid)::regclass, true) & 16) = 16))
            ELSE NULL::jsonb
        END, 'description', description.description) AS info
   FROM ((((((pg_class "table"
     JOIN pg_namespace schema ON ((schema.oid = "table".relnamespace)))
     LEFT JOIN pg_description description ON (((description.classoid = ('pg_class'::regclass)::oid) AND (description.objoid = "table".oid) AND (description.objsubid = 0))))
     LEFT JOIN LATERAL ( SELECT jsonb_agg(jsonb_build_object('name', "column".attname, 'position', "column".attnum, 'type', COALESCE(base_type.typname, type.typname), 'is_nullable', (NOT "column".attnotnull), 'description', col_description("table".oid, ("column".attnum)::integer))) AS info
           FROM ((pg_attribute "column"
             LEFT JOIN pg_type type ON ((type.oid = "column".atttypid)))
             LEFT JOIN pg_type base_type ON (((type.typtype = 'd'::"char") AND (base_type.oid = type.typbasetype))))
          WHERE (("column".attrelid = "table".oid) AND ("column".attnum > 0) AND (NOT "column".attisdropped))) columns ON (true))
     LEFT JOIN LATERAL ( SELECT jsonb_build_object('constraint', jsonb_build_object('name', class.relname, 'oid', (class.oid)::integer), 'columns', COALESCE(columns_1.info, '[]'::jsonb)) AS info
           FROM ((pg_index index
             JOIN pg_class class ON ((class.oid = index.indexrelid)))
             LEFT JOIN LATERAL ( SELECT jsonb_agg("column".attname) AS info
                   FROM pg_attribute "column"
                  WHERE (("column".attrelid = "table".oid) AND ("column".attnum = ANY ((index.indkey)::smallint[])))) columns_1 ON (true))
          WHERE ((index.indrelid = "table".oid) AND index.indisprimary)) primary_key ON (true))
     LEFT JOIN LATERAL ( SELECT jsonb_agg(jsonb_build_object('name', class.relname, 'oid', (class.oid)::integer)) AS info
           FROM (pg_index index
             JOIN pg_class class ON ((class.oid = index.indexrelid)))
          WHERE ((index.indrelid = "table".oid) AND index.indisunique AND (NOT index.indisprimary))) unique_constraints ON (true))
     LEFT JOIN LATERAL ( SELECT jsonb_agg(jsonb_build_object('constraint', jsonb_build_object('name', foreign_key.constraint_name, 'oid', foreign_key.constraint_oid), 'columns', foreign_key.columns, 'foreign_table', jsonb_build_object('schema', foreign_key.ref_table_table_schema, 'name', foreign_key.ref_table), 'foreign_columns', foreign_key.ref_columns)) AS info
           FROM hdb_catalog.hdb_foreign_key_constraint foreign_key
          WHERE ((foreign_key.table_schema = schema.nspname) AND (foreign_key.table_name = "table".relname))) foreign_key_constraints ON (true))
  WHERE ("table".relkind = ANY (ARRAY['r'::"char", 't'::"char", 'v'::"char", 'm'::"char", 'f'::"char", 'p'::"char"]));


ALTER TABLE hdb_catalog.hdb_table_info_agg OWNER TO postgres;

--
-- Name: hdb_unique_constraint; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_unique_constraint AS
 SELECT tc.table_name,
    tc.constraint_schema AS table_schema,
    tc.constraint_name,
    json_agg(kcu.column_name) AS columns
   FROM (information_schema.table_constraints tc
     JOIN information_schema.key_column_usage kcu USING (constraint_schema, constraint_name))
  WHERE ((tc.constraint_type)::text = 'UNIQUE'::text)
  GROUP BY tc.table_name, tc.constraint_schema, tc.constraint_name;


ALTER TABLE hdb_catalog.hdb_unique_constraint OWNER TO postgres;

--
-- Name: hdb_version; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_version (
    hasura_uuid uuid DEFAULT public.gen_random_uuid() NOT NULL,
    version text NOT NULL,
    upgraded_on timestamp with time zone NOT NULL,
    cli_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    console_state jsonb DEFAULT '{}'::jsonb NOT NULL
);


ALTER TABLE hdb_catalog.hdb_version OWNER TO postgres;

--
-- Name: migration_settings; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.migration_settings (
    setting text NOT NULL,
    value text NOT NULL
);


ALTER TABLE hdb_catalog.migration_settings OWNER TO postgres;

--
-- Name: remote_schemas; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.remote_schemas (
    id bigint NOT NULL,
    name text,
    definition json,
    comment text
);


ALTER TABLE hdb_catalog.remote_schemas OWNER TO postgres;

--
-- Name: remote_schemas_id_seq; Type: SEQUENCE; Schema: hdb_catalog; Owner: postgres
--

CREATE SEQUENCE hdb_catalog.remote_schemas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE hdb_catalog.remote_schemas_id_seq OWNER TO postgres;

--
-- Name: remote_schemas_id_seq; Type: SEQUENCE OWNED BY; Schema: hdb_catalog; Owner: postgres
--

ALTER SEQUENCE hdb_catalog.remote_schemas_id_seq OWNED BY hdb_catalog.remote_schemas.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.schema_migrations (
    version bigint NOT NULL,
    dirty boolean NOT NULL
);


ALTER TABLE hdb_catalog.schema_migrations OWNER TO postgres;

--
-- Name: app_configuration id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.app_configuration ALTER COLUMN id SET DEFAULT nextval('contactcenter.app_configuration_id_seq'::regclass);


--
-- Name: call_conversion_settings id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.call_conversion_settings ALTER COLUMN id SET DEFAULT nextval('contactcenter.call_conversion_settings_id_seq'::regclass);


--
-- Name: call_instructions id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.call_instructions ALTER COLUMN id SET DEFAULT nextval('contactcenter.call_instructions_id_seq'::regclass);


--
-- Name: call_routes id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.call_routes ALTER COLUMN id SET DEFAULT nextval('contactcenter.call_routes_id_seq'::regclass);


--
-- Name: campaign_affiliates id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.campaign_affiliates ALTER COLUMN id SET DEFAULT nextval('contactcenter.campaign_affiliates_id_seq'::regclass);


--
-- Name: campaign_call_routes id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.campaign_call_routes ALTER COLUMN id SET DEFAULT nextval('contactcenter.campaign_call_routes_id_seq'::regclass);


--
-- Name: campaigns id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.campaigns ALTER COLUMN id SET DEFAULT nextval('contactcenter.campaigns_id_seq'::regclass);


--
-- Name: criterias id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.criterias ALTER COLUMN id SET DEFAULT nextval('contactcenter.criterias_id_seq'::regclass);


--
-- Name: dial_settings id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.dial_settings ALTER COLUMN id SET DEFAULT nextval('contactcenter.dial_settings_id_seq'::regclass);


--
-- Name: duplicate_call_settings id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.duplicate_call_settings ALTER COLUMN id SET DEFAULT nextval('contactcenter.duplicate_call_settings_id_seq'::regclass);


--
-- Name: duplicate_settings id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.duplicate_settings ALTER COLUMN id SET DEFAULT nextval('contactcenter.duplicate_settings_id_seq'::regclass);


--
-- Name: integration_conversion_sets id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.integration_conversion_sets ALTER COLUMN id SET DEFAULT nextval('contactcenter.integration_conversion_sets_id_seq'::regclass);


--
-- Name: integration_settings id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.integration_settings ALTER COLUMN id SET DEFAULT nextval('contactcenter.integration_settings_id_seq'::regclass);


--
-- Name: integrations id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.integrations ALTER COLUMN id SET DEFAULT nextval('contactcenter.integrations_id_seq'::regclass);


--
-- Name: knex_migrations id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.knex_migrations ALTER COLUMN id SET DEFAULT nextval('contactcenter.knex_migrations_id_seq'::regclass);


--
-- Name: knex_migrations_lock index; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.knex_migrations_lock ALTER COLUMN index SET DEFAULT nextval('contactcenter.knex_migrations_lock_index_seq'::regclass);


--
-- Name: mark_as_duplicate_settings id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.mark_as_duplicate_settings ALTER COLUMN id SET DEFAULT nextval('contactcenter.mark_as_duplicate_settings_id_seq'::regclass);


--
-- Name: missed_calls id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.missed_calls ALTER COLUMN id SET DEFAULT nextval('contactcenter.missed_calls_id_seq'::regclass);


--
-- Name: number_assignment_settings id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.number_assignment_settings ALTER COLUMN id SET DEFAULT nextval('contactcenter.number_assignment_settings_id_seq'::regclass);


--
-- Name: number_tags id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.number_tags ALTER COLUMN id SET DEFAULT nextval('contactcenter.number_tags_id_seq'::regclass);


--
-- Name: numbers id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.numbers ALTER COLUMN id SET DEFAULT nextval('contactcenter.numbers_id_seq'::regclass);


--
-- Name: office_breaks id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.office_breaks ALTER COLUMN id SET DEFAULT nextval('contactcenter.office_breaks_id_seq'::regclass);


--
-- Name: open_settings id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.open_settings ALTER COLUMN id SET DEFAULT nextval('contactcenter.open_settings_id_seq'::regclass);


--
-- Name: operation_times id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.operation_times ALTER COLUMN id SET DEFAULT nextval('contactcenter.operation_times_id_seq'::regclass);


--
-- Name: record_call_settings id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.record_call_settings ALTER COLUMN id SET DEFAULT nextval('contactcenter.record_call_settings_id_seq'::regclass);


--
-- Name: routing_priorities id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.routing_priorities ALTER COLUMN id SET DEFAULT nextval('contactcenter.routing_priorities_id_seq'::regclass);


--
-- Name: schedules_and_capacities id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.schedules_and_capacities ALTER COLUMN id SET DEFAULT nextval('contactcenter.schedules_and_capacities_id_seq'::regclass);


--
-- Name: sip_numbers id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.sip_numbers ALTER COLUMN id SET DEFAULT nextval('contactcenter.sip_numbers_id_seq'::regclass);


--
-- Name: spam_detection_settings id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.spam_detection_settings ALTER COLUMN id SET DEFAULT nextval('contactcenter.spam_detection_settings_id_seq'::regclass);


--
-- Name: tag_routing_tables id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.tag_routing_tables ALTER COLUMN id SET DEFAULT nextval('contactcenter.tag_routing_tables_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.tags ALTER COLUMN id SET DEFAULT nextval('contactcenter.tags_id_seq'::regclass);


--
-- Name: target_criterias id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.target_criterias ALTER COLUMN id SET DEFAULT nextval('contactcenter.target_criterias_id_seq'::regclass);


--
-- Name: targets id; Type: DEFAULT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.targets ALTER COLUMN id SET DEFAULT nextval('contactcenter.targets_id_seq'::regclass);


--
-- Name: remote_schemas id; Type: DEFAULT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.remote_schemas ALTER COLUMN id SET DEFAULT nextval('hdb_catalog.remote_schemas_id_seq'::regclass);


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.accounts (id, email, name, enabled, created_at, updated_at) FROM stdin;
e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	admin@medigaplife.com	MedigapLife	t	2020-08-26 19:28:43.315359+00	2020-08-26 19:28:43.315359+00
\.


--
-- Data for Name: affiliates; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.affiliates (id, "subId", "createNumbers", "accessToRecordings", "userIds", "isSelf", "blockCallsIfCapped", name, "accountId", enabled, created_at, updated_at) FROM stdin;
1c417ae0-ae30-40cd-8f51-e83201abca87		f	f	\N	f	f	CoverageOne  Insurance	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.323591+00	2020-08-26 19:28:43.323591+00
99126f5e-e30a-4d41-8a9e-9871aef4bd89	TVHOUS12	t	f	\N	f	f	TV-Houston-Story	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.323591+00	2020-08-26 19:28:43.323591+00
fed5e1b6-9a0c-4cba-badf-a85935cdacf6	TVPHXS12	t	f	\N	f	f	TV-Phoenix-SAT	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.323591+00	2020-08-26 19:28:43.323591+00
14d344b9-93de-43e1-8264-94742e379f88	\N	f	f	{8eb937ce-d9de-4911-813b-46af4a5fe4f2}	t	f	You	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.323591+00	2020-08-26 19:28:43.323591+00
5a4b7fce-4b46-421d-b97c-55aed10a07f5	GCBS1101	t	f	\N	f	f	GEO	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.323591+00	2020-08-26 19:28:43.323591+00
f0d59025-6f95-467d-b6d6-23fd03ff9d74	A151101	f	f	\N	f	f	Direct Health	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.323591+00	2020-08-26 19:28:43.323591+00
e58ebe07-139a-473f-8777-0c751ea9a3ef	RO1101	t	f	\N	f	f	ROBERT	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.323591+00	2020-08-26 19:28:43.323591+00
af1351fd-8374-4384-afe5-574677577973	DRIPSIN	f	f	\N	f	f	DRIPS Inbound	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.323591+00	2020-08-26 19:28:43.323591+00
33618f0d-2b24-4b02-9f83-1ca9e545f1c2	F11-1	f	f	\N	f	f	FILIPINOS	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.323591+00	2020-08-26 19:28:43.323591+00
8359b084-aa49-4b84-b257-2d5e86fcae59		t	t	\N	f	f	TF-800-PUBLISHER	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.323591+00	2020-08-26 19:28:43.323591+00
57624334-8d6c-4609-813a-65acef33dcc6	MAAI1101	t	f	\N	f	f	MedAdvAI	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.323591+00	2020-08-26 19:28:43.323591+00
a01bc382-0505-4312-b481-374be22346b8	Indiana 04/2020	t	f	\N	f	f	Medigap Mailers	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.323591+00	2020-08-26 19:28:43.323591+00
0cf5c6ef-4a62-4c99-8e20-77145e65e50c	TVPHXC11	t	f	\N	f	f	TV-Phoenix-Cable	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.323591+00	2020-08-26 19:28:43.323591+00
\.


--
-- Data for Name: app_configuration; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.app_configuration (id, name, data, created_at, updated_at) FROM stdin;
2	queues	[{"id": "chat", "expression": "channel == \\"chat\\"", "friendlyName": "Chat Queue", "taskQueueSid": "WQce55e26c7ef17b8e6b279f6a76c0605c", "filterFriendlyName": "Chat", "targetWorkerExpression": ""}, {"id": "phone", "expression": "channel == \\"phone\\"", "friendlyName": "Phone Queue", "taskQueueSid": "WQf41143719da2c50d59a5ec3e305ff7c0", "filterFriendlyName": "Phone", "targetWorkerExpression": "task.team == worker.team OR task.transferToWorkerSid = worker.sid"}, {"id": "video", "expression": "channel == \\"video\\"", "friendlyName": "Video Queue", "taskQueueSid": "WQ8526281ebb04398d148557e52a1b7f3d", "filterFriendlyName": "Video", "targetWorkerExpression": ""}, {"id": "callback", "expression": "channel == \\"callback\\"", "friendlyName": "Callback Queue", "taskQueueSid": "WQf95d4593f1da2d0d8de70dc0c5faac9b", "filterFriendlyName": "Callback", "targetWorkerExpression": ""}]	2020-08-26 19:28:43.337111+00	2020-08-26 19:28:43.337111+00
3	ivr	{"text": "Thanks for calling. You can press a key or say the department name. Press 1 for Sales, press 2 for Support", "options": [{"id": "sales", "digit": 1, "friendlyName": "Sales"}, {"id": "support", "digit": 2, "friendlyName": "Support"}]}	2020-08-26 19:28:43.337111+00	2020-08-26 19:28:43.337111+00
1	twilio	{"voice": {"recording": true}, "callerId": "+17863042400", "workflowSid": "WW4b6dde9227a729c4f7302e2461241f66", "workspaceSid": "WS07ea8b462585dc0939a668aeae907b96", "applicationSid": "AP480fdfcc997b9b4f5147666c0bab9534", "facebookPageId": null, "workerBusyActivitySid": "WA656c67789c7dcde4db2c01fc8fcfe428", "workerIdleActivitySid": "WA7ce89b247f873b5c5ce7cb659d15cd1b", "workerOfflineActivitySid": "WA667f917f1f6c000b9e94ddc408aa07e8", "workerReservedActivitySid": "WA35aeb3c9899f289fd314d08f041e66e2", "workerAvailableActivitySid": "WAb2dddf784ffc6319b6c4b59e804ad4dd", "workerUnavailableActivitySid": "WA9074306527a1b7927db6cc6d40b1c82e"}	2020-08-26 19:28:43.337111+00	2020-08-26 19:28:43.337111+00
\.


--
-- Data for Name: buyers; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.buyers (id, email, "canPauseTargets", "canSetConcurrencyCaps", "canDisputeConversions", "subId", name, "accountId", enabled, created_at, updated_at) FROM stdin;
bf2f99b5-994c-4c33-9f41-f5a66bde7176		f	t	f	B1101	NXT	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.342208+00	2020-08-26 19:28:43.342208+00
a6787b9e-d82c-4e6c-8b6c-e8fe07f0cae0		f	f	f	\N	Synergy	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.342208+00	2020-08-26 19:28:43.342208+00
a843d0f5-0708-4d2e-8b83-739376b4ca6f		f	f	t	A121101	Insurd.net	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.342208+00	2020-08-26 19:28:43.342208+00
a38f0f4d-cd7e-4426-8207-50aeb57a0f8e		f	f	t	\N	MedigapLifeDR	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.342208+00	2020-08-26 19:28:43.342208+00
521002f2-c96a-41f1-9c00-576977ce9ec7		f	f	t	A110121	Medigap	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.342208+00	2020-08-26 19:28:43.342208+00
8fb5e3f1-675b-4c7d-abcf-d264e8f68d7f		f	f	t	A181101	GO Health U65	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.342208+00	2020-08-26 19:28:43.342208+00
e5f59ed1-e704-471d-8890-1d659d4b7c95		f	f	f	AP1101	AppleInsurance	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.342208+00	2020-08-26 19:28:43.342208+00
b7d86c87-6c9b-4f65-8a70-76ecb5c3f83c		t	f	f	U65PLAT12	PlatinumHealth	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.342208+00	2020-08-26 19:28:43.342208+00
dd834fd4-9af1-444d-8388-97e29c434164		f	f	f	\N	MGL Mailer	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.342208+00	2020-08-26 19:28:43.342208+00
28b07b98-baa8-4af6-919a-3cabb6c1412a		f	f	f	A1101	PolicyBind	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.342208+00	2020-08-26 19:28:43.342208+00
01a92a9f-8e24-4d9d-8b24-b15b16faedc2		f	f	t	A171101	GO Health	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.342208+00	2020-08-26 19:28:43.342208+00
11e773a5-9a22-48ac-8d45-ac4131983baf		t	f	f	AP1102	CoverageOne-MAPD	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.342208+00	2020-08-26 19:28:43.342208+00
a4a6fad4-7c41-4932-9261-b8e6acfdb71c		t	f	f	A131101	Healthworks	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.342208+00	2020-08-26 19:28:43.342208+00
8cebe0e8-054f-447b-a999-857e679bf674		t	f	f	\N	NHP	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.342208+00	2020-08-26 19:28:43.342208+00
e8fe77e0-5042-43bf-a8b5-e51541f46203		f	f	f	Spring	Spring	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:28:43.342208+00	2020-08-26 19:28:43.342208+00
\.


--
-- Data for Name: call_conversion_settings; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.call_conversion_settings (id, "conversionValue", "payoutValue", "conversionType", "conversionArgs", "deDupeSettingId", "callRouteId", created_at, updated_at) FROM stdin;
1	0.00	0.00	callLength	{"callLengthInSeconds": 90}	1	1	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
2	0.00	0.00	callLength	{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 90}	2	2	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
3	40.00	0.00	callLength	{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 120}	3	3	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
4	40.00	0.00	callLength	{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 90}	4	4	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
5	42.00	0.00	callLength	{"callLengthInSeconds": 120}	5	5	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
6	0.00	0.00	callLength	{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 90}	6	6	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
7	0.00	0.00	connectedCall	\N	7	7	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
8	0.00	0.00	callLength	{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 120}	8	8	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
9	42.00	0.00	callLength	{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 120}	9	9	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
10	0.00	0.00	callLength	{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 120}	10	10	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
11	40.00	0.00	callLength	{"callLengthInSeconds": 120}	11	11	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
12	40.00	0.00	callLength	{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 120}	12	12	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
13	55.00	0.00	callLength	{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 180}	13	13	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
14	50.00	0.00	callLength	{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 90}	14	14	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
15	40.00	0.00	callLength	{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 120}	15	15	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
16	42.00	0.00	callLength	{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 180}	16	16	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
17	0.00	0.00	callLength	{"callLengthInSeconds": 90}	17	17	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
18	45.00	0.00	callLength	{"callLengthInSeconds": 120}	18	18	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
19	55.00	0.00	callLength	{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 90}	19	19	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
20	40.00	0.00	callLength	{"callLengthInSeconds": 120}	20	20	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
21	0.00	0.00	callLength	{"callLengthInSeconds": 120}	21	21	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
22	40.00	0.00	callLength	{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 90}	22	22	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
23	42.00	0.00	callLength	{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 90}	23	23	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
24	0.00	0.00	callLength	{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 60}	24	24	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
25	40.00	0.00	callLength	{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 120}	25	25	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
26	0.00	0.00	callLength	{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 120}	26	26	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
27	42.00	0.00	callLength	{"callLengthInSeconds": 120}	27	27	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
28	40.00	0.00	callLength	{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 120}	28	28	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
29	45.00	0.00	callLength	{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 90}	29	29	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
30	0.00	0.00	callLength	{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 90}	30	30	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
31	0.00	0.00	callLength	{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 90}	31	31	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
32	40.00	0.00	callLength	{"callLengthInSeconds": 90}	32	32	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
33	40.00	0.00	callLength	{"callLengthInSeconds": 90}	33	33	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
34	42.00	0.00	callLength	{"callLengthInSeconds": 90}	34	34	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
35	45.00	0.00	callLength	{"callLengthInSeconds": 90}	35	35	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
36	0.00	0.00	callLength	{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 120}	36	36	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
37	50.00	0.00	callLength	{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 120}	37	37	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
38	45.00	0.00	callLength	{"callLengthInSeconds": 90}	38	38	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
39	42.00	0.00	callLength	{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 90}	39	39	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
40	55.00	0.00	callLength	{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 120}	40	40	2020-08-26 19:31:44.621581+00	2020-08-26 19:31:44.621581+00
41	0.00	0.00	connectedCall	\N	41	41	2020-10-16 06:08:53.222086+00	2020-10-16 06:08:53.222086+00
42	0.00	0.00	connectedCall	\N	42	42	2020-10-16 06:09:54.633988+00	2020-10-16 06:09:54.633988+00
43	0.00	0.00	connectedCall	\N	43	43	2020-10-16 06:53:26.493705+00	2020-10-16 06:53:26.493705+00
44	0.00	0.00	connectedCall	\N	44	44	2020-10-16 06:55:14.97667+00	2020-10-16 06:55:14.97667+00
45	0.00	0.00	connectedCall	\N	45	45	2020-10-16 15:15:44.386013+00	2020-10-16 15:15:44.386013+00
46	0.00	0.00	connectedCall	\N	46	46	2020-10-16 15:15:44.386013+00	2020-10-16 15:15:44.386013+00
47	0.00	0.00	connectedCall	\N	47	47	2020-10-16 15:27:14.20716+00	2020-10-16 15:27:14.20716+00
48	0.00	0.00	connectedCall	\N	48	48	2020-10-16 15:27:14.20716+00	2020-10-16 15:27:14.20716+00
49	0.00	0.00	connectedCall	\N	49	49	2020-10-16 15:29:09.856116+00	2020-10-16 15:29:09.856116+00
50	0.00	0.00	connectedCall	\N	50	50	2020-10-16 15:29:09.856116+00	2020-10-16 15:29:09.856116+00
51	0.00	0.00	connectedCall	\N	51	51	2020-10-16 15:52:18.907661+00	2020-10-16 15:52:18.907661+00
52	0.00	0.00	connectedCall	\N	52	52	2020-10-16 15:52:18.907661+00	2020-10-16 15:52:18.907661+00
53	0.00	0.00	connectedCall	\N	53	53	2020-10-16 15:55:45.823614+00	2020-10-16 15:55:45.823614+00
54	0.00	0.00	connectedCall	\N	54	54	2020-10-16 15:55:45.823614+00	2020-10-16 15:55:45.823614+00
55	0.00	0.00	connectedCall	\N	55	55	2020-10-16 15:57:59.61358+00	2020-10-16 15:57:59.61358+00
56	0.00	0.00	connectedCall	\N	56	56	2020-10-16 15:57:59.61358+00	2020-10-16 15:57:59.61358+00
57	0.00	0.00	connectedCall	\N	57	57	2020-10-16 16:18:50.5868+00	2020-10-16 16:18:50.5868+00
61	0.00	0.00	connectedCall	\N	61	61	2020-10-19 15:52:38.030248+00	2020-10-19 15:52:38.030248+00
62	0.00	0.00	connectedCall	\N	62	62	2020-10-19 15:54:10.089169+00	2020-10-19 15:54:10.089169+00
63	0.00	0.00	connectedCall	\N	63	63	2020-10-19 17:03:16.192635+00	2020-10-19 17:03:16.192635+00
65	0.00	0.00	connectedCall	\N	65	65	2020-10-19 19:12:00.379055+00	2020-10-19 19:12:00.379055+00
67	0.00	0.00	connectedCall	\N	67	67	2020-10-19 19:16:33.366464+00	2020-10-19 19:16:33.366464+00
\.


--
-- Data for Name: call_instructions; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.call_instructions (id, "connectionTimeOut", "callType", number, "sendDigits", created_at, updated_at) FROM stdin;
1	15	number	+12013593476	\N	2020-08-26 19:30:31.545895+00	2020-08-26 19:30:31.545895+00
2	10	number	+18553707864	\N	2020-08-26 19:30:31.545895+00	2020-08-26 19:30:31.545895+00
3	20	number	+18779144145	\N	2020-08-26 19:30:31.545895+00	2020-08-26 19:30:31.545895+00
4	10	number	+12013593479	\N	2020-08-26 19:30:31.545895+00	2020-08-26 19:30:31.545895+00
5	15	number	+17542032862	\N	2020-08-26 19:30:31.545895+00	2020-08-26 19:30:31.545895+00
6	30	number	+12012540135	\N	2020-08-26 19:30:31.545895+00	2020-08-26 19:30:31.545895+00
7	15	number	+18888950228	\N	2020-08-26 19:30:31.545895+00	2020-08-26 19:30:31.545895+00
8	16	number	+17542532187	\N	2020-08-26 19:30:31.545895+00	2020-08-26 19:30:31.545895+00
9	3	number	+18669811443	\N	2020-08-26 19:30:31.545895+00	2020-08-26 19:30:31.545895+00
10	10	number	+18555491430	\N	2020-08-26 19:30:31.545895+00	2020-08-26 19:30:31.545895+00
11	0	number	+18559266324	\N	2020-08-26 19:30:31.545895+00	2020-08-26 19:30:31.545895+00
12	10	number	+12392999197	\N	2020-08-26 19:30:31.545895+00	2020-08-26 19:30:31.545895+00
13	30	number	+19546031097	\N	2020-08-26 19:30:31.545895+00	2020-08-26 19:30:31.545895+00
14	15	number	+18625761202	\N	2020-08-26 19:32:42.717153+00	2020-08-26 19:32:42.717153+00
15	15	number	+18625761202	\N	2020-10-16 04:25:54.060074+00	2020-10-16 04:25:54.060074+00
\.


--
-- Data for Name: call_logs; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.call_logs (id, "dtStamp", "accountId", "campaignId", "campaignName", "affiliateId", "affiliateName", number, "numberPoolId", "numberPoolName", "inboundCallId", "inboundPhoneNumber", caller, "callSid", "callerName", "callerCity", "callerState", "callerZip", "callerCountry", "callStatus", "taskSid", "taskQueueSid", "taskPriority", "workerSid", "workflowSid", "queueSid", "dialCallDuration", "dialCallSid", "dialCallStatus", "recordingDuration", "recordingSid", "previouseCallTargetName", "previouseCallCallId", "previouseCallDateTime", "totalAmount", "targetName", "targetId", "targetBuyerId", "targetBuyer", "timeToConnect", "callConnectionDt", "targetNumber", "callLengthInSeconds", "callCompletedDt", "payoutAmount", source, "recordingUrl", "callConnectionLength", profit, created_at, updated_at) FROM stdin;
20	2020-10-16 17:26:20.991+00	ACa5d13ced0c9bdf7563e7b6849cdbfe9e	WW10bca7f148205f4b1345ab5ddc04e870	Campaign updated test	\N	\N	+18553398928	\N	\N	\N	\N	+15632777575	CA847c67f45320b2e67f2d92fe97621099		CEDAR RAPIDS	IA	52401	US	ringing	\N	\N	\N	\N	WW10bca7f148205f4b1345ab5ddc04e870	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	/api/ivr/welcome	\N	\N	2020-10-16 17:26:20.995377+00	2020-10-16 17:26:20.995377+00
21	2020-10-21 14:20:51.827+00	ACa5d13ced0c9bdf7563e7b6849cdbfe9e	WWa9974d27493872a2e82083958d6d7153	plakos-campaign-test121	\N	\N	+18553398928	\N	\N	\N	\N	+15632777575	CAb2425fb78eb31678abfec433103c4849		CEDAR RAPIDS	IA	52401	US	ringing	\N	\N	\N	\N	WWa9974d27493872a2e82083958d6d7153	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	/api/ivr/welcome	\N	\N	2020-10-21 14:20:51.830608+00	2020-10-21 14:20:51.830608+00
22	2020-10-21 14:21:00.434+00	ACa5d13ced0c9bdf7563e7b6849cdbfe9e	WWa9974d27493872a2e82083958d6d7153	plakos-campaign-test121	\N	\N	+18553398928	\N	\N	\N	\N	+15632777575	CAb2425fb78eb31678abfec433103c4849		CEDAR RAPIDS	IA	52401	US	completed	\N	\N	\N	\N	WWa9974d27493872a2e82083958d6d7153	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	/api/twimlapp_status_callback	\N	\N	2020-10-21 14:21:00.43872+00	2020-10-21 14:21:00.43872+00
23	2020-10-21 14:21:33.955+00	ACa5d13ced0c9bdf7563e7b6849cdbfe9e	WWa9974d27493872a2e82083958d6d7153	plakos-campaign-test121	\N	\N	+18553398928	\N	\N	\N	\N	+15632777575	CAefbbaa3718b7bf50c26da06c2d568b13		CEDAR RAPIDS	IA	52401	US	ringing	\N	\N	\N	\N	WWa9974d27493872a2e82083958d6d7153	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	/api/ivr/welcome	\N	\N	2020-10-21 14:21:33.959338+00	2020-10-21 14:21:33.959338+00
24	2020-10-21 14:21:43.005+00	ACa5d13ced0c9bdf7563e7b6849cdbfe9e	WWa9974d27493872a2e82083958d6d7153	plakos-campaign-test121	\N	\N	+18553398928	\N	\N	\N	\N	+15632777575	CAefbbaa3718b7bf50c26da06c2d568b13		CEDAR RAPIDS	IA	52401	US	completed	\N	\N	\N	\N	WWa9974d27493872a2e82083958d6d7153	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	/api/twimlapp_status_callback	\N	\N	2020-10-21 14:21:43.008562+00	2020-10-21 14:21:43.008562+00
25	2020-10-16 17:26:20.991+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2020-10-21 18:27:13.759532+00	2020-10-21 18:27:13.759532+00
\.

--
-- Data for Name: call_routes; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.call_routes (id, "priorityId", "callTargetId", "callTargetGroupId", "callPingTreeId", "campaignId", name, "accountId", enabled, created_at, updated_at, "queueSid") FROM stdin;
1	1	4	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
2	2	9	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
3	3	5	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
4	4	7	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
5	5	3	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
6	6	12	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
7	7	12	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
8	8	13	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
9	9	3	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
10	10	12	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
11	11	5	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
12	12	7	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
13	13	2	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
14	14	\N	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
15	15	5	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
16	16	3	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
17	17	1	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
18	18	10	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
19	19	2	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
20	20	7	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
21	21	9	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
22	22	8	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
23	23	11	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
24	24	9	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
25	25	5	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
26	26	1	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
27	27	3	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
28	28	7	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
29	29	10	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
30	30	9	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
31	31	6	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
32	32	5	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
33	33	7	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
34	34	3	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
35	35	10	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
36	36	12	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
37	37	8	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
38	38	10	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
39	39	3	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
40	40	2	\N	\N	\N	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.583877+00	2020-08-26 19:31:44.583877+00	\N
41	41	12	\N	\N	\N	plakos-campaign-test7:12	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 06:08:53.222086+00	2020-10-16 06:08:53.222086+00	\N
42	42	12	\N	\N	\N	plakos-campaign-test7:12	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 06:09:54.633988+00	2020-10-16 06:09:54.633988+00	\N
43	43	12	\N	\N	\N	plakos-campaign-test7:12	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 06:53:26.493705+00	2020-10-16 06:53:26.493705+00	\N
44	44	12	\N	\N	\N	plakos-campaign-test7:12	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 06:55:14.97667+00	2020-10-16 06:55:14.97667+00	WQ7b316491d77e955cb3c7e685a32eee2f
45	45	12	\N	\N	\N	plakos-campaign-test10:12	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 15:15:44.386013+00	2020-10-16 15:15:44.386013+00	WQ5dd6ebb3cc9d0ed35dd7d1a113e92298
46	46	15	\N	\N	\N	plakos-campaign-test10:15	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 15:15:44.386013+00	2020-10-16 15:15:44.386013+00	WQ3fca84ca3e8cf8077419ac1b1fc5dfaf
47	47	12	\N	\N	\N	plakos-campaign-test10:12	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 15:27:14.20716+00	2020-10-16 15:27:14.20716+00	\N
48	48	15	\N	\N	\N	plakos-campaign-test10:15	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 15:27:14.20716+00	2020-10-16 15:27:14.20716+00	\N
49	49	12	\N	\N	\N	plakos-campaign-test11:12	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 15:29:09.856116+00	2020-10-16 15:29:09.856116+00	WQ4cfa8deb6d2a0b94afa63126de6cfb13
50	50	15	\N	\N	\N	plakos-campaign-test11:15	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 15:29:09.856116+00	2020-10-16 15:29:09.856116+00	WQ82783f75b2477c4a83281edd167e79ac
51	51	12	\N	\N	\N	plakos-campaign-test12:12	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 15:52:18.907661+00	2020-10-16 15:52:18.907661+00	WQ4022b49d152329683c1c7a79fdc96f7f
52	52	15	\N	\N	\N	plakos-campaign-test12:15	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 15:52:18.907661+00	2020-10-16 15:52:18.907661+00	WQa200d460852d28d7343073fcba112c45
53	53	12	\N	\N	\N	plakos-campaign-test15:12	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 15:55:45.823614+00	2020-10-16 15:55:45.823614+00	WQf464b85cc0b551cea90257c71f11b2e9
54	54	15	\N	\N	\N	plakos-campaign-test15:15	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 15:55:45.823614+00	2020-10-16 15:55:45.823614+00	WQebf022c043779ccde89b4c028c94416d
55	55	12	\N	\N	\N	plakos-campaign-test16:12	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 15:57:59.61358+00	2020-10-16 15:57:59.61358+00	WQ568a4162bb56a19161f182c7f8c7cad3
56	56	15	\N	\N	\N	plakos-campaign-test16:15	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 15:57:59.61358+00	2020-10-16 15:57:59.61358+00	WQd5686710c9ac63a3907d666eb0a5f90d
57	57	12	\N	\N	\N	plakos-campaign-test17:12	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 16:18:50.5868+00	2020-10-16 16:18:50.5868+00	WQ329d58dfac1d74d1c81311611eda642b
58	58	15	\N	\N	\N	plakos-campaign-test17:15	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 16:18:50.5868+00	2020-10-16 16:18:50.5868+00	WQ35f79752c376e3b6db752c1db0c498bb
60	60	15	\N	\N	\N	plakos-campaign-test18:15	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 16:21:45.9074+00	2020-10-16 16:21:45.9074+00	WQbebee2e8219ff1630c633b161bfd3bc0
61	61	1	\N	\N	\N	plakos-campaign-test7:1	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-19 15:52:38.030248+00	2020-10-19 15:52:38.030248+00	WQ76665b4309aad9d9d69d140788c3a464
62	62	2	\N	\N	\N	plakos-campaign-test7:2	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-19 15:54:10.089169+00	2020-10-19 15:54:10.089169+00	WQ6d70857bcbc8056d1cfded6b8ba1f8fc
63	63	10	\N	\N	\N	plakos-campaign-test7:10	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-19 17:03:16.192635+00	2020-10-19 17:03:16.192635+00	\N
64	64	12	\N	\N	\N	plakos-campaign-test120:12	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-19 19:12:00.379055+00	2020-10-19 19:12:00.379055+00	WQf0763c6dc98a76e3e4a7a8281fc89195
65	65	15	\N	\N	\N	plakos-campaign-test120:15	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-19 19:12:00.379055+00	2020-10-19 19:12:00.379055+00	WQ196cf8a97376f3dc3b1885e1064b210a
67	67	15	\N	\N	\N	plakos-campaign-test121:15	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-19 19:16:33.366464+00	2020-10-19 19:16:33.366464+00	WQ5cb4789b38985ea9b9a4ceafce00b016
\.


--
-- Data for Name: campaign_affiliates; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.campaign_affiliates (id, "campaignId", "affiliateId", created_at, updated_at) FROM stdin;
1	1	14d344b9-93de-43e1-8264-94742e379f88	2020-08-26 19:32:10.486168+00	2020-08-26 19:32:10.486168+00
2	3	0cf5c6ef-4a62-4c99-8e20-77145e65e50c	2020-08-26 19:32:10.486168+00	2020-08-26 19:32:10.486168+00
3	4	14d344b9-93de-43e1-8264-94742e379f88	2020-08-26 19:32:10.486168+00	2020-08-26 19:32:10.486168+00
4	5	14d344b9-93de-43e1-8264-94742e379f88	2020-08-26 19:32:10.486168+00	2020-08-26 19:32:10.486168+00
5	6	14d344b9-93de-43e1-8264-94742e379f88	2020-08-26 19:32:10.486168+00	2020-08-26 19:32:10.486168+00
6	6	8359b084-aa49-4b84-b257-2d5e86fcae59	2020-08-26 19:32:10.486168+00	2020-08-26 19:32:10.486168+00
7	7	14d344b9-93de-43e1-8264-94742e379f88	2020-08-26 19:32:10.486168+00	2020-08-26 19:32:10.486168+00
8	8	14d344b9-93de-43e1-8264-94742e379f88	2020-08-26 19:32:10.486168+00	2020-08-26 19:32:10.486168+00
9	9	14d344b9-93de-43e1-8264-94742e379f88	2020-08-26 19:32:10.486168+00	2020-08-26 19:32:10.486168+00
10	10	5a4b7fce-4b46-421d-b97c-55aed10a07f5	2020-08-26 19:32:10.486168+00	2020-08-26 19:32:10.486168+00
11	11	14d344b9-93de-43e1-8264-94742e379f88	2020-08-26 19:32:10.486168+00	2020-08-26 19:32:10.486168+00
12	12	a01bc382-0505-4312-b481-374be22346b8	2020-08-26 19:32:10.486168+00	2020-08-26 19:32:10.486168+00
16	17	14d344b9-93de-43e1-8264-94742e379f88	2020-10-16 06:55:14.97667+00	2020-10-16 06:55:14.97667+00
17	18	14d344b9-93de-43e1-8264-94742e379f88	2020-10-16 15:15:44.386013+00	2020-10-16 15:15:44.386013+00
18	19	14d344b9-93de-43e1-8264-94742e379f88	2020-10-16 15:27:14.20716+00	2020-10-16 15:27:14.20716+00
19	20	14d344b9-93de-43e1-8264-94742e379f88	2020-10-16 15:29:09.856116+00	2020-10-16 15:29:09.856116+00
20	21	14d344b9-93de-43e1-8264-94742e379f88	2020-10-16 15:52:18.907661+00	2020-10-16 15:52:18.907661+00
21	22	14d344b9-93de-43e1-8264-94742e379f88	2020-10-16 15:55:45.823614+00	2020-10-16 15:55:45.823614+00
22	23	14d344b9-93de-43e1-8264-94742e379f88	2020-10-16 15:57:59.61358+00	2020-10-16 15:57:59.61358+00
23	24	14d344b9-93de-43e1-8264-94742e379f88	2020-10-16 16:18:50.5868+00	2020-10-16 16:18:50.5868+00
24	25	14d344b9-93de-43e1-8264-94742e379f88	2020-10-16 16:21:45.9074+00	2020-10-16 16:21:45.9074+00
25	26	14d344b9-93de-43e1-8264-94742e379f88	2020-10-19 19:12:00.379055+00	2020-10-19 19:12:00.379055+00
26	27	14d344b9-93de-43e1-8264-94742e379f88	2020-10-19 19:16:33.366464+00	2020-10-19 19:16:33.366464+00
27	27	14d344b9-93de-43e1-8264-94742e379f88	2020-10-20 14:59:26.411237+00	2020-10-20 14:59:26.411237+00
\.


--
-- Data for Name: campaign_call_routes; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.campaign_call_routes (id, "campaignId", "callRouteId", created_at, updated_at) FROM stdin;
1	1	1	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
2	1	2	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
3	3	3	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
4	3	4	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
5	3	5	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
6	3	6	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
7	4	7	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
8	5	8	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
9	6	9	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
10	6	10	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
11	6	11	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
12	6	12	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
13	6	13	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
14	6	14	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
15	7	15	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
16	7	16	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
17	7	17	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
18	7	18	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
19	7	19	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
20	7	20	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
21	7	21	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
22	8	22	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
23	8	23	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
24	8	24	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
25	9	25	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
26	9	26	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
27	9	27	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
28	9	28	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
29	9	29	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
30	9	30	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
31	10	31	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
32	11	32	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
33	11	33	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
34	11	34	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
35	11	35	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
36	11	36	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
37	12	37	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
38	12	38	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
39	12	39	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
40	12	40	2020-08-26 19:31:44.640395+00	2020-08-26 19:31:44.640395+00
44	17	44	2020-10-16 06:55:14.97667+00	2020-10-16 06:55:14.97667+00
45	18	45	2020-10-16 15:15:44.386013+00	2020-10-16 15:15:44.386013+00
46	18	46	2020-10-16 15:15:44.386013+00	2020-10-16 15:15:44.386013+00
47	19	47	2020-10-16 15:27:14.20716+00	2020-10-16 15:27:14.20716+00
48	19	48	2020-10-16 15:27:14.20716+00	2020-10-16 15:27:14.20716+00
49	20	49	2020-10-16 15:29:09.856116+00	2020-10-16 15:29:09.856116+00
50	20	50	2020-10-16 15:29:09.856116+00	2020-10-16 15:29:09.856116+00
51	21	51	2020-10-16 15:52:18.907661+00	2020-10-16 15:52:18.907661+00
52	21	52	2020-10-16 15:52:18.907661+00	2020-10-16 15:52:18.907661+00
53	22	53	2020-10-16 15:55:45.823614+00	2020-10-16 15:55:45.823614+00
54	22	54	2020-10-16 15:55:45.823614+00	2020-10-16 15:55:45.823614+00
55	23	55	2020-10-16 15:57:59.61358+00	2020-10-16 15:57:59.61358+00
56	23	56	2020-10-16 15:57:59.61358+00	2020-10-16 15:57:59.61358+00
57	24	57	2020-10-16 16:18:50.5868+00	2020-10-16 16:18:50.5868+00
58	24	58	2020-10-16 16:18:50.5868+00	2020-10-16 16:18:50.5868+00
60	25	60	2020-10-16 16:21:45.9074+00	2020-10-16 16:21:45.9074+00
61	17	61	2020-10-19 15:52:38.030248+00	2020-10-19 15:52:38.030248+00
62	17	62	2020-10-19 15:54:10.089169+00	2020-10-19 15:54:10.089169+00
63	17	63	2020-10-19 17:03:16.192635+00	2020-10-19 17:03:16.192635+00
64	26	64	2020-10-19 19:12:00.379055+00	2020-10-19 19:12:00.379055+00
65	26	65	2020-10-19 19:12:00.379055+00	2020-10-19 19:12:00.379055+00
67	27	67	2020-10-19 19:16:33.366464+00	2020-10-19 19:16:33.366464+00
\.


--
-- Data for Name: campaigns; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.campaigns (id, "userCampaignId", "numberDisplayFormat", "countryCode", completed, "distributionSetting", "offerId", "offerDraftId", "evalAnonymDuplication", "payoutDupesGlobal", "spamDetectionSettingsId", "defaultNumberId", "poolId", "defaultTargetId", "filterCallsThroughTCPAShield", name, "accountId", enabled, created_at, updated_at, "deDupeSettingsId", "duplicateSettingsId", "dialSettingsId", "recordSettingId", "workflowSid", "queueSid") FROM stdin;
1	MGLMailers	\N	US	t	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	f	1	\N	\N	\N	f	Medigap Mailers - MGL	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.556969+00	2020-08-26 19:31:44.556969+00	1	1	1	1	\N	\N
2		\N	US	f	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	f	\N	\N	\N	\N	f	RaviTest	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.556969+00	2020-08-26 19:31:44.556969+00	2	2	2	2	\N	\N
3	TVPHXC11	\N	US	t	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	f	2	\N	\N	\N	f	SMS Transfers	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.556969+00	2020-08-26 19:31:44.556969+00	3	3	3	3	\N	\N
4		\N	US	t	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	f	\N	\N	\N	\N	f	RaviTest	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	f	2020-08-26 19:31:44.556969+00	2020-08-26 19:31:44.556969+00	4	4	4	4	\N	\N
5		\N	US	t	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	f	3	\N	\N	\N	f	Toll Free IVR	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.556969+00	2020-08-26 19:31:44.556969+00	5	5	5	5	\N	\N
6	MGLDR	\N	US	t	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	f	4	\N	\N	\N	f	MAPD  Dedicated	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.556969+00	2020-08-26 19:31:44.556969+00	6	6	6	6	\N	\N
7	MGL-Charlie	\N	US	t	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	f	5	\N	\N	\N	f	MGL Charlie Transfers	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.556969+00	2020-08-26 19:31:44.556969+00	7	7	7	7	\N	\N
8	MGL-Failover-Mailers	\N	US	t	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	f	6	\N	\N	\N	f	Mailers (RAW Calls Failover)	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.556969+00	2020-08-26 19:31:44.556969+00	8	8	8	8	\N	\N
9	MGLFB-Calls	\N	US	t	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	f	7	\N	\N	\N	f	MGL FB LiveCalls - Transfers	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.556969+00	2020-08-26 19:31:44.556969+00	9	9	9	9	\N	\N
10	CBSIN	\N	US	t	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	t	8	\N	\N	\N	f	CBS Inbound	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.556969+00	2020-08-26 19:31:44.556969+00	10	10	10	10	\N	\N
11	FBTRANS	\N	US	t	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	f	9	\N	\N	\N	f	MGL FB Transfer	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.556969+00	2020-08-26 19:31:44.556969+00	11	11	11	11	\N	\N
12	MGLMailers	\N	US	t	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	f	10	\N	\N	\N	f	Mailers (External Transfer)	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.556969+00	2020-08-26 19:31:44.556969+00	12	12	12	12	\N	\N
13		\N	US	f	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	f	\N	\N	\N	\N	f	RaviTest2	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:31:44.556969+00	2020-08-26 19:31:44.556969+00	13	13	13	13	\N	\N
17	\N	\N	US	f	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	f	14	\N	\N	\N	f	plakos-campaign-test7	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 06:55:14.97667+00	2020-10-16 06:55:14.97667+00	17	18	17	17	WW347d5caba625bb253228a2cfead9f491	\N
18	\N	\N	US	f	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	f	15	\N	\N	\N	f	plakos-campaign-test10	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 15:15:44.386013+00	2020-10-16 15:15:44.386013+00	18	19	18	18	\N	\N
19	\N	\N	US	f	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	f	16	\N	\N	\N	f	plakos-campaign-test10	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 15:27:14.20716+00	2020-10-16 15:27:14.20716+00	19	20	19	19	\N	\N
20	\N	\N	US	f	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	f	17	\N	\N	\N	f	plakos-campaign-test11	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 15:29:09.856116+00	2020-10-16 15:29:09.856116+00	20	21	20	20	\N	\N
21	\N	\N	US	f	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	f	18	\N	\N	\N	f	plakos-campaign-test12	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 15:52:18.907661+00	2020-10-16 15:52:18.907661+00	21	22	21	21	\N	\N
22	\N	\N	US	f	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	f	19	\N	\N	\N	f	plakos-campaign-test15	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 15:55:45.823614+00	2020-10-16 15:55:45.823614+00	22	23	22	22	\N	\N
23	\N	\N	US	f	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	f	20	\N	\N	\N	f	plakos-campaign-test16	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 15:57:59.61358+00	2020-10-16 15:57:59.61358+00	23	24	23	23	\N	\N
24	\N	\N	US	f	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	f	21	\N	\N	\N	f	plakos-campaign-test17	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 16:18:50.5868+00	2020-10-16 16:18:50.5868+00	24	25	24	24	\N	\N
25	\N	(123) 456-7890	US	f	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	t	22	\N	\N	\N	f	Campaign updated test	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 16:21:45.9074+00	2020-10-16 16:21:45.9074+00	25	26	25	25	WW10bca7f148205f4b1345ab5ddc04e870	\N
26	\N	\N	US	f	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	f	23	\N	\N	\N	f	plakos-campaign-test120	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-19 19:12:00.379055+00	2020-10-19 19:12:00.379055+00	26	28	26	26	WWe525a06073972cb6e743b17f38f682a6	\N
27	\N	\N	US	f	WEIGHT_BY_TARGETS_AVAILABLE	\N	\N	t	f	24	\N	\N	\N	f	plakos-campaign-test121	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-19 19:16:33.366464+00	2020-10-19 19:16:33.366464+00	27	29	27	27	WWa9974d27493872a2e82083958d6d7153	\N
\.


--
-- Data for Name: comparisons_type; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.comparisons_type (value) FROM stdin;
EQUALS
CONTAINS
BEGINS_WITH
GREATER_THAN
LESS_THAN
EXISTS
\.


--
-- Data for Name: criterias; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.criterias (id, "comparisonType", value, "isNegativeMatch", "isNumber", "tagRoutableRuleId", created_at, updated_at, "tagId", "tagIds") FROM stdin;
1	EQUALS	OH	f	f	2	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
2	EQUALS	VA	f	f	2	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
3	EQUALS	AR	f	f	3	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
4	EQUALS	CO	f	f	3	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
5	EQUALS	CT	f	f	3	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
6	EQUALS	FL	f	f	3	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
7	EQUALS	GA	f	f	3	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
8	EQUALS	IN	f	f	3	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
9	EQUALS	KY	f	f	3	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
10	EQUALS	ME	f	f	3	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
11	EQUALS	NV	f	f	3	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
12	EQUALS	TN	f	f	3	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
13	EQUALS	TX	f	f	3	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
14	EQUALS	MO	f	f	3	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
15	EQUALS	AL	f	f	4	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
16	EQUALS	AR	f	f	4	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
17	EQUALS	FL	f	f	4	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
18	EQUALS	GA	f	f	4	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
19	EQUALS	IN	f	f	4	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
20	EQUALS	KY	f	f	4	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
21	EQUALS	LA	f	f	4	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
22	EQUALS	MO	f	f	4	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
23	EQUALS	NJ	f	f	4	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
24	EQUALS	NC	f	f	4	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
25	EQUALS	OH	f	f	4	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
26	EQUALS	SC	f	f	4	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
27	EQUALS	TN	f	f	4	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
28	EQUALS	TX	f	f	4	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
29	EQUALS	VA	f	f	4	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
30	EQUALS	WV	f	f	4	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
31	EQUALS	WI	f	f	4	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
32	EQUALS	AL	f	f	5	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
33	EQUALS	AZ	f	f	5	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
34	EQUALS	CO	f	f	5	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
35	EQUALS	FL	f	f	5	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
36	EQUALS	GA	f	f	5	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
37	EQUALS	IL	f	f	5	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
38	EQUALS	KY	f	f	5	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
39	EQUALS	LA	f	f	5	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
40	EQUALS	MD	f	f	5	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
41	EQUALS	MI	f	f	5	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
42	EQUALS	MS	f	f	5	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
43	EQUALS	MO	f	f	5	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
44	EQUALS	NV	f	f	5	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
45	EQUALS	OH	f	f	5	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
46	EQUALS	OK	f	f	5	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
47	EQUALS	PA	f	f	5	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
48	EQUALS	SC	f	f	5	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
49	EQUALS	TN	f	f	5	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
50	EQUALS	TX	f	f	5	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
51	EQUALS	VA	f	f	5	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
52	EQUALS	WI	f	f	5	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
53	EQUALS	IN	f	f	6	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
54	EQUALS	OH	f	f	6	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
55	EQUALS	AL	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
56	EQUALS	AZ	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
57	EQUALS	AR	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
58	EQUALS	CA	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
59	EQUALS	CO	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
60	EQUALS	CT	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
61	EQUALS	DE	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
62	EQUALS	FL	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
63	EQUALS	GA	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
64	EQUALS	IA	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
65	EQUALS	KS	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
66	EQUALS	KY	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
67	EQUALS	LA	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
68	EQUALS	MD	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
69	EQUALS	MI	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
70	EQUALS	MN	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
71	EQUALS	MS	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
72	EQUALS	MO	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
73	EQUALS	MT	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
74	EQUALS	NE	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
75	EQUALS	NV	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
76	EQUALS	NH	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
77	EQUALS	NJ	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
78	EQUALS	NM	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
79	EQUALS	NC	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
80	EQUALS	ND	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
81	EQUALS	MP	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
82	EQUALS	OH	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
83	EQUALS	OK	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
84	EQUALS	OR	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
85	EQUALS	PA	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
86	EQUALS	PR	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
87	EQUALS	SC	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
88	EQUALS	SD	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
89	EQUALS	TN	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
90	EQUALS	TX	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
91	EQUALS	UT	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
92	EQUALS	VA	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
93	EQUALS	WA	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
94	EQUALS	WV	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
95	EQUALS	WY	f	f	7	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00		["InboundNumber:State"]
96	EQUALS	AZ	f	f	8	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
97	EQUALS	AR	f	f	8	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
98	EQUALS	CA	f	f	8	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
99	EQUALS	CO	f	f	8	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
100	EQUALS	CT	f	f	8	2020-08-26 19:30:31.606318+00	2020-08-26 19:30:31.606318+00	\N	["InboundNumber:State"]
101	EQUALS	FL	f	f	8	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
102	EQUALS	GA	f	f	8	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
103	EQUALS	IL	f	f	8	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
104	EQUALS	IN	f	f	8	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
105	EQUALS	KY	f	f	8	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
106	EQUALS	LA	f	f	8	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
107	EQUALS	MS	f	f	8	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
108	EQUALS	MO	f	f	8	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
109	EQUALS	NV	f	f	8	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
110	EQUALS	NJ	f	f	8	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
111	EQUALS	NY	f	f	8	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
112	EQUALS	NC	f	f	8	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
113	EQUALS	OH	f	f	8	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
114	EQUALS	PA	f	f	8	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
115	EQUALS	SC	f	f	8	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
116	EQUALS	TN	f	f	8	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
117	EQUALS	TX	f	f	8	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
118	EQUALS	VA	f	f	8	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
119	EQUALS	WI	f	f	8	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
120	EQUALS	AL	f	f	8	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
121	EQUALS	AZ	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
122	EQUALS	AR	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
123	EQUALS	CO	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
124	EQUALS	CT	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
125	EQUALS	FL	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
126	EQUALS	GA	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
127	EQUALS	IL	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
128	EQUALS	IN	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
129	EQUALS	KY	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
130	EQUALS	LA	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
131	EQUALS	MS	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
132	EQUALS	MO	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
133	EQUALS	NV	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
134	EQUALS	NJ	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
135	EQUALS	NY	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
136	EQUALS	NC	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
137	EQUALS	OH	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
138	EQUALS	PA	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
139	EQUALS	SC	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
140	EQUALS	TN	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
141	EQUALS	TX	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
142	EQUALS	VA	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
143	EQUALS	WI	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
144	EQUALS	CA	f	f	9	2020-08-26 19:30:31.624642+00	2020-08-26 19:30:31.624642+00	\N	["InboundNumber:State"]
177	BEGINS_WITH	1	f	f	26	2020-10-16 06:19:56.375296+00	2020-10-16 06:19:56.375296+00	8	["InboundNumber:State"]
178	CONTAINS	1c417ae0-ae30-40cd-8f51-e83201abca87	f	f	26	2020-10-16 06:19:56.375296+00	2020-10-16 06:19:56.375296+00	15	["InboundNumber:State"]
179	EQUALS	["AK","CA"]	f	f	26	2020-10-16 06:19:56.375296+00	2020-10-16 06:19:56.375296+00	69	["InboundNumber:State"]
180	EXISTS	a38f0f4d-cd7e-4426-8207-50aeb57a0f8e	f	f	27	2020-10-16 06:19:56.459022+00	2020-10-16 06:19:56.459022+00	40	["InboundNumber:State"]
\.


--
-- Data for Name: dial_settings; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.dial_settings (id, "dialAttempts", created_at, updated_at) FROM stdin;
1	1	2020-08-26 19:31:44.45825+00	2020-08-26 19:31:44.45825+00
2	3	2020-08-26 19:31:44.45825+00	2020-08-26 19:31:44.45825+00
3	3	2020-08-26 19:31:44.45825+00	2020-08-26 19:31:44.45825+00
4	3	2020-08-26 19:31:44.45825+00	2020-08-26 19:31:44.45825+00
5	3	2020-08-26 19:31:44.45825+00	2020-08-26 19:31:44.45825+00
6	3	2020-08-26 19:31:44.45825+00	2020-08-26 19:31:44.45825+00
7	15	2020-08-26 19:31:44.45825+00	2020-08-26 19:31:44.45825+00
8	1	2020-08-26 19:31:44.45825+00	2020-08-26 19:31:44.45825+00
9	10	2020-08-26 19:31:44.45825+00	2020-08-26 19:31:44.45825+00
10	3	2020-08-26 19:31:44.45825+00	2020-08-26 19:31:44.45825+00
11	3	2020-08-26 19:31:44.45825+00	2020-08-26 19:31:44.45825+00
12	1	2020-08-26 19:31:44.45825+00	2020-08-26 19:31:44.45825+00
13	3	2020-08-26 19:31:44.45825+00	2020-08-26 19:31:44.45825+00
14	3	2020-10-16 06:08:53.222086+00	2020-10-16 06:08:53.222086+00
15	3	2020-10-16 06:09:54.633988+00	2020-10-16 06:09:54.633988+00
16	3	2020-10-16 06:53:26.493705+00	2020-10-16 06:53:26.493705+00
17	3	2020-10-16 06:55:14.97667+00	2020-10-16 06:55:14.97667+00
18	3	2020-10-16 15:15:44.386013+00	2020-10-16 15:15:44.386013+00
19	3	2020-10-16 15:27:14.20716+00	2020-10-16 15:27:14.20716+00
20	3	2020-10-16 15:29:09.856116+00	2020-10-16 15:29:09.856116+00
21	3	2020-10-16 15:52:18.907661+00	2020-10-16 15:52:18.907661+00
22	3	2020-10-16 15:55:45.823614+00	2020-10-16 15:55:45.823614+00
23	3	2020-10-16 15:57:59.61358+00	2020-10-16 15:57:59.61358+00
24	3	2020-10-16 16:18:50.5868+00	2020-10-16 16:18:50.5868+00
25	2	2020-10-16 16:21:45.9074+00	2020-10-16 16:21:45.9074+00
26	3	2020-10-19 19:12:00.379055+00	2020-10-19 19:12:00.379055+00
27	3	2020-10-19 19:16:33.366464+00	2020-10-19 19:16:33.366464+00
\.


--
-- Data for Name: distributions_type; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.distributions_type (value) FROM stdin;
WEIGHT_BY_TARGETS_AVAILABLE
BY_CAMPAIGN
\.


--
-- Data for Name: duplicate_call_settings; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.duplicate_call_settings (id, "routeToOriginal", "routeToDifferent", strict, created_at, updated_at) FROM stdin;
1	f	f	f	2020-08-26 19:31:44.441718+00	2020-08-26 19:31:44.441718+00
2	f	f	t	2020-08-26 19:31:44.441718+00	2020-08-26 19:31:44.441718+00
3	f	t	f	2020-08-26 19:31:44.441718+00	2020-08-26 19:31:44.441718+00
4	f	f	t	2020-08-26 19:31:44.441718+00	2020-08-26 19:31:44.441718+00
5	f	f	t	2020-08-26 19:31:44.441718+00	2020-08-26 19:31:44.441718+00
6	f	t	f	2020-08-26 19:31:44.441718+00	2020-08-26 19:31:44.441718+00
7	f	t	t	2020-08-26 19:31:44.441718+00	2020-08-26 19:31:44.441718+00
8	f	t	f	2020-08-26 19:31:44.441718+00	2020-08-26 19:31:44.441718+00
9	f	t	t	2020-08-26 19:31:44.441718+00	2020-08-26 19:31:44.441718+00
10	f	f	f	2020-08-26 19:31:44.441718+00	2020-08-26 19:31:44.441718+00
11	f	t	f	2020-08-26 19:31:44.441718+00	2020-08-26 19:31:44.441718+00
12	f	t	f	2020-08-26 19:31:44.441718+00	2020-08-26 19:31:44.441718+00
13	f	f	t	2020-08-26 19:31:44.441718+00	2020-08-26 19:31:44.441718+00
14	f	f	f	2020-10-16 06:08:53.222086+00	2020-10-16 06:08:53.222086+00
15	f	f	f	2020-10-16 06:09:54.633988+00	2020-10-16 06:09:54.633988+00
16	f	f	f	2020-10-16 06:53:26.493705+00	2020-10-16 06:53:26.493705+00
17	f	f	f	2020-10-16 06:55:14.97667+00	2020-10-16 06:55:14.97667+00
18	f	f	f	2020-10-16 15:15:44.386013+00	2020-10-16 15:15:44.386013+00
19	f	f	f	2020-10-16 15:27:14.20716+00	2020-10-16 15:27:14.20716+00
20	f	f	f	2020-10-16 15:29:09.856116+00	2020-10-16 15:29:09.856116+00
21	f	f	f	2020-10-16 15:52:18.907661+00	2020-10-16 15:52:18.907661+00
22	f	f	f	2020-10-16 15:55:45.823614+00	2020-10-16 15:55:45.823614+00
23	f	f	f	2020-10-16 15:57:59.61358+00	2020-10-16 15:57:59.61358+00
24	f	f	f	2020-10-16 16:18:50.5868+00	2020-10-16 16:18:50.5868+00
25	f	t	t	2020-10-16 16:21:45.9074+00	2020-10-16 16:21:45.9074+00
26	f	f	f	2020-10-19 19:12:00.379055+00	2020-10-19 19:12:00.379055+00
27	f	f	f	2020-10-19 19:16:33.366464+00	2020-10-19 19:16:33.366464+00
\.


--
-- Data for Name: duplicate_setting_type; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.duplicate_setting_type (value) FROM stdin;
ON_CONNECT
ON_INCOMMING
ON_CALL_LENGTH
\.


--
-- Data for Name: duplicate_settings; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.duplicate_settings (id, "secondsFromLastCall", created_at, updated_at) FROM stdin;
1	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
2	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
3	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
4	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
5	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
6	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
7	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
8	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
9	-1	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
10	-1	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
11	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
12	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
13	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
14	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
15	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
16	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
17	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
18	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
19	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
20	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
21	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
22	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
23	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
24	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
25	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
26	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
27	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
28	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
29	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
30	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
31	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
32	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
33	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
34	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
35	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
36	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
37	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
38	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
39	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
40	0	2020-08-26 19:31:44.489879+00	2020-08-26 19:31:44.489879+00
41	0	2020-10-16 06:08:53.222086+00	2020-10-16 06:08:53.222086+00
42	0	2020-10-16 06:09:54.633988+00	2020-10-16 06:09:54.633988+00
43	0	2020-10-16 06:53:26.493705+00	2020-10-16 06:53:26.493705+00
44	0	2020-10-16 06:55:14.97667+00	2020-10-16 06:55:14.97667+00
45	0	2020-10-16 15:15:44.386013+00	2020-10-16 15:15:44.386013+00
46	0	2020-10-16 15:15:44.386013+00	2020-10-16 15:15:44.386013+00
47	0	2020-10-16 15:27:14.20716+00	2020-10-16 15:27:14.20716+00
48	0	2020-10-16 15:27:14.20716+00	2020-10-16 15:27:14.20716+00
49	0	2020-10-16 15:29:09.856116+00	2020-10-16 15:29:09.856116+00
50	0	2020-10-16 15:29:09.856116+00	2020-10-16 15:29:09.856116+00
51	0	2020-10-16 15:52:18.907661+00	2020-10-16 15:52:18.907661+00
52	0	2020-10-16 15:52:18.907661+00	2020-10-16 15:52:18.907661+00
53	0	2020-10-16 15:55:45.823614+00	2020-10-16 15:55:45.823614+00
54	0	2020-10-16 15:55:45.823614+00	2020-10-16 15:55:45.823614+00
55	0	2020-10-16 15:57:59.61358+00	2020-10-16 15:57:59.61358+00
56	0	2020-10-16 15:57:59.61358+00	2020-10-16 15:57:59.61358+00
57	0	2020-10-16 16:18:50.5868+00	2020-10-16 16:18:50.5868+00
58	0	2020-10-16 16:18:50.5868+00	2020-10-16 16:18:50.5868+00
59	0	2020-10-16 16:21:45.9074+00	2020-10-16 16:21:45.9074+00
60	0	2020-10-16 16:21:45.9074+00	2020-10-16 16:21:45.9074+00
61	0	2020-10-19 15:52:38.030248+00	2020-10-19 15:52:38.030248+00
62	0	2020-10-19 15:54:10.089169+00	2020-10-19 15:54:10.089169+00
63	0	2020-10-19 17:03:16.192635+00	2020-10-19 17:03:16.192635+00
64	0	2020-10-19 19:12:00.379055+00	2020-10-19 19:12:00.379055+00
65	0	2020-10-19 19:12:00.379055+00	2020-10-19 19:12:00.379055+00
66	0	2020-10-19 19:16:33.366464+00	2020-10-19 19:16:33.366464+00
67	0	2020-10-19 19:16:33.366464+00	2020-10-19 19:16:33.366464+00
\.


--
-- Data for Name: integration_conversion_sets; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.integration_conversion_sets (id, name, enabled, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: integration_settings; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.integration_settings (id, "integrationId", name, "jsTagId", configuration, "eventCode", "callerIdOnlyConversion", "conversionSetId", "numberId", "accountId", enabled, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: integrations; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.integrations (id, type, "securityContextId", "platformPrimaryId", "platformSubId", status, name, "accountId", enabled, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: iso_weekdays_type; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.iso_weekdays_type (value) FROM stdin;
MONDAY
TUESDAY
WEDNESDAY
THURSDAY
FRIDAY
SATURDAY
SUNDAY
\.


--
-- Data for Name: knex_migrations; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.knex_migrations (id, name, batch, migration_time) FROM stdin;
1	20200713164029_app_configuration.js	1	2020-08-26 19:19:39.783+00
2	20200716123816_accounts.js	1	2020-08-26 19:19:39.792+00
3	20200716133738_buyers.js	1	2020-08-26 19:19:39.801+00
4	20200724155721_number_assignment_settings.js	1	2020-08-26 19:19:39.807+00
5	20200727122050_spam_detection_settings.js	1	2020-08-26 19:19:39.812+00
6	20200727133629_integrations.js	1	2020-08-26 19:19:39.819+00
7	20200727153809_routing_priorities.js	1	2020-08-26 19:19:39.824+00
8	20200727161824_integration_conversion_sets.js	1	2020-08-26 19:19:39.828+00
9	20200727163038_sip_numbers.js	1	2020-08-26 19:19:39.834+00
10	20200727172047_operation_times.js	1	2020-08-26 19:19:39.839+00
11	20200727173914_schedules_and_capacities.js	1	2020-08-26 19:19:39.844+00
12	20200728091522_criterias.js	1	2020-08-26 19:19:39.85+00
13	20200728133734_integration_settings.js	1	2020-08-26 19:19:39.861+00
14	20200728133916_targets.js	1	2020-08-26 19:19:39.884+00
15	20200728133947_call_instructions.js	1	2020-08-26 19:19:39.892+00
16	20200728134712_office_breaks.js	1	2020-08-26 19:19:39.909+00
17	20200728135026_open_settings.js	1	2020-08-26 19:19:39.927+00
18	20200728135448_tags.js	1	2020-08-26 19:19:39.936+00
19	20200728135704_numbers.js	1	2020-08-26 19:19:39.959+00
20	20200728135808_call_routes.js	1	2020-08-26 19:19:39.978+00
21	20200728140142_tag_routing_tables.js	1	2020-08-26 19:19:39.984+00
22	20200728140454_campaigns.js	1	2020-08-26 19:19:40.001+00
23	20200729022808_target_criterias.js	1	2020-08-26 19:19:40.007+00
24	20200729023243_sip_add_foreign_instruction.js	1	2020-08-26 19:19:40.011+00
25	20200729023532_criteria_add_foreign_tagroutablerule.js	1	2020-08-26 19:19:40.027+00
26	20200729024019_target_criteria_add_foreign_target_tagroutablerule.js	1	2020-08-26 19:19:40.037+00
27	20200729024221_target_add_foreign_call_instruction.js	1	2020-08-26 19:19:40.042+00
28	20200729031509_number_tags.js	1	2020-08-26 19:19:40.046+00
29	20200729031617_number_tag_add_foreign_number_tag.js	1	2020-08-26 19:19:40.05+00
30	20200729042529_campaign_call_routes.js	1	2020-08-26 19:19:40.055+00
31	20200729042649_campaign_call_route_add_foreign_campaign_call_route.js	1	2020-08-26 19:19:40.059+00
32	20200729092858_affiliates.js	1	2020-08-26 19:19:40.072+00
33	20200729093106_campaign_affiliates.js	1	2020-08-26 19:19:40.078+00
34	20200729093257_campaign_affiliate_add_foreign_campaign_affiliate.js	1	2020-08-26 19:19:40.081+00
35	20200730114550_number_add_foreign_keys.js	1	2020-08-26 19:19:40.088+00
36	20200730155346_numbers.js	1	2020-08-26 19:19:40.091+00
37	20200730163850_numbers.js	1	2020-08-26 19:19:40.093+00
38	20200804162602_criteria_add_col_tagids.js	1	2020-08-26 19:19:40.096+00
39	20200804234136_office_break_add_foreign_open_setting.js	1	2020-08-26 19:19:40.099+00
40	20200805074540_schedules_and_capacities_rename_timezone.js	1	2020-08-26 19:19:40.1+00
41	20200805131550_call_conversion_settings.js	1	2020-08-26 19:19:40.108+00
42	20200805135744_duplicate_settings.js	1	2020-08-26 19:19:40.112+00
43	20200805140521_call_conversion_setting_add_foreign_duplicate_setting.js	1	2020-08-26 19:19:40.115+00
44	20200805144017_duplicate_call_settings.js	1	2020-08-26 19:19:40.12+00
45	20200805144305_campaign_add_dupcall.js	1	2020-08-26 19:19:40.123+00
46	20200805160141_campaign_add_foreign_dupcall.js	1	2020-08-26 19:19:40.126+00
47	20200806110933_mark_as_duplicate_settings.js	1	2020-08-26 19:19:40.13+00
48	20200806111301_dial_settings.js	1	2020-08-26 19:19:40.133+00
49	20200806113934_record_call_settings.js	1	2020-08-26 19:19:40.139+00
50	20200806124044_campaign_add_dup_dial_record_settings.js	1	2020-08-26 19:19:40.142+00
51	20200806124719_campaign_foreign_dup_dial_record_settings.js	1	2020-08-26 19:19:40.146+00
52	20200807154555_open_settings_add_isoWeekday.js	1	2020-08-26 19:19:40.148+00
53	20200818181753_campaigns_add_workflowsid.js	1	2020-08-26 19:19:40.15+00
54	20200818182011_missed_calls.js	1	2020-08-26 19:19:40.157+00
55	20200819110603_campaigns_add_queuesid.js	1	2020-08-26 19:19:40.159+00
\.


--
-- Data for Name: knex_migrations_lock; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.knex_migrations_lock (index, is_locked) FROM stdin;
1	0
\.


--
-- Data for Name: mark_as_duplicate_settings; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.mark_as_duplicate_settings (id, "duplicateSetting", "callLengthInSeconds", created_at, updated_at) FROM stdin;
1	ON_CALL_LENGTH	120	2020-08-26 19:31:44.456707+00	2020-08-26 19:31:44.456707+00
2	ON_CONNECT	0	2020-08-26 19:31:44.456707+00	2020-08-26 19:31:44.456707+00
3	ON_CALL_LENGTH	120	2020-08-26 19:31:44.456707+00	2020-08-26 19:31:44.456707+00
4	ON_CONNECT	0	2020-08-26 19:31:44.456707+00	2020-08-26 19:31:44.456707+00
5	ON_CONNECT	0	2020-08-26 19:31:44.456707+00	2020-08-26 19:31:44.456707+00
6	ON_CALL_LENGTH	180	2020-08-26 19:31:44.456707+00	2020-08-26 19:31:44.456707+00
7	ON_CALL_LENGTH	90	2020-08-26 19:31:44.456707+00	2020-08-26 19:31:44.456707+00
8	ON_CALL_LENGTH	120	2020-08-26 19:31:44.456707+00	2020-08-26 19:31:44.456707+00
9	ON_CALL_LENGTH	120	2020-08-26 19:31:44.456707+00	2020-08-26 19:31:44.456707+00
10	ON_CALL_LENGTH	120	2020-08-26 19:31:44.456707+00	2020-08-26 19:31:44.456707+00
11	ON_CALL_LENGTH	90	2020-08-26 19:31:44.456707+00	2020-08-26 19:31:44.456707+00
12	ON_CALL_LENGTH	120	2020-08-26 19:31:44.456707+00	2020-08-26 19:31:44.456707+00
13	ON_CONNECT	0	2020-08-26 19:31:44.456707+00	2020-08-26 19:31:44.456707+00
14	ON_CONNECT	\N	2020-10-16 06:08:39.215315+00	2020-10-16 06:08:39.215315+00
15	ON_CONNECT	0	2020-10-16 06:08:53.222086+00	2020-10-16 06:08:53.222086+00
16	ON_CONNECT	0	2020-10-16 06:09:54.633988+00	2020-10-16 06:09:54.633988+00
17	ON_CONNECT	0	2020-10-16 06:53:26.493705+00	2020-10-16 06:53:26.493705+00
18	ON_CONNECT	0	2020-10-16 06:55:14.97667+00	2020-10-16 06:55:14.97667+00
19	ON_CONNECT	0	2020-10-16 15:15:44.386013+00	2020-10-16 15:15:44.386013+00
20	ON_CONNECT	0	2020-10-16 15:27:14.20716+00	2020-10-16 15:27:14.20716+00
21	ON_CONNECT	0	2020-10-16 15:29:09.856116+00	2020-10-16 15:29:09.856116+00
22	ON_CONNECT	0	2020-10-16 15:52:18.907661+00	2020-10-16 15:52:18.907661+00
23	ON_CONNECT	0	2020-10-16 15:55:45.823614+00	2020-10-16 15:55:45.823614+00
24	ON_CONNECT	0	2020-10-16 15:57:59.61358+00	2020-10-16 15:57:59.61358+00
25	ON_CONNECT	0	2020-10-16 16:18:50.5868+00	2020-10-16 16:18:50.5868+00
26	ON_CONNECT	0	2020-10-16 16:21:45.9074+00	2020-10-16 16:21:45.9074+00
27	ON_CONNECT	\N	2020-10-16 16:33:01.85256+00	2020-10-16 16:33:01.85256+00
28	ON_CONNECT	0	2020-10-19 19:12:00.379055+00	2020-10-19 19:12:00.379055+00
29	ON_CONNECT	0	2020-10-19 19:16:33.366464+00	2020-10-19 19:16:33.366464+00
\.


--
-- Data for Name: missed_calls; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.missed_calls (id, "phoneNumber", "campaignId", created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: number_assignment_settings; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.number_assignment_settings (id, "countryCode", region, "areaCode", contains, "zipCode", "isTollFree", created_at, updated_at) FROM stdin;
1	US	\N	561	\N	\N	f	2020-08-26 19:32:26.718972+00	2020-08-26 19:32:26.718972+00
2	US	\N	\N	\N	\N	f	2020-08-26 19:32:26.718972+00	2020-08-26 19:32:26.718972+00
3	US	\N	607	\N	\N	f	2020-08-26 19:32:26.718972+00	2020-08-26 19:32:26.718972+00
4	US	\N	\N	\N	\N	f	2020-08-26 19:32:26.718972+00	2020-08-26 19:32:26.718972+00
5	US	\N	\N	\N	\N	f	2020-08-26 19:32:26.718972+00	2020-08-26 19:32:26.718972+00
6	US	\N	\N	\N	\N	f	2020-08-26 19:32:26.718972+00	2020-08-26 19:32:26.718972+00
7	US	\N	\N	\N	\N	f	2020-08-26 19:32:26.718972+00	2020-08-26 19:32:26.718972+00
8	US	\N	831	\N	\N	f	2020-08-26 19:32:26.718972+00	2020-08-26 19:32:26.718972+00
9	US	\N	954	\N	\N	f	2020-08-26 19:32:26.718972+00	2020-08-26 19:32:26.718972+00
10	US	\N	\N	\N	\N	f	2020-08-26 19:32:26.718972+00	2020-08-26 19:32:26.718972+00
11	US	\N	561	\N	\N	f	2020-08-26 19:32:26.718972+00	2020-08-26 19:32:26.718972+00
12	US	\N	\N	\N	\N	f	2020-08-26 19:32:26.718972+00	2020-08-26 19:32:26.718972+00
13	US	\N	\N	\N	\N	t	2020-10-16 06:08:53.222086+00	2020-10-16 06:08:53.222086+00
14	US	\N	\N	\N	\N	t	2020-10-16 06:09:54.633988+00	2020-10-16 06:09:54.633988+00
15	US	\N	\N	\N	\N	t	2020-10-16 06:53:26.493705+00	2020-10-16 06:53:26.493705+00
16	US	\N	\N	\N	\N	t	2020-10-16 06:55:14.97667+00	2020-10-16 06:55:14.97667+00
17	US	\N	\N	\N	\N	t	2020-10-16 15:15:44.386013+00	2020-10-16 15:15:44.386013+00
18	US	\N	\N	\N	\N	t	2020-10-16 15:27:14.20716+00	2020-10-16 15:27:14.20716+00
19	US	\N	\N	\N	\N	t	2020-10-16 15:29:09.856116+00	2020-10-16 15:29:09.856116+00
20	US	\N	\N	\N	\N	t	2020-10-16 15:52:18.907661+00	2020-10-16 15:52:18.907661+00
21	US	\N	\N	\N	\N	t	2020-10-16 15:55:45.823614+00	2020-10-16 15:55:45.823614+00
22	US	\N	\N	\N	\N	t	2020-10-16 15:57:59.61358+00	2020-10-16 15:57:59.61358+00
23	US	\N	\N	\N	\N	t	2020-10-16 16:18:50.5868+00	2020-10-16 16:18:50.5868+00
24	US	\N	\N	\N	\N	t	2020-10-16 16:21:45.9074+00	2020-10-16 16:21:45.9074+00
25	US	\N	\N	\N	\N	t	2020-10-19 19:12:00.379055+00	2020-10-19 19:12:00.379055+00
26	US	\N	\N	\N	\N	t	2020-10-19 19:16:33.366464+00	2020-10-19 19:16:33.366464+00
27	US	\N	\N	\N	\N	t	2020-10-20 14:59:32.463481+00	2020-10-20 14:59:32.463481+00
\.


--
-- Data for Name: number_tags; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.number_tags (id, "numberId", "tagId", created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: numbers; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.numbers (id, name, "accountId", "friendlyName", "phoneNumber", lata, locality, "rateCenter", latitude, longitude, region, "postalCode", "isoCountry", "addressRequirements", beta, capabilities, "numberPoolId", "campaignId", "jsTagId", "offerId", "allocationDT", "lastBillDT", "nextChargeDT", "lastChargeDT", "deAllocationDT", "autoRenew", "renewDOM", "isTollFree", "isActivated", "assignmentSettingsId", "deallocFlag", "failedRechargeAttempts", "isCarrierNumber", "affiliateId", enabled, created_at, updated_at, "localNumber", "displayNumber", provider, "providerAccountId", "providerId", "carrierNumberId", "intSettingIds") FROM stdin;
1	DRIPS Inbound	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	\N	+15619486069	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	1	\N	\N	2019-08-05 18:11:45.595373+00	2020-07-05 00:00:00+00	2020-08-03 00:00:00+00	2020-07-03 23:00:13.415856+00	0001-01-01 04:56:02+00	t	5	f	f	1	f	0	f	14d344b9-93de-43e1-8264-94742e379f88	t	2020-08-26 19:32:26.732603+00	2020-08-26 19:32:26.732603+00	(561) 948-6069	15619486069	telnyx	1299489388324979809	1330775887238399268	1330775887238399268	{}
2	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	\N	+12142538449	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	3	\N	\N	2020-02-26 16:59:41.251138+00	2020-06-26 00:00:00+00	2020-07-24 00:00:00+00	2020-06-24 23:00:12.717183+00	0001-01-01 04:56:02+00	t	26	f	f	2	f	0	f	0cf5c6ef-4a62-4c99-8e20-77145e65e50c	t	2020-08-26 19:32:26.732603+00	2020-08-26 19:32:26.732603+00	(214) 253-8449	12142538449	telnyx	1299489388324979809	1330770259145131974	1330770259145131974	{INTSET7b517314c20e448ab69ed1c0ff978fce}
3	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	\N	+16074639533	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	4	\N	\N	2020-07-22 19:52:14.39812+00	2020-07-22 00:00:00+00	2020-08-20 00:00:00+00	2020-07-22 00:00:00+00	0001-01-01 04:56:02+00	t	22	f	f	3	f	0	f	14d344b9-93de-43e1-8264-94742e379f88	t	2020-08-26 19:32:26.732603+00	2020-08-26 19:32:26.732603+00	(607) 463-9533	16074639533	telnyx	1299489388324979809	1421885263956674328		\N
4	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	\N	+18203002464	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	5	\N	\N	2020-02-28 22:13:16.844155+00	2020-06-28 00:00:00+00	2020-07-26 00:00:00+00	2020-06-26 23:00:15.18505+00	0001-01-01 04:56:02+00	t	28	f	f	4	f	0	f	14d344b9-93de-43e1-8264-94742e379f88	t	2020-08-26 19:32:26.732603+00	2020-08-26 19:32:26.732603+00	\N	18203002464	telnyx	1299489388324979809	1344371865061164782	1344371865061164782	\N
5	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	\N	+18053197236	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	6	\N	\N	2019-08-07 15:38:52.151843+00	2020-07-07 00:00:00+00	2020-08-05 00:00:00+00	2020-07-05 23:00:15.806754+00	0001-01-01 04:56:02+00	t	7	f	f	5	f	0	f	14d344b9-93de-43e1-8264-94742e379f88	t	2020-08-26 19:32:26.732603+00	2020-08-26 19:32:26.732603+00	(805) 319-7236	18053197236	telnyx	1299489388324979809	1330780934395397158	1330780934395397158	{INTSETeb895f2c6692458cb39143aa284bcbe1}
6	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	\N	+18787770878	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	6	\N	\N	2020-04-29 19:57:34.070953+00	2020-06-29 00:00:00+00	2020-07-27 00:00:00+00	2020-06-27 23:00:19.953514+00	0001-01-01 04:56:02+00	t	29	f	f	6	f	0	f	8359b084-aa49-4b84-b257-2d5e86fcae59	t	2020-08-26 19:32:26.732603+00	2020-08-26 19:32:26.732603+00	(878) 777-0878	18787770878	telnyx	1299489388324979809	1361006785279821077		\N
7	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	\N	+14103192217	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	7	\N	\N	2019-07-25 14:53:26.979544+00	2020-06-25 00:00:00+00	2020-07-23 00:00:00+00	2020-06-23 23:00:15.976768+00	0001-01-01 04:56:02+00	t	25	f	f	7	f	0	f	14d344b9-93de-43e1-8264-94742e379f88	t	2020-08-26 19:32:26.732603+00	2020-08-26 19:32:26.732603+00	(410) 319-2217	14103192217	telnyx	1299489388324979809	1330770279923714012	1330770279923714012	{INTSET3f04f31733fe44809d2a74a1f670171a}
8	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	\N	+18312301558	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	8	\N	\N	2020-06-24 15:28:53.473168+00	2020-07-24 00:00:00+00	2020-08-22 00:00:00+00	2020-07-22 23:00:13.619483+00	0001-01-01 04:56:02+00	t	24	f	f	8	f	0	f	14d344b9-93de-43e1-8264-94742e379f88	t	2020-08-26 19:32:26.732603+00	2020-08-26 19:32:26.732603+00	(831) 230-1558	18312301558	telnyx	1299489388324979809	1401458996279248352		\N
9	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	\N	+19544801751	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	9	\N	\N	2019-11-01 19:19:08.94234+00	2020-07-01 00:00:00+00	2020-07-30 00:00:00+00	2020-06-29 23:00:10.112361+00	0001-01-01 04:56:02+00	t	1	f	f	9	f	0	f	14d344b9-93de-43e1-8264-94742e379f88	t	2020-08-26 19:32:26.732603+00	2020-08-26 19:32:26.732603+00	(954) 480-1751	19544801751	telnyx	1299489388324979809	1330780766958782376	1330780766958782376	{INTSET51017f59b84e42b7bfcaeaa10ca6299c}
10	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	\N	+19282910542	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	10	\N	\N	2020-03-30 20:27:14.117524+00	2020-06-30 00:00:00+00	2020-07-28 00:00:00+00	2020-06-28 23:00:05.674131+00	0001-01-01 04:56:02+00	t	30	f	f	10	f	0	f	5a4b7fce-4b46-421d-b97c-55aed10a07f5	t	2020-08-26 19:32:26.732603+00	2020-08-26 19:32:26.732603+00	(928) 291-0542	19282910542	telnyx	1299489388324979809	1339278450661263006	1339278450661263006	{INTSET7fec5024be0a4fa383892658ce145a51}
11	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	\N	+15614489237	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	11	\N	\N	2019-10-26 14:40:31.74225+00	2020-06-26 00:00:00+00	2020-07-24 00:00:00+00	2020-06-24 23:00:12.717183+00	0001-01-01 04:56:02+00	t	26	f	f	11	f	0	f	14d344b9-93de-43e1-8264-94742e379f88	t	2020-08-26 19:32:26.732603+00	2020-08-26 19:32:26.732603+00	(561) 448-9237	15614489237	telnyx	1299489388324979809	1330775925171684731	1330775925171684731	{INTSETf28144bc60e34b7bad4e7b3fbdeb18e5}
12	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	\N	+19292017087	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	12	\N	\N	2020-02-26 18:06:31.122141+00	2020-06-26 00:00:00+00	2020-07-24 00:00:00+00	2020-06-24 23:00:12.717183+00	0001-01-01 04:56:02+00	t	26	f	f	12	f	0	f	a01bc382-0505-4312-b481-374be22346b8	t	2020-08-26 19:32:26.732603+00	2020-08-26 19:32:26.732603+00	(929) 201-7087	19292017087	telnyx	1299489388324979809	1330780594790991655	1330780594790991655	{INTSETcad99f0b46234e2591fcb7981289397e}
16	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	(855) 339-8928	+18553398928	\N	\N	\N	\N	\N	\N	\N	US	none	f	{"MMS": false, "SMS": true, "fax": true, "voice": true}	\N	17	\N	\N	2020-10-16 06:55:14.908+00	2020-10-16 06:55:14.908+00	\N	\N	\N	t	\N	t	t	16	f	0	f	14d344b9-93de-43e1-8264-94742e379f88	t	2020-10-16 06:55:14.97667+00	2020-10-16 06:55:14.97667+00	(855) 339-8928	18553398928	twilio	ACa5d13ced0c9bdf7563e7b6849cdbfe9e	1	\N	\N
17	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	(855) 339-8928	+18553398928	\N	\N	\N	\N	\N	\N	\N	US	none	f	{"MMS": false, "SMS": true, "fax": true, "voice": true}	\N	18	\N	\N	2020-10-16 15:15:44.32+00	2020-10-16 15:15:44.32+00	\N	\N	\N	t	\N	t	t	17	f	0	f	14d344b9-93de-43e1-8264-94742e379f88	t	2020-10-16 15:15:44.386013+00	2020-10-16 15:15:44.386013+00	(855) 339-8928	18553398928	twilio	ACa5d13ced0c9bdf7563e7b6849cdbfe9e	1	\N	\N
18	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	(855) 339-8928	+18553398928	\N	\N	\N	\N	\N	\N	\N	US	none	f	{"MMS": false, "SMS": true, "fax": true, "voice": true}	\N	19	\N	\N	2020-10-16 15:27:14.145+00	2020-10-16 15:27:14.145+00	\N	\N	\N	t	\N	t	t	18	f	0	f	14d344b9-93de-43e1-8264-94742e379f88	t	2020-10-16 15:27:14.20716+00	2020-10-16 15:27:14.20716+00	(855) 339-8928	18553398928	twilio	ACa5d13ced0c9bdf7563e7b6849cdbfe9e	1	\N	\N
19	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	(855) 339-8928	+18553398928	\N	\N	\N	\N	\N	\N	\N	US	none	f	{"MMS": false, "SMS": true, "fax": true, "voice": true}	\N	20	\N	\N	2020-10-16 15:29:09.78+00	2020-10-16 15:29:09.78+00	\N	\N	\N	t	\N	t	t	19	f	0	f	14d344b9-93de-43e1-8264-94742e379f88	t	2020-10-16 15:29:09.856116+00	2020-10-16 15:29:09.856116+00	(855) 339-8928	18553398928	twilio	ACa5d13ced0c9bdf7563e7b6849cdbfe9e	1	\N	\N
20	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	(855) 339-8928	+18553398928	\N	\N	\N	\N	\N	\N	\N	US	none	f	{"MMS": false, "SMS": true, "fax": true, "voice": true}	\N	21	\N	\N	2020-10-16 15:52:18.843+00	2020-10-16 15:52:18.843+00	\N	\N	\N	t	\N	t	t	20	f	0	f	14d344b9-93de-43e1-8264-94742e379f88	t	2020-10-16 15:52:18.907661+00	2020-10-16 15:52:18.907661+00	(855) 339-8928	18553398928	twilio	ACa5d13ced0c9bdf7563e7b6849cdbfe9e	1	\N	\N
21	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	(855) 339-8928	+18553398928	\N	\N	\N	\N	\N	\N	\N	US	none	f	{"MMS": false, "SMS": true, "fax": true, "voice": true}	\N	22	\N	\N	2020-10-16 15:55:45.754+00	2020-10-16 15:55:45.754+00	\N	\N	\N	t	\N	t	t	21	f	0	f	14d344b9-93de-43e1-8264-94742e379f88	t	2020-10-16 15:55:45.823614+00	2020-10-16 15:55:45.823614+00	(855) 339-8928	18553398928	twilio	ACa5d13ced0c9bdf7563e7b6849cdbfe9e	1	\N	\N
22	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	(855) 339-8928	+18553398928	\N	\N	\N	\N	\N	\N	\N	US	none	f	{"MMS": false, "SMS": true, "fax": true, "voice": true}	\N	23	\N	\N	2020-10-16 15:57:59.539+00	2020-10-16 15:57:59.539+00	\N	\N	\N	t	\N	t	t	22	f	0	f	14d344b9-93de-43e1-8264-94742e379f88	t	2020-10-16 15:57:59.61358+00	2020-10-16 15:57:59.61358+00	(855) 339-8928	18553398928	twilio	ACa5d13ced0c9bdf7563e7b6849cdbfe9e	1	\N	\N
23	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	(855) 339-8928	+18553398928	\N	\N	\N	\N	\N	\N	\N	US	none	f	{"MMS": false, "SMS": true, "fax": true, "voice": true}	\N	24	\N	\N	2020-10-16 16:18:50.519+00	2020-10-16 16:18:50.519+00	\N	\N	\N	t	\N	t	t	23	f	0	f	14d344b9-93de-43e1-8264-94742e379f88	t	2020-10-16 16:18:50.5868+00	2020-10-16 16:18:50.5868+00	(855) 339-8928	18553398928	twilio	ACa5d13ced0c9bdf7563e7b6849cdbfe9e	1	\N	\N
24	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	(855) 339-8928	+18553398928	\N	\N	\N	\N	\N	\N	\N	US	none	f	{"MMS": false, "SMS": true, "fax": true, "voice": true}	\N	25	\N	\N	2020-10-16 16:21:45.845+00	2020-10-16 16:21:45.845+00	\N	\N	\N	t	\N	t	t	24	f	0	f	14d344b9-93de-43e1-8264-94742e379f88	t	2020-10-16 16:21:45.9074+00	2020-10-16 16:21:45.9074+00	(855) 339-8928	18553398928	twilio	ACa5d13ced0c9bdf7563e7b6849cdbfe9e	1	\N	\N
25	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	(855) 339-8928	+18553398928	\N	\N	\N	\N	\N	\N	\N	US	none	f	{"MMS": false, "SMS": true, "fax": true, "voice": true}	\N	26	\N	\N	2020-10-19 19:12:00.301+00	2020-10-19 19:12:00.301+00	\N	\N	\N	t	\N	t	t	25	f	0	f	14d344b9-93de-43e1-8264-94742e379f88	t	2020-10-19 19:12:00.379055+00	2020-10-19 19:12:00.379055+00	(855) 339-8928	18553398928	twilio	ACa5d13ced0c9bdf7563e7b6849cdbfe9e	1	\N	\N
26	\N	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	(855) 339-8928	+18553398928	\N	\N	\N	\N	\N	\N	\N	US	none	f	{"MMS": false, "SMS": true, "fax": true, "voice": true}	\N	27	\N	\N	2020-10-19 19:16:33.289+00	2020-10-19 19:16:33.289+00	\N	\N	\N	t	\N	t	t	26	f	0	f	14d344b9-93de-43e1-8264-94742e379f88	t	2020-10-19 19:16:33.366464+00	2020-10-19 19:16:33.366464+00	(855) 339-8928	18553398928	twilio	ACa5d13ced0c9bdf7563e7b6849cdbfe9e	1	\N	\N
27	\N	\N	(855) 339-8928	+18553398928	\N	\N	\N	\N	\N	\N	\N	US	none	f	{"MMS": false, "SMS": true, "fax": true, "voice": true}	\N	27	\N	\N	2020-10-20 14:59:32.459+00	2020-10-20 14:59:32.459+00	\N	\N	\N	t	\N	t	t	27	f	0	f	14d344b9-93de-43e1-8264-94742e379f88	t	2020-10-20 14:59:32.463481+00	2020-10-20 14:59:32.463481+00	(855) 339-8928	18553398928	twilio	ACa5d13ced0c9bdf7563e7b6849cdbfe9e	1	\N	\N
\.


--
-- Data for Name: office_breaks; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.office_breaks (id, "startTimeId", "lengthInMin", "openSettingsId", created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: open_settings; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.open_settings (id, "openTimeId", "closeTimeId", inverted, "isClosed", "scheduleId", created_at, updated_at, "isoWeekday") FROM stdin;
1	1	2	f	t	1	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
2	3	4	f	f	1	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
3	5	6	f	f	1	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
4	7	8	f	f	1	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
5	9	10	f	f	1	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
6	11	12	f	f	1	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
7	13	14	f	f	1	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
8	15	16	f	t	2	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
9	17	18	f	f	2	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
10	19	20	f	f	2	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
11	21	22	f	f	2	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
12	23	24	f	f	2	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
13	25	26	f	f	2	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
14	27	28	f	t	2	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
15	29	30	f	t	3	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
16	31	32	f	f	3	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
17	33	34	f	f	3	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
18	35	36	f	f	3	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
19	37	38	f	f	3	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
20	39	40	f	f	3	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
21	41	42	f	t	3	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
22	43	44	f	t	4	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
23	45	46	f	f	4	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
24	47	48	f	f	4	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
25	49	50	f	f	4	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
26	51	52	f	f	4	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
27	53	54	f	f	4	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
28	55	56	f	f	4	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
29	57	58	f	t	5	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
30	59	60	f	f	5	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
31	61	62	f	f	5	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
32	63	64	f	f	5	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
33	65	66	f	f	5	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
34	67	68	f	f	5	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
35	69	70	f	t	5	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
36	71	72	f	t	7	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
37	73	74	f	f	7	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
38	75	76	f	f	7	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
39	77	78	f	f	7	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
40	79	80	f	f	7	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
41	81	82	f	f	7	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
42	83	84	f	t	7	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
43	85	86	f	t	8	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
44	87	88	f	f	8	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
45	89	90	f	f	8	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
46	91	92	f	f	8	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
47	93	94	f	f	8	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
48	95	96	f	f	8	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
49	97	98	f	t	8	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
50	99	100	f	f	9	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
51	101	102	f	f	9	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
52	103	104	f	f	9	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
53	105	106	f	f	9	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
54	107	108	f	f	9	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
55	109	110	f	f	9	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
56	111	112	f	f	9	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
57	113	114	f	f	10	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
58	115	116	f	f	10	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
59	117	118	f	f	10	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
60	119	120	f	f	10	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
61	121	122	f	f	10	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
62	123	124	f	f	10	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
63	125	126	f	f	10	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
64	127	128	f	t	11	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
65	129	130	f	f	11	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
66	131	132	f	f	11	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
67	133	134	f	f	11	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
68	135	136	f	f	11	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
69	137	138	f	f	11	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
70	139	140	f	t	11	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
71	141	142	f	t	12	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
72	143	144	f	f	12	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
73	145	146	f	f	12	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
74	147	148	f	f	12	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
75	149	150	f	f	12	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
76	151	152	f	f	12	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
77	153	154	f	f	12	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
78	155	156	f	t	13	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
79	157	158	f	f	13	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
80	159	160	f	f	13	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
81	161	162	f	f	13	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
82	163	164	f	f	13	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
83	165	166	f	f	13	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
84	167	168	f	f	13	2020-08-26 19:30:31.60204+00	2020-08-26 19:30:31.60204+00	\N
85	169	170	f	t	14	2020-08-26 19:32:42.72983+00	2020-08-26 19:32:42.72983+00	\N
86	171	172	f	f	14	2020-08-26 19:32:42.72983+00	2020-08-26 19:32:42.72983+00	\N
87	173	174	f	f	14	2020-08-26 19:32:42.72983+00	2020-08-26 19:32:42.72983+00	\N
88	175	176	f	f	14	2020-08-26 19:32:42.72983+00	2020-08-26 19:32:42.72983+00	\N
89	177	178	f	f	14	2020-08-26 19:32:42.72983+00	2020-08-26 19:32:42.72983+00	\N
90	179	180	f	f	14	2020-08-26 19:32:42.72983+00	2020-08-26 19:32:42.72983+00	\N
91	181	182	f	f	14	2020-08-26 19:32:42.72983+00	2020-08-26 19:32:42.72983+00	\N
148	296	295	f	f	15	2020-10-16 06:19:56.887885+00	2020-10-16 06:19:56.887885+00	\N
149	298	297	f	f	15	2020-10-16 06:19:56.914424+00	2020-10-16 06:19:56.914424+00	\N
150	300	299	f	f	15	2020-10-16 06:19:56.945814+00	2020-10-16 06:19:56.945814+00	\N
151	302	301	f	f	15	2020-10-16 06:19:56.973391+00	2020-10-16 06:19:56.973391+00	\N
152	304	303	f	f	15	2020-10-16 06:19:57.004527+00	2020-10-16 06:19:57.004527+00	\N
153	306	305	f	f	15	2020-10-16 06:19:57.031089+00	2020-10-16 06:19:57.031089+00	\N
154	308	307	f	f	15	2020-10-16 06:19:57.06249+00	2020-10-16 06:19:57.06249+00	\N
\.


--
-- Data for Name: operation_times; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.operation_times (id, minute, hour, created_at, updated_at) FROM stdin;
1	0	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
2	0	21	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
3	0	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
4	0	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
5	0	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
6	0	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
7	0	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
8	0	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
9	0	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
10	0	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
11	0	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
12	0	16	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
13	0	10	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
14	0	15	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
15	0	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
16	0	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
17	0	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
18	15	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
19	0	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
20	15	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
21	0	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
22	15	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
23	0	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
24	15	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
25	0	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
26	30	16	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
27	0	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
28	0	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
29	0	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
30	10	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
31	55	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
32	15	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
33	55	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
34	15	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
35	55	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
36	15	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
37	55	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
38	15	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
39	55	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
40	40	16	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
41	0	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
42	10	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
43	0	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
44	0	21	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
45	0	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
46	0	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
47	0	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
48	0	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
49	0	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
50	0	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
51	0	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
52	0	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
53	0	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
54	0	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
55	0	10	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
56	0	15	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
57	10	10	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
58	0	18	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
59	30	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
60	15	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
61	5	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
62	15	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
63	30	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
64	15	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
65	5	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
66	15	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
67	5	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
68	10	17	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
69	0	10	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
70	10	15	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
71	0	10	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
72	10	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
73	0	10	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
74	10	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
75	0	10	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
76	10	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
77	0	10	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
78	10	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
79	0	10	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
80	10	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
81	0	10	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
82	10	18	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
83	0	10	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
84	10	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
85	10	10	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
86	0	18	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
87	10	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
88	15	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
89	5	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
90	15	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
91	5	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
92	15	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
93	5	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
94	15	19	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
95	5	9	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
96	10	17	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
97	0	10	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
98	10	15	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
99	0	6	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
100	59	23	2020-08-26 19:30:31.564345+00	2020-08-26 19:30:31.564345+00
101	0	18	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
102	59	23	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
103	0	18	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
104	59	23	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
105	0	18	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
106	59	23	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
107	0	18	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
108	59	23	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
109	0	18	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
110	59	23	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
111	0	6	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
112	59	23	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
113	0	10	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
114	0	21	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
115	0	10	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
116	0	21	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
117	0	10	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
118	0	21	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
119	0	10	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
120	0	21	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
121	0	10	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
122	0	21	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
123	0	10	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
124	0	21	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
125	0	10	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
126	0	21	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
127	0	9	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
128	0	19	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
129	0	9	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
130	0	19	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
131	0	9	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
132	0	19	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
133	0	9	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
134	0	19	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
135	0	9	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
136	0	19	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
137	0	9	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
138	0	19	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
139	0	9	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
140	0	19	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
141	0	9	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
142	0	19	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
143	0	9	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
144	10	18	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
145	30	9	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
146	10	18	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
147	0	9	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
148	10	18	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
149	0	9	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
150	10	18	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
151	0	9	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
152	5	15	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
153	0	10	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
154	0	15	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
155	0	9	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
156	0	19	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
157	0	9	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
158	0	19	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
159	0	9	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
160	0	19	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
161	0	9	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
162	0	19	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
163	0	9	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
164	0	19	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
165	0	9	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
166	0	19	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
167	0	9	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
168	0	19	2020-08-26 19:30:31.570567+00	2020-08-26 19:30:31.570567+00
169	0	9	2020-08-26 19:32:42.723701+00	2020-08-26 19:32:42.723701+00
170	0	21	2020-08-26 19:32:42.723701+00	2020-08-26 19:32:42.723701+00
171	0	9	2020-08-26 19:32:42.723701+00	2020-08-26 19:32:42.723701+00
172	0	19	2020-08-26 19:32:42.723701+00	2020-08-26 19:32:42.723701+00
173	0	9	2020-08-26 19:32:42.723701+00	2020-08-26 19:32:42.723701+00
174	0	19	2020-08-26 19:32:42.723701+00	2020-08-26 19:32:42.723701+00
175	0	9	2020-08-26 19:32:42.723701+00	2020-08-26 19:32:42.723701+00
176	0	19	2020-08-26 19:32:42.723701+00	2020-08-26 19:32:42.723701+00
177	0	9	2020-08-26 19:32:42.723701+00	2020-08-26 19:32:42.723701+00
178	0	19	2020-08-26 19:32:42.723701+00	2020-08-26 19:32:42.723701+00
179	0	9	2020-08-26 19:32:42.723701+00	2020-08-26 19:32:42.723701+00
180	0	16	2020-08-26 19:32:42.723701+00	2020-08-26 19:32:42.723701+00
181	0	10	2020-08-26 19:32:42.723701+00	2020-08-26 19:32:42.723701+00
182	0	15	2020-08-26 19:32:42.723701+00	2020-08-26 19:32:42.723701+00
295	0	21	2020-10-16 06:19:56.887885+00	2020-10-16 06:19:56.887885+00
296	0	9	2020-10-16 06:19:56.887885+00	2020-10-16 06:19:56.887885+00
297	0	21	2020-10-16 06:19:56.914424+00	2020-10-16 06:19:56.914424+00
298	0	10	2020-10-16 06:19:56.914424+00	2020-10-16 06:19:56.914424+00
299	0	21	2020-10-16 06:19:56.945814+00	2020-10-16 06:19:56.945814+00
300	0	10	2020-10-16 06:19:56.945814+00	2020-10-16 06:19:56.945814+00
301	0	21	2020-10-16 06:19:56.973391+00	2020-10-16 06:19:56.973391+00
302	0	9	2020-10-16 06:19:56.973391+00	2020-10-16 06:19:56.973391+00
303	0	21	2020-10-16 06:19:57.004527+00	2020-10-16 06:19:57.004527+00
304	0	9	2020-10-16 06:19:57.004527+00	2020-10-16 06:19:57.004527+00
305	0	21	2020-10-16 06:19:57.031089+00	2020-10-16 06:19:57.031089+00
306	0	9	2020-10-16 06:19:57.031089+00	2020-10-16 06:19:57.031089+00
307	0	21	2020-10-16 06:19:57.06249+00	2020-10-16 06:19:57.06249+00
308	0	9	2020-10-16 06:19:57.06249+00	2020-10-16 06:19:57.06249+00
\.


--
-- Data for Name: record_call_settings; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.record_call_settings (id, record, "recordFromAnswer", "trimSilence", "dualChannelRecording", created_at, updated_at) FROM stdin;
1	t	t	f	t	2020-08-26 19:31:44.473991+00	2020-08-26 19:31:44.473991+00
2	t	t	f	t	2020-08-26 19:31:44.473991+00	2020-08-26 19:31:44.473991+00
3	t	t	f	t	2020-08-26 19:31:44.473991+00	2020-08-26 19:31:44.473991+00
4	t	t	f	t	2020-08-26 19:31:44.473991+00	2020-08-26 19:31:44.473991+00
5	t	t	f	t	2020-08-26 19:31:44.473991+00	2020-08-26 19:31:44.473991+00
6	t	t	f	t	2020-08-26 19:31:44.473991+00	2020-08-26 19:31:44.473991+00
7	t	t	f	t	2020-08-26 19:31:44.473991+00	2020-08-26 19:31:44.473991+00
8	t	t	f	t	2020-08-26 19:31:44.473991+00	2020-08-26 19:31:44.473991+00
9	t	t	f	t	2020-08-26 19:31:44.473991+00	2020-08-26 19:31:44.473991+00
10	t	t	f	t	2020-08-26 19:31:44.473991+00	2020-08-26 19:31:44.473991+00
11	t	t	f	t	2020-08-26 19:31:44.473991+00	2020-08-26 19:31:44.473991+00
12	t	t	f	t	2020-08-26 19:31:44.473991+00	2020-08-26 19:31:44.473991+00
13	t	t	f	t	2020-08-26 19:31:44.473991+00	2020-08-26 19:31:44.473991+00
14	t	t	f	t	2020-10-16 06:08:53.222086+00	2020-10-16 06:08:53.222086+00
15	t	t	f	t	2020-10-16 06:09:54.633988+00	2020-10-16 06:09:54.633988+00
16	t	t	f	t	2020-10-16 06:53:26.493705+00	2020-10-16 06:53:26.493705+00
17	t	t	f	t	2020-10-16 06:55:14.97667+00	2020-10-16 06:55:14.97667+00
18	t	t	f	t	2020-10-16 15:15:44.386013+00	2020-10-16 15:15:44.386013+00
19	t	t	f	t	2020-10-16 15:27:14.20716+00	2020-10-16 15:27:14.20716+00
20	t	t	f	t	2020-10-16 15:29:09.856116+00	2020-10-16 15:29:09.856116+00
21	t	t	f	t	2020-10-16 15:52:18.907661+00	2020-10-16 15:52:18.907661+00
22	t	t	f	t	2020-10-16 15:55:45.823614+00	2020-10-16 15:55:45.823614+00
23	t	t	f	t	2020-10-16 15:57:59.61358+00	2020-10-16 15:57:59.61358+00
24	t	t	f	t	2020-10-16 16:18:50.5868+00	2020-10-16 16:18:50.5868+00
25	t	t	t	t	2020-10-16 16:21:45.9074+00	2020-10-16 16:21:45.9074+00
26	t	t	f	t	2020-10-19 19:12:00.379055+00	2020-10-19 19:12:00.379055+00
27	t	t	f	t	2020-10-19 19:16:33.366464+00	2020-10-19 19:16:33.366464+00
\.


--
-- Data for Name: routing_priorities; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.routing_priorities (id, priority, weight, created_at, updated_at) FROM stdin;
1	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
2	2	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
3	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
4	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
5	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
6	4	4	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
7	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
8	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
9	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
10	2	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
11	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
12	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
13	1	2	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
14	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
15	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
16	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
17	2	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
18	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
19	1	2	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
20	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
21	4	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
22	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
23	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
24	2	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
25	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
26	2	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
27	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
28	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
29	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
30	3	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
31	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
32	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
33	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
34	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
35	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
36	2	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
37	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
38	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
39	1	1	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
40	1	2	2020-08-26 19:31:44.474329+00	2020-08-26 19:31:44.474329+00
41	1	1	2020-10-16 06:08:53.222086+00	2020-10-16 06:08:53.222086+00
42	1	1	2020-10-16 06:09:54.633988+00	2020-10-16 06:09:54.633988+00
43	1	1	2020-10-16 06:53:26.493705+00	2020-10-16 06:53:26.493705+00
44	1	1	2020-10-16 06:55:14.97667+00	2020-10-16 06:55:14.97667+00
45	1	1	2020-10-16 15:15:44.386013+00	2020-10-16 15:15:44.386013+00
46	1	1	2020-10-16 15:15:44.386013+00	2020-10-16 15:15:44.386013+00
47	1	1	2020-10-16 15:27:14.20716+00	2020-10-16 15:27:14.20716+00
48	1	1	2020-10-16 15:27:14.20716+00	2020-10-16 15:27:14.20716+00
49	1	1	2020-10-16 15:29:09.856116+00	2020-10-16 15:29:09.856116+00
50	1	1	2020-10-16 15:29:09.856116+00	2020-10-16 15:29:09.856116+00
51	1	1	2020-10-16 15:52:18.907661+00	2020-10-16 15:52:18.907661+00
52	1	1	2020-10-16 15:52:18.907661+00	2020-10-16 15:52:18.907661+00
53	1	1	2020-10-16 15:55:45.823614+00	2020-10-16 15:55:45.823614+00
54	1	1	2020-10-16 15:55:45.823614+00	2020-10-16 15:55:45.823614+00
55	1	1	2020-10-16 15:57:59.61358+00	2020-10-16 15:57:59.61358+00
56	1	1	2020-10-16 15:57:59.61358+00	2020-10-16 15:57:59.61358+00
57	1	1	2020-10-16 16:18:50.5868+00	2020-10-16 16:18:50.5868+00
58	1	1	2020-10-16 16:18:50.5868+00	2020-10-16 16:18:50.5868+00
59	1	1	2020-10-16 16:21:45.9074+00	2020-10-16 16:21:45.9074+00
60	1	1	2020-10-16 16:21:45.9074+00	2020-10-16 16:21:45.9074+00
61	1	1	2020-10-19 15:52:38.030248+00	2020-10-19 15:52:38.030248+00
62	1	1	2020-10-19 15:54:10.089169+00	2020-10-19 15:54:10.089169+00
63	1	1	2020-10-19 17:03:16.192635+00	2020-10-19 17:03:16.192635+00
64	1	1	2020-10-19 19:12:00.379055+00	2020-10-19 19:12:00.379055+00
65	1	1	2020-10-19 19:12:00.379055+00	2020-10-19 19:12:00.379055+00
66	1	1	2020-10-19 19:16:33.366464+00	2020-10-19 19:16:33.366464+00
67	1	1	2020-10-19 19:16:33.366464+00	2020-10-19 19:16:33.366464+00
\.


--
-- Data for Name: schedules_and_capacities; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.schedules_and_capacities (id, "concurrencyCap", "timeZoneId", "allTimeSumCap", "monthlySumCap", "dailySumCap", "hourlySumCap", "allTimeCap", "monthlyCap", "dailyCap", "hourlyCap", created_at, updated_at) FROM stdin;
1	3	Eastern Standard Time	-1.00	-1.00	-1.00	-1.00	-1	-1	-1	-1	2020-08-26 19:30:31.559482+00	2020-08-26 19:30:31.559482+00
2	-1	Eastern Standard Time	-1.00	-1.00	-1.00	-1.00	-1	-1	-1	-1	2020-08-26 19:30:31.559482+00	2020-08-26 19:30:31.559482+00
3	-1	Eastern Standard Time	-1.00	-1.00	-1.00	-1.00	-1	-1	250	10	2020-08-26 19:30:31.559482+00	2020-08-26 19:30:31.559482+00
4	20	Eastern Standard Time	-1.00	-1.00	-1.00	-1.00	-1	-1	-1	-1	2020-08-26 19:30:31.559482+00	2020-08-26 19:30:31.559482+00
5	10	Eastern Standard Time	-1.00	-1.00	-1.00	-1.00	-1	-1	-1	-1	2020-08-26 19:30:31.559482+00	2020-08-26 19:30:31.559482+00
6	-1	Eastern Standard Time	-1.00	-1.00	-1.00	-1.00	-1	-1	-1	-1	2020-08-26 19:30:31.559482+00	2020-08-26 19:30:31.559482+00
7	6	Eastern Standard Time	-1.00	-1.00	-1.00	-1.00	-1	-1	110	-1	2020-08-26 19:30:31.559482+00	2020-08-26 19:30:31.559482+00
8	3	Eastern Standard Time	-1.00	-1.00	-1.00	-1.00	-1	-1	-1	-1	2020-08-26 19:30:31.559482+00	2020-08-26 19:30:31.559482+00
9	-1	Eastern Standard Time	-1.00	-1.00	-1.00	-1.00	-1	-1	-1	-1	2020-08-26 19:30:31.559482+00	2020-08-26 19:30:31.559482+00
10	-1	Eastern Standard Time	-1.00	-1.00	-1.00	-1.00	-1	-1	15	-1	2020-08-26 19:30:31.559482+00	2020-08-26 19:30:31.559482+00
11	-1	Eastern Standard Time	-1.00	-1.00	-1.00	-1.00	-1	-1	-1	-1	2020-08-26 19:30:31.559482+00	2020-08-26 19:30:31.559482+00
12	15	Eastern Standard Time	-1.00	-1.00	-1.00	-1.00	-1	-1	-1	-1	2020-08-26 19:30:31.559482+00	2020-08-26 19:30:31.559482+00
13	10	Eastern Standard Time	-1.00	-1.00	-1.00	-1.00	-1	-1	-1	-1	2020-08-26 19:30:31.559482+00	2020-08-26 19:30:31.559482+00
14	3	Eastern Standard Time	-1.00	-1.00	-1.00	-1.00	-1	-1	-1	-1	2020-08-26 19:32:42.718025+00	2020-08-26 19:32:42.718025+00
15	3	Eastern Standard Time	-1.00	-1.00	-1.00	-1.00	-1	-1	-1	-1	2020-10-16 04:25:54.060074+00	2020-10-16 04:25:54.060074+00
\.


--
-- Data for Name: sip_numbers; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.sip_numbers (id, number, username, password, "callInstructionsId", created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: spam_detection_settings; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.spam_detection_settings (id, "blockDuplicatesForSeconds", "trackAnonymous", created_at, updated_at) FROM stdin;
1	0	f	2020-08-26 19:31:44.437886+00	2020-08-26 19:31:44.437886+00
2	0	f	2020-08-26 19:31:44.437886+00	2020-08-26 19:31:44.437886+00
3	2	f	2020-08-26 19:31:44.437886+00	2020-08-26 19:31:44.437886+00
4	0	f	2020-08-26 19:31:44.437886+00	2020-08-26 19:31:44.437886+00
5	0	f	2020-08-26 19:31:44.437886+00	2020-08-26 19:31:44.437886+00
6	0	f	2020-08-26 19:31:44.437886+00	2020-08-26 19:31:44.437886+00
7	2	f	2020-08-26 19:31:44.437886+00	2020-08-26 19:31:44.437886+00
8	0	f	2020-08-26 19:31:44.437886+00	2020-08-26 19:31:44.437886+00
9	0	f	2020-08-26 19:31:44.437886+00	2020-08-26 19:31:44.437886+00
10	0	f	2020-08-26 19:31:44.437886+00	2020-08-26 19:31:44.437886+00
11	0	f	2020-10-16 06:08:53.222086+00	2020-10-16 06:08:53.222086+00
12	0	f	2020-10-16 06:09:54.633988+00	2020-10-16 06:09:54.633988+00
13	0	f	2020-10-16 06:53:26.493705+00	2020-10-16 06:53:26.493705+00
14	0	f	2020-10-16 06:55:14.97667+00	2020-10-16 06:55:14.97667+00
15	0	f	2020-10-16 15:15:44.386013+00	2020-10-16 15:15:44.386013+00
16	0	f	2020-10-16 15:27:14.20716+00	2020-10-16 15:27:14.20716+00
17	0	f	2020-10-16 15:29:09.856116+00	2020-10-16 15:29:09.856116+00
18	0	f	2020-10-16 15:52:18.907661+00	2020-10-16 15:52:18.907661+00
19	0	f	2020-10-16 15:55:45.823614+00	2020-10-16 15:55:45.823614+00
20	0	f	2020-10-16 15:57:59.61358+00	2020-10-16 15:57:59.61358+00
21	0	f	2020-10-16 16:18:50.5868+00	2020-10-16 16:18:50.5868+00
22	0	f	2020-10-16 16:21:45.9074+00	2020-10-16 16:21:45.9074+00
23	0	f	2020-10-19 19:12:00.379055+00	2020-10-19 19:12:00.379055+00
24	0	f	2020-10-19 19:16:33.366464+00	2020-10-19 19:16:33.366464+00
\.


--
-- Data for Name: tag_routing_tables; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.tag_routing_tables (id, created_at, updated_at, "targetCriteriaId") FROM stdin;
2	2020-08-26 19:30:31.570632+00	2020-08-26 19:30:31.570632+00	\N
3	2020-08-26 19:30:31.570632+00	2020-08-26 19:30:31.570632+00	\N
4	2020-08-26 19:30:31.570632+00	2020-08-26 19:30:31.570632+00	\N
5	2020-08-26 19:30:31.570632+00	2020-08-26 19:30:31.570632+00	\N
6	2020-08-26 19:30:31.570632+00	2020-08-26 19:30:31.570632+00	\N
7	2020-08-26 19:30:31.570632+00	2020-08-26 19:30:31.570632+00	\N
8	2020-08-26 19:30:31.570632+00	2020-08-26 19:30:31.570632+00	\N
9	2020-08-26 19:30:31.570632+00	2020-08-26 19:30:31.570632+00	\N
26	2020-10-16 06:19:56.375296+00	2020-10-16 06:19:56.375296+00	9
27	2020-10-16 06:19:56.459022+00	2020-10-16 06:19:56.459022+00	9
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.tags (id, name, value, type, source, "criteriaId", created_at, updated_at) FROM stdin;
1	PlacementId	\N	PlacementInfo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
2	LandingPageId	\N	PlacementInfo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
3	LandingPageVersion	\N	PlacementInfo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
4	NumberPoolId	\N	PlacementInfo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
5	NumberPoolName	\N	PlacementInfo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
6	SearchTerm	\N	PlacementInfo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
7	SearchKeyWord	\N	PlacementInfo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
8	UTCHour	\N	Time	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
9	UTCMinute	\N	Time	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
10	UTCSecond	\N	Time	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
11	UTCWeekDay	\N	Date	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
12	UTCDay	\N	Date	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
13	UTCMonth	\N	Date	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
14	UTCYear	\N	Date	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
15	Name	\N	Publisher	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
16	Company	\N	Publisher	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
17	Id	\N	Publisher	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
18	SubId	\N	Publisher	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
19	ReplacementNumber	\N	Publisher	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
20	Name	\N	Campaign	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
21	Id	\N	Campaign	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
22	TrackingId	\N	Campaign	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
23	Number	\N	InboundNumber	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
24	Number-NoPlus	\N	InboundNumber	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
25	CountryCode	\N	InboundNumber	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
26	CountryDigits	\N	InboundNumber	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
27	AreaCode	\N	InboundNumber	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
28	IsPhoneNumberValid	\N	InboundNumber	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
29	Prefix	\N	InboundNumber	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
30	Suffix	\N	InboundNumber	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
31	Number	\N	DialedNumber	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
32	Name	\N	DialedNumber	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
33	Total	\N	CallLength	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
34	FromConnect	\N	CallLength	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
35	FromDial	\N	CallLength	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
36	Name	\N	Target	Connection	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
37	Id	\N	Target	Connection	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
38	SubId	\N	Target	Connection	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
39	Id	\N	Buyer	Connection	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
40	Name	\N	Buyer	Connection	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
41	SubId	\N	Buyer	Connection	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
42	RecordingUrl	\N	Recording	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
43	Country		Geo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
44	CountryCode		Geo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
45	SubDivision		Geo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
46	SubDivisionCode		Geo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
47	City		Geo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
48	ZipCode		Geo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
49	Latitude		Geo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
50	Longitude		Geo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
51	IsMobile		Technology	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
52	UserAgentString		Technology	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
53	OS		Technology	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
54	OSVersion		Technology	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
55	Browser		Technology	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
56	BrowserVersion		Technology	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
57	IPAddress		Technology	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
58	ISP		ConnectionInfo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
59	OrganizationName		ConnectionInfo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
60	AutonomousName		ConnectionInfo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
61	AutonomousSystemNumber		ConnectionInfo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
62	ReferrerPage		RequestInfo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
63	LandingPageUrl		RequestInfo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
64	Width		ScreenInfo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
65	Height		ScreenInfo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
66	PixelDensity		ScreenInfo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
67	ColorDepth		ScreenInfo	JSTag	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
68	Region	\N	InboundNumber	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
69	State	\N	InboundNumber	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
70	Province	\N	InboundNumber	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
71	ProvinceCode	\N	InboundNumber	Call	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
72	Sale		Target	User	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
73	First Name		firstname	User	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
74	Last Name		lastname	User	\N	2020-08-26 19:28:43.35119+00	2020-08-26 19:28:43.35119+00
\.


--
-- Data for Name: target_criterias; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.target_criterias (id, "targetId", created_at, updated_at) FROM stdin;
1	2	2020-08-26 19:30:31.643612+00	2020-08-26 19:30:31.643612+00
2	3	2020-08-26 19:30:31.643612+00	2020-08-26 19:30:31.643612+00
3	5	2020-08-26 19:30:31.643612+00	2020-08-26 19:30:31.643612+00
4	7	2020-08-26 19:30:31.643612+00	2020-08-26 19:30:31.643612+00
5	8	2020-08-26 19:30:31.643612+00	2020-08-26 19:30:31.643612+00
6	10	2020-08-26 19:30:31.643612+00	2020-08-26 19:30:31.643612+00
7	12	2020-08-26 19:30:31.643612+00	2020-08-26 19:30:31.643612+00
8	13	2020-08-26 19:30:31.643612+00	2020-08-26 19:30:31.643612+00
9	15	2020-10-16 04:25:54.060074+00	2020-10-16 04:25:54.060074+00
\.


--
-- Data for Name: targets; Type: TABLE DATA; Schema: contactcenter; Owner: postgres
--

COPY contactcenter.targets (id, "targetGroupId", "callInstructionsId", "isHighRateTarget", "subId", "targetCallIncrement", "ownerId", "conversionTimerOffset", "scheduleId", name, "accountId", enabled, created_at, updated_at, "workerSid", activity_sid) FROM stdin;
1	TAa2502cb397f64b06b92da83f4dc5e287	1	f	MGLFB-Ad-LiveCalls	onConvert	521002f2-c96a-41f1-9c00-576977ce9ec7	0	1	Mgl Fb Live Transfers	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:30:31.589414+00	2020-08-26 19:30:31.589414+00	\N	\N
2	\N	2	f	A111102	onConvert	01a92a9f-8e24-4d9d-8b24-b15b16faedc2	0	2	GoHealth Premium Line	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:30:31.589414+00	2020-08-26 19:30:31.589414+00	\N	\N
3		3	f	A111101	onConvert	01a92a9f-8e24-4d9d-8b24-b15b16faedc2	0	3	GoHealth	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:30:31.589414+00	2020-08-26 19:30:31.589414+00	\N	\N
4	\N	4	f	Indiana 04/2020	onConvert	521002f2-c96a-41f1-9c00-576977ce9ec7	0	4	MGL Mailer	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:30:31.589414+00	2020-08-26 19:30:31.589414+00	\N	\N
5	\N	5	f	D120001	onConvert	11e773a5-9a22-48ac-8d45-ac4131983baf	0	5	CoverageOne-MAPD	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:30:31.589414+00	2020-08-26 19:30:31.589414+00	\N	\N
6	\N	6	f	MHAMAIL	onConvert	\N	0	6	MHA Mailers	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	f	2020-08-26 19:30:31.589414+00	2020-08-26 19:30:31.589414+00	\N	\N
7	\N	7	f	A31001	onConvert	a4a6fad4-7c41-4932-9261-b8e6acfdb71c	0	7	Healthworks	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:30:31.589414+00	2020-08-26 19:30:31.589414+00	\N	\N
8	\N	8	f	D120002	onConvert	11e773a5-9a22-48ac-8d45-ac4131983baf	0	8	CoverageOne-Mailer	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:30:31.589414+00	2020-08-26 19:30:31.589414+00	\N	\N
9	TAa2502cb397f64b06b92da83f4dc5e287	9	f	ANS101	onConvert	\N	0	9	AnswerForce	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:30:31.589414+00	2020-08-26 19:30:31.589414+00	\N	\N
10	\N	10	f	SVG	onConvert	e8fe77e0-5042-43bf-a8b5-e51541f46203	0	10	Spring	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:30:31.589414+00	2020-08-26 19:30:31.589414+00	\N	\N
11	\N	11	f	A111103	onConvert	01a92a9f-8e24-4d9d-8b24-b15b16faedc2	0	11	GoHealth Mail Line	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:30:31.589414+00	2020-08-26 19:30:31.589414+00	\N	\N
12		12	f	A131101	onConvert	a38f0f4d-cd7e-4426-8207-50aeb57a0f8e	0	12	MedigapLife	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:30:31.589414+00	2020-08-26 19:30:31.589414+00	\N	\N
13		13	f	A131101	onConvert	a38f0f4d-cd7e-4426-8207-50aeb57a0f8e	0	13	MedigapLife - 800IVR	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	f	2020-08-26 19:30:31.589414+00	2020-08-26 19:30:31.589414+00	\N	\N
14	TAa2502cb397f64b06b92da83f4dc5e287	14	f	MGL-Dev	onConvert	521002f2-c96a-41f1-9c00-576977ce9ec7	0	14	Mgl Developers	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-08-26 19:32:42.729102+00	2020-08-26 19:32:42.729102+00	\N	\N
15		15	f	MGL-Dev	onConvert	521002f2-c96a-41f1-9c00-576977ce9ec7	0	15	deltateset-test	e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0	t	2020-10-16 04:25:54.060074+00	2020-10-16 04:25:54.060074+00	WK02a2fa35d93e824a89fa1d859dd8c927	\N
\.


--
-- Data for Name: event_invocation_logs; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.event_invocation_logs (id, event_id, status, request, response, created_at) FROM stdin;
\.


--
-- Data for Name: event_log; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.event_log (id, schema_name, table_name, trigger_name, payload, delivered, error, tries, created_at, locked, next_retry_at, archived) FROM stdin;
\.


--
-- Data for Name: event_triggers; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.event_triggers (name, type, schema_name, table_name, configuration, comment) FROM stdin;
\.


--
-- Data for Name: hdb_action; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_action (action_name, action_defn, comment, is_system_defined) FROM stdin;
addNumbers	{"type": "query", "handler": "http://actions:9000/actions", "headers": [], "arguments": [{"name": "numbers", "type": "[Int]", "description": null}], "output_type": "AddResult", "forward_client_headers": false}	\N	f
hello	{"type": "query", "handler": "http://actions:9000/actions", "headers": [], "arguments": [{"name": "hello", "type": "String!", "description": null}], "output_type": "HelloOutput", "forward_client_headers": false}	\N	f
\.


--
-- Data for Name: hdb_action_log; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_action_log (id, action_name, input_payload, request_headers, session_variables, response_payload, errors, created_at, response_received_at, status) FROM stdin;
\.


--
-- Data for Name: hdb_action_permission; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_action_permission (action_name, role_name, definition, comment) FROM stdin;
\.


--
-- Data for Name: hdb_allowlist; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_allowlist (collection_name) FROM stdin;
\.


--
-- Data for Name: hdb_computed_field; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_computed_field (table_schema, table_name, computed_field_name, definition, comment) FROM stdin;
\.


--
-- Data for Name: hdb_cron_event_invocation_logs; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_cron_event_invocation_logs (id, event_id, status, request, response, created_at) FROM stdin;
\.


--
-- Data for Name: hdb_cron_events; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_cron_events (id, trigger_name, scheduled_time, status, tries, created_at, next_retry_at) FROM stdin;
\.


--
-- Data for Name: hdb_cron_triggers; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_cron_triggers (name, webhook_conf, cron_schedule, payload, retry_conf, header_conf, include_in_metadata, comment) FROM stdin;
\.


--
-- Data for Name: hdb_custom_types; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_custom_types (custom_types) FROM stdin;
{"enums": [], "objects": [{"name": "AddResult", "fields": [{"name": "sum", "type": "Int", "arguments": null, "description": null}], "description": null, "relationships": null}, {"name": "HelloOutput", "fields": [{"name": "hello", "type": "String!", "arguments": null, "description": null}], "description": null, "relationships": null}], "scalars": [], "input_objects": []}
\.


--
-- Data for Name: hdb_function; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_function (function_schema, function_name, configuration, is_system_defined) FROM stdin;
\.


--
-- Data for Name: hdb_permission; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_permission (table_schema, table_name, role_name, perm_type, perm_def, comment, is_system_defined) FROM stdin;
\.


--
-- Data for Name: hdb_query_collection; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_query_collection (collection_name, collection_defn, comment, is_system_defined) FROM stdin;
\.


--
-- Data for Name: hdb_relationship; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_relationship (table_schema, table_name, rel_name, rel_type, rel_def, comment, is_system_defined) FROM stdin;
hdb_catalog	hdb_table	detail	object	{"manual_configuration": {"remote_table": {"name": "tables", "schema": "information_schema"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	primary_key	object	{"manual_configuration": {"remote_table": {"name": "hdb_primary_key", "schema": "hdb_catalog"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	columns	array	{"manual_configuration": {"remote_table": {"name": "columns", "schema": "information_schema"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	foreign_key_constraints	array	{"manual_configuration": {"remote_table": {"name": "hdb_foreign_key_constraint", "schema": "hdb_catalog"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	relationships	array	{"manual_configuration": {"remote_table": {"name": "hdb_relationship", "schema": "hdb_catalog"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	permissions	array	{"manual_configuration": {"remote_table": {"name": "hdb_permission_agg", "schema": "hdb_catalog"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	computed_fields	array	{"manual_configuration": {"remote_table": {"name": "hdb_computed_field", "schema": "hdb_catalog"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	check_constraints	array	{"manual_configuration": {"remote_table": {"name": "hdb_check_constraint", "schema": "hdb_catalog"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	unique_constraints	array	{"manual_configuration": {"remote_table": {"name": "hdb_unique_constraint", "schema": "hdb_catalog"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	event_triggers	events	array	{"manual_configuration": {"remote_table": {"name": "event_log", "schema": "hdb_catalog"}, "column_mapping": {"name": "trigger_name"}}}	\N	t
hdb_catalog	event_log	trigger	object	{"manual_configuration": {"remote_table": {"name": "event_triggers", "schema": "hdb_catalog"}, "column_mapping": {"trigger_name": "name"}}}	\N	t
hdb_catalog	event_log	logs	array	{"foreign_key_constraint_on": {"table": {"name": "event_invocation_logs", "schema": "hdb_catalog"}, "column": "event_id"}}	\N	t
hdb_catalog	event_invocation_logs	event	object	{"foreign_key_constraint_on": "event_id"}	\N	t
hdb_catalog	hdb_function_agg	return_table_info	object	{"manual_configuration": {"remote_table": {"name": "hdb_table", "schema": "hdb_catalog"}, "column_mapping": {"return_type_name": "table_name", "return_type_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_action	permissions	array	{"manual_configuration": {"remote_table": {"name": "hdb_action_permission", "schema": "hdb_catalog"}, "column_mapping": {"action_name": "action_name"}}}	\N	t
hdb_catalog	hdb_role	action_permissions	array	{"manual_configuration": {"remote_table": {"name": "hdb_action_permission", "schema": "hdb_catalog"}, "column_mapping": {"role_name": "role_name"}}}	\N	t
hdb_catalog	hdb_role	permissions	array	{"manual_configuration": {"remote_table": {"name": "hdb_permission_agg", "schema": "hdb_catalog"}, "column_mapping": {"role_name": "role_name"}}}	\N	t
hdb_catalog	hdb_cron_triggers	cron_events	array	{"foreign_key_constraint_on": {"table": {"name": "hdb_cron_events", "schema": "hdb_catalog"}, "column": "trigger_name"}}	\N	t
hdb_catalog	hdb_cron_events	cron_trigger	object	{"foreign_key_constraint_on": "trigger_name"}	\N	t
hdb_catalog	hdb_cron_events	cron_event_logs	array	{"foreign_key_constraint_on": {"table": {"name": "hdb_cron_event_invocation_logs", "schema": "hdb_catalog"}, "column": "event_id"}}	\N	t
hdb_catalog	hdb_cron_event_invocation_logs	cron_event	object	{"foreign_key_constraint_on": "event_id"}	\N	t
hdb_catalog	hdb_scheduled_events	scheduled_event_logs	array	{"foreign_key_constraint_on": {"table": {"name": "hdb_scheduled_event_invocation_logs", "schema": "hdb_catalog"}, "column": "event_id"}}	\N	t
hdb_catalog	hdb_scheduled_event_invocation_logs	scheduled_event	object	{"foreign_key_constraint_on": "event_id"}	\N	t
contactcenter	affiliates	campaigns	array	{"foreign_key_constraint_on": {"table": {"name": "campaign_affiliates", "schema": "contactcenter"}, "column": "affiliateId"}}	\N	f
contactcenter	call_conversion_settings	deDupeSetting	object	{"foreign_key_constraint_on": "deDupeSettingId"}	\N	f
contactcenter	call_instructions	sip	array	{"foreign_key_constraint_on": {"table": {"name": "sip_numbers", "schema": "contactcenter"}, "column": "callInstructionsId"}}	\N	f
contactcenter	call_routes	callTarget	object	{"foreign_key_constraint_on": "callTargetId"}	\N	f
contactcenter	call_routes	priority	object	{"foreign_key_constraint_on": "priorityId"}	\N	f
contactcenter	call_routes	campaigns	array	{"foreign_key_constraint_on": {"table": {"name": "campaign_call_routes", "schema": "contactcenter"}, "column": "callRouteId"}}	\N	f
contactcenter	call_routes	conversionSettings	array	{"foreign_key_constraint_on": {"table": {"name": "call_conversion_settings", "schema": "contactcenter"}, "column": "callRouteId"}}	\N	f
contactcenter	campaign_affiliates	affiliate	object	{"foreign_key_constraint_on": "affiliateId"}	\N	f
contactcenter	campaign_affiliates	campaign	object	{"foreign_key_constraint_on": "campaignId"}	\N	f
contactcenter	campaign_call_routes	campaign	object	{"foreign_key_constraint_on": "campaignId"}	\N	f
contactcenter	campaign_call_routes	route	object	{"foreign_key_constraint_on": "callRouteId"}	\N	f
contactcenter	campaigns	deDupeSettings	object	{"foreign_key_constraint_on": "deDupeSettingsId"}	\N	f
contactcenter	campaigns	defaultNumber	object	{"foreign_key_constraint_on": "defaultNumberId"}	\N	f
contactcenter	campaigns	defaultTarget	object	{"foreign_key_constraint_on": "defaultTargetId"}	\N	f
contactcenter	campaigns	dialSettings	object	{"foreign_key_constraint_on": "dialSettingsId"}	\N	f
contactcenter	campaigns	duplicateSettings	object	{"foreign_key_constraint_on": "duplicateSettingsId"}	\N	f
contactcenter	campaigns	recordSetting	object	{"foreign_key_constraint_on": "recordSettingId"}	\N	f
contactcenter	campaigns	spamDetection	object	{"foreign_key_constraint_on": "spamDetectionSettingsId"}	\N	f
contactcenter	campaigns	affiliateNumbers	array	{"foreign_key_constraint_on": {"table": {"name": "numbers", "schema": "contactcenter"}, "column": "campaignId"}}	\N	f
contactcenter	campaigns	affiliates	array	{"foreign_key_constraint_on": {"table": {"name": "campaign_affiliates", "schema": "contactcenter"}, "column": "campaignId"}}	\N	f
contactcenter	campaigns	routes	array	{"foreign_key_constraint_on": {"table": {"name": "campaign_call_routes", "schema": "contactcenter"}, "column": "campaignId"}}	\N	f
contactcenter	numbers	affiliate	object	{"foreign_key_constraint_on": "affiliateId"}	\N	f
contactcenter	numbers	assignmentSettings	object	{"foreign_key_constraint_on": "assignmentSettingsId"}	\N	f
contactcenter	office_breaks	startTime	object	{"foreign_key_constraint_on": "startTimeId"}	\N	f
contactcenter	open_settings	closeTime	object	{"foreign_key_constraint_on": "closeTimeId"}	\N	f
contactcenter	open_settings	openTime	object	{"foreign_key_constraint_on": "openTimeId"}	\N	f
contactcenter	open_settings	breaks	array	{"foreign_key_constraint_on": {"table": {"name": "office_breaks", "schema": "contactcenter"}, "column": "openSettingsId"}}	\N	f
contactcenter	schedules_and_capacities	hoursOfOperation	array	{"foreign_key_constraint_on": {"table": {"name": "open_settings", "schema": "contactcenter"}, "column": "scheduleId"}}	\N	f
contactcenter	tag_routing_tables	criterias	array	{"foreign_key_constraint_on": {"table": {"name": "criterias", "schema": "contactcenter"}, "column": "tagRoutableRuleId"}}	\N	f
contactcenter	tag_routing_tables	tagCriteria	array	{"manual_configuration": {"remote_table": {"name": "criterias", "schema": "contactcenter"}, "column_mapping": {"id": "tagRoutableRuleId"}}}	\N	f
contactcenter	target_criterias	target	object	{"foreign_key_constraint_on": "targetId"}	\N	f
contactcenter	target_criterias	tagRoutableRule	array	{"manual_configuration": {"remote_table": {"name": "tag_routing_tables", "schema": "contactcenter"}, "column_mapping": {"id": "targetCriteriaId"}}}	\N	f
contactcenter	targets	account	object	{"foreign_key_constraint_on": "accountId"}	\N	f
contactcenter	targets	instructions	object	{"foreign_key_constraint_on": "callInstructionsId"}	\N	f
contactcenter	targets	owner	object	{"foreign_key_constraint_on": "ownerId"}	\N	f
contactcenter	targets	schedule	object	{"foreign_key_constraint_on": "scheduleId"}	\N	f
contactcenter	targets	call_routes	array	{"foreign_key_constraint_on": {"table": {"name": "call_routes", "schema": "contactcenter"}, "column": "callTargetId"}}	\N	f
contactcenter	targets	campaigns	array	{"foreign_key_constraint_on": {"table": {"name": "campaigns", "schema": "contactcenter"}, "column": "defaultTargetId"}}	\N	f
contactcenter	targets	criteria	array	{"foreign_key_constraint_on": {"table": {"name": "target_criterias", "schema": "contactcenter"}, "column": "targetId"}}	\N	f
\.


--
-- Data for Name: hdb_remote_relationship; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_remote_relationship (remote_relationship_name, table_schema, table_name, definition) FROM stdin;
\.


--
-- Data for Name: hdb_scheduled_event_invocation_logs; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_scheduled_event_invocation_logs (id, event_id, status, request, response, created_at) FROM stdin;
\.


--
-- Data for Name: hdb_scheduled_events; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_scheduled_events (id, webhook_conf, scheduled_time, retry_conf, payload, header_conf, status, tries, created_at, next_retry_at, comment) FROM stdin;
\.


--
-- Data for Name: hdb_schema_update_event; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_schema_update_event (instance_id, occurred_at, invalidations) FROM stdin;
e9c1460e-ee13-4072-8a74-480ed82f6f70	2020-10-21 14:20:33.486013+00	{"metadata":false,"remote_schemas":[]}
\.


--
-- Data for Name: hdb_table; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_table (table_schema, table_name, configuration, is_system_defined, is_enum) FROM stdin;
information_schema	tables	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
information_schema	schemata	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
information_schema	views	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
information_schema	columns	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_table	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_primary_key	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_foreign_key_constraint	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_relationship	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_permission_agg	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_computed_field	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_check_constraint	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_unique_constraint	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_remote_relationship	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	event_triggers	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	event_log	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	event_invocation_logs	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_function	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_function_agg	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	remote_schemas	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_version	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_query_collection	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_allowlist	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_custom_types	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_action_permission	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_action	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_action_log	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_role	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_cron_triggers	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_cron_events	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_cron_event_invocation_logs	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_scheduled_events	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_scheduled_event_invocation_logs	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
contactcenter	accounts	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	affiliates	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	app_configuration	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	buyers	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	call_conversion_settings	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	call_instructions	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	call_routes	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	campaign_affiliates	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	campaign_call_routes	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	campaigns	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	comparisons_type	{"custom_root_fields": {}, "custom_column_names": {}}	f	t
contactcenter	criterias	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	dial_settings	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	distributions_type	{"custom_root_fields": {}, "custom_column_names": {}}	f	t
contactcenter	duplicate_call_settings	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	duplicate_setting_type	{"custom_root_fields": {}, "custom_column_names": {}}	f	t
contactcenter	duplicate_settings	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	integration_conversion_sets	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	integration_settings	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	integrations	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	iso_weekdays_type	{"custom_root_fields": {}, "custom_column_names": {}}	f	t
contactcenter	knex_migrations	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	knex_migrations_lock	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	mark_as_duplicate_settings	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	missed_calls	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	number_assignment_settings	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	number_tags	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	numbers	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	office_breaks	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	open_settings	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	operation_times	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	record_call_settings	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	routing_priorities	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	schedules_and_capacities	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	sip_numbers	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	spam_detection_settings	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	tag_routing_tables	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	tags	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	target_criterias	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	targets	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
contactcenter	call_logs	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
\.


--
-- Data for Name: hdb_version; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_version (hasura_uuid, version, upgraded_on, cli_state, console_state) FROM stdin;
244063f9-9360-4269-8015-04eff4fdf72a	37	2020-10-16 04:22:13.685592+00	{}	{"telemetryNotificationShown": true}
\.


--
-- Data for Name: migration_settings; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.migration_settings (setting, value) FROM stdin;
migration_mode	true
\.


--
-- Data for Name: remote_schemas; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.remote_schemas (id, name, definition, comment) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.schema_migrations (version, dirty) FROM stdin;
1598548548256	f
1598554917065	f
1598564709979	f
1600534650490	f
1600534788241	f
1600535928027	f
1600535981450	f
1600536019053	f
1600536085772	f
1600536113442	f
1601251429119	f
1601259807940	f
1601317659482	f
1601317782483	f
1602268675202	f
1602268877564	f
1602270011838	f
1602270167735	f
1602270221164	f
1602531947110	f
1602532815469	f
1602604462849	f
1602604481518	f
1602779891766	f
1602779911091	f
1602779926326	f
1602835222865	f
1602835274912	f
1602835918782	f
1602835961580	f
1602836324349	f
1602836360133	f
1602836393875	f
1602836402573	f
1602836433164	f
1602836441431	f
1602836458091	f
1602836469932	f
1602836476381	f
1602836480037	f
1602836483103	f
1602836486621	f
1602836492371	f
1602836504419	f
1602836509339	f
1602836514276	f
1602836521326	f
1602836522211	f
1602836526424	f
1602836530371	f
1602836533340	f
1602836537995	f
1602836545108	f
1602836571957	f
1602836579988	f
1602836593204	f
1602836604156	f
1602836608404	f
1602836613667	f
1602836618107	f
1602836624403	f
1602836634244	f
1602836642699	f
1602836650500	f
1602836656923	f
1602836662355	f
1602836667116	f
1602836674740	f
1602836678356	f
1602836682156	f
1602836685588	f
1602836692578	f
1602836697595	f
1602836701859	f
1602836705821	f
1602836709931	f
1602836713972	f
1602836718812	f
1602836722924	f
1602836753813	f
1602867741503	f
\.


--
-- Name: app_configuration_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.app_configuration_id_seq', 3, true);


--
-- Name: call_conversion_settings_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.call_conversion_settings_id_seq', 67, true);


--
-- Name: call_instructions_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.call_instructions_id_seq', 15, true);


--
-- Name: call_logs_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.call_logs_id_seq', 25, true);


--
-- Name: call_routes_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.call_routes_id_seq', 67, true);


--
-- Name: campaign_affiliates_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.campaign_affiliates_id_seq', 27, true);


--
-- Name: campaign_call_routes_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.campaign_call_routes_id_seq', 67, true);


--
-- Name: campaigns_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.campaigns_id_seq', 27, true);


--
-- Name: criterias_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.criterias_id_seq', 180, true);


--
-- Name: dial_settings_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.dial_settings_id_seq', 27, true);


--
-- Name: duplicate_call_settings_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.duplicate_call_settings_id_seq', 27, true);


--
-- Name: duplicate_settings_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.duplicate_settings_id_seq', 67, true);


--
-- Name: integration_conversion_sets_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.integration_conversion_sets_id_seq', 1, false);


--
-- Name: integration_settings_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.integration_settings_id_seq', 1, false);


--
-- Name: integrations_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.integrations_id_seq', 1, false);


--
-- Name: knex_migrations_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.knex_migrations_id_seq', 55, true);


--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.knex_migrations_lock_index_seq', 1, true);


--
-- Name: mark_as_duplicate_settings_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.mark_as_duplicate_settings_id_seq', 29, true);


--
-- Name: missed_calls_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.missed_calls_id_seq', 1, false);


--
-- Name: number_assignment_settings_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.number_assignment_settings_id_seq', 27, true);


--
-- Name: number_tags_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.number_tags_id_seq', 1, false);


--
-- Name: numbers_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.numbers_id_seq', 27, true);


--
-- Name: office_breaks_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.office_breaks_id_seq', 1, false);


--
-- Name: open_settings_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.open_settings_id_seq', 154, true);


--
-- Name: operation_times_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.operation_times_id_seq', 308, true);


--
-- Name: record_call_settings_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.record_call_settings_id_seq', 27, true);


--
-- Name: routing_priorities_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.routing_priorities_id_seq', 67, true);


--
-- Name: schedules_and_capacities_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.schedules_and_capacities_id_seq', 15, true);


--
-- Name: sip_numbers_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.sip_numbers_id_seq', 1, false);


--
-- Name: spam_detection_settings_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.spam_detection_settings_id_seq', 24, true);


--
-- Name: tag_routing_tables_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.tag_routing_tables_id_seq', 27, true);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.tags_id_seq', 74, true);


--
-- Name: target_criterias_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.target_criterias_id_seq', 9, true);


--
-- Name: targets_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: postgres
--

SELECT pg_catalog.setval('contactcenter.targets_id_seq', 15, true);


--
-- Name: remote_schemas_id_seq; Type: SEQUENCE SET; Schema: hdb_catalog; Owner: postgres
--

SELECT pg_catalog.setval('hdb_catalog.remote_schemas_id_seq', 1, false);


--
-- Name: accounts accounts_email_unique; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.accounts
    ADD CONSTRAINT accounts_email_unique UNIQUE (email);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: affiliates affiliates_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.affiliates
    ADD CONSTRAINT affiliates_pkey PRIMARY KEY (id);


--
-- Name: app_configuration app_configuration_name_unique; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.app_configuration
    ADD CONSTRAINT app_configuration_name_unique UNIQUE (name);


--
-- Name: app_configuration app_configuration_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.app_configuration
    ADD CONSTRAINT app_configuration_pkey PRIMARY KEY (id);


--
-- Name: buyers buyers_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.buyers
    ADD CONSTRAINT buyers_pkey PRIMARY KEY (id);


--
-- Name: call_conversion_settings call_conversion_settings_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.call_conversion_settings
    ADD CONSTRAINT call_conversion_settings_pkey PRIMARY KEY (id);


--
-- Name: call_instructions call_instructions_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.call_instructions
    ADD CONSTRAINT call_instructions_pkey PRIMARY KEY (id);


--
-- Name: call_logs call_logs_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.call_logs
    ADD CONSTRAINT call_logs_pkey PRIMARY KEY (id);


--
-- Name: call_routes call_routes_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.call_routes
    ADD CONSTRAINT call_routes_pkey PRIMARY KEY (id);


--
-- Name: campaign_affiliates campaign_affiliates_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.campaign_affiliates
    ADD CONSTRAINT campaign_affiliates_pkey PRIMARY KEY (id);


--
-- Name: campaign_call_routes campaign_call_routes_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.campaign_call_routes
    ADD CONSTRAINT campaign_call_routes_pkey PRIMARY KEY (id);


--
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);


--
-- Name: comparisons_type comparisons_type_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.comparisons_type
    ADD CONSTRAINT comparisons_type_pkey PRIMARY KEY (value);


--
-- Name: criterias criterias_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.criterias
    ADD CONSTRAINT criterias_pkey PRIMARY KEY (id);


--
-- Name: dial_settings dial_settings_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.dial_settings
    ADD CONSTRAINT dial_settings_pkey PRIMARY KEY (id);


--
-- Name: distributions_type distributions_type_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.distributions_type
    ADD CONSTRAINT distributions_type_pkey PRIMARY KEY (value);


--
-- Name: duplicate_call_settings duplicate_call_settings_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.duplicate_call_settings
    ADD CONSTRAINT duplicate_call_settings_pkey PRIMARY KEY (id);


--
-- Name: duplicate_setting_type duplicate_setting_type_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.duplicate_setting_type
    ADD CONSTRAINT duplicate_setting_type_pkey PRIMARY KEY (value);


--
-- Name: duplicate_settings duplicate_settings_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.duplicate_settings
    ADD CONSTRAINT duplicate_settings_pkey PRIMARY KEY (id);


--
-- Name: integration_conversion_sets integration_conversion_sets_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.integration_conversion_sets
    ADD CONSTRAINT integration_conversion_sets_pkey PRIMARY KEY (id);


--
-- Name: integration_settings integration_settings_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.integration_settings
    ADD CONSTRAINT integration_settings_pkey PRIMARY KEY (id);


--
-- Name: integrations integrations_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.integrations
    ADD CONSTRAINT integrations_pkey PRIMARY KEY (id);


--
-- Name: iso_weekdays_type iso_weekdays_type_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.iso_weekdays_type
    ADD CONSTRAINT iso_weekdays_type_pkey PRIMARY KEY (value);


--
-- Name: knex_migrations_lock knex_migrations_lock_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.knex_migrations_lock
    ADD CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index);


--
-- Name: knex_migrations knex_migrations_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.knex_migrations
    ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);


--
-- Name: mark_as_duplicate_settings mark_as_duplicate_settings_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.mark_as_duplicate_settings
    ADD CONSTRAINT mark_as_duplicate_settings_pkey PRIMARY KEY (id);


--
-- Name: missed_calls missed_calls_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.missed_calls
    ADD CONSTRAINT missed_calls_pkey PRIMARY KEY (id);


--
-- Name: number_assignment_settings number_assignment_settings_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.number_assignment_settings
    ADD CONSTRAINT number_assignment_settings_pkey PRIMARY KEY (id);


--
-- Name: number_tags number_tags_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.number_tags
    ADD CONSTRAINT number_tags_pkey PRIMARY KEY (id);


--
-- Name: numbers numbers_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.numbers
    ADD CONSTRAINT numbers_pkey PRIMARY KEY (id);


--
-- Name: office_breaks office_breaks_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.office_breaks
    ADD CONSTRAINT office_breaks_pkey PRIMARY KEY (id);


--
-- Name: open_settings open_settings_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.open_settings
    ADD CONSTRAINT open_settings_pkey PRIMARY KEY (id);


--
-- Name: operation_times operation_times_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.operation_times
    ADD CONSTRAINT operation_times_pkey PRIMARY KEY (id);


--
-- Name: record_call_settings record_call_settings_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.record_call_settings
    ADD CONSTRAINT record_call_settings_pkey PRIMARY KEY (id);


--
-- Name: routing_priorities routing_priorities_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.routing_priorities
    ADD CONSTRAINT routing_priorities_pkey PRIMARY KEY (id);


--
-- Name: schedules_and_capacities schedules_and_capacities_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.schedules_and_capacities
    ADD CONSTRAINT schedules_and_capacities_pkey PRIMARY KEY (id);


--
-- Name: sip_numbers sip_numbers_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.sip_numbers
    ADD CONSTRAINT sip_numbers_pkey PRIMARY KEY (id);


--
-- Name: spam_detection_settings spam_detection_settings_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.spam_detection_settings
    ADD CONSTRAINT spam_detection_settings_pkey PRIMARY KEY (id);


--
-- Name: tag_routing_tables tag_routing_tables_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.tag_routing_tables
    ADD CONSTRAINT tag_routing_tables_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: target_criterias target_criterias_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.target_criterias
    ADD CONSTRAINT target_criterias_pkey PRIMARY KEY (id);


--
-- Name: targets targets_pkey; Type: CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.targets
    ADD CONSTRAINT targets_pkey PRIMARY KEY (id);


--
-- Name: event_invocation_logs event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_invocation_logs
    ADD CONSTRAINT event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: event_log event_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_log
    ADD CONSTRAINT event_log_pkey PRIMARY KEY (id);


--
-- Name: event_triggers event_triggers_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_triggers
    ADD CONSTRAINT event_triggers_pkey PRIMARY KEY (name);


--
-- Name: hdb_action_log hdb_action_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_action_log
    ADD CONSTRAINT hdb_action_log_pkey PRIMARY KEY (id);


--
-- Name: hdb_action_permission hdb_action_permission_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_action_permission
    ADD CONSTRAINT hdb_action_permission_pkey PRIMARY KEY (action_name, role_name);


--
-- Name: hdb_action hdb_action_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_action
    ADD CONSTRAINT hdb_action_pkey PRIMARY KEY (action_name);


--
-- Name: hdb_allowlist hdb_allowlist_collection_name_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_allowlist
    ADD CONSTRAINT hdb_allowlist_collection_name_key UNIQUE (collection_name);


--
-- Name: hdb_computed_field hdb_computed_field_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_computed_field
    ADD CONSTRAINT hdb_computed_field_pkey PRIMARY KEY (table_schema, table_name, computed_field_name);


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_events hdb_cron_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_events
    ADD CONSTRAINT hdb_cron_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_triggers hdb_cron_triggers_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_triggers
    ADD CONSTRAINT hdb_cron_triggers_pkey PRIMARY KEY (name);


--
-- Name: hdb_function hdb_function_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_function
    ADD CONSTRAINT hdb_function_pkey PRIMARY KEY (function_schema, function_name);


--
-- Name: hdb_permission hdb_permission_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_permission
    ADD CONSTRAINT hdb_permission_pkey PRIMARY KEY (table_schema, table_name, role_name, perm_type);


--
-- Name: hdb_query_collection hdb_query_collection_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_query_collection
    ADD CONSTRAINT hdb_query_collection_pkey PRIMARY KEY (collection_name);


--
-- Name: hdb_relationship hdb_relationship_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_relationship
    ADD CONSTRAINT hdb_relationship_pkey PRIMARY KEY (table_schema, table_name, rel_name);


--
-- Name: hdb_remote_relationship hdb_remote_relationship_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_remote_relationship
    ADD CONSTRAINT hdb_remote_relationship_pkey PRIMARY KEY (remote_relationship_name, table_schema, table_name);


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_scheduled_events hdb_scheduled_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_events
    ADD CONSTRAINT hdb_scheduled_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_table hdb_table_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_table
    ADD CONSTRAINT hdb_table_pkey PRIMARY KEY (table_schema, table_name);


--
-- Name: hdb_version hdb_version_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_version
    ADD CONSTRAINT hdb_version_pkey PRIMARY KEY (hasura_uuid);


--
-- Name: migration_settings migration_settings_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.migration_settings
    ADD CONSTRAINT migration_settings_pkey PRIMARY KEY (setting);


--
-- Name: remote_schemas remote_schemas_name_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.remote_schemas
    ADD CONSTRAINT remote_schemas_name_key UNIQUE (name);


--
-- Name: remote_schemas remote_schemas_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.remote_schemas
    ADD CONSTRAINT remote_schemas_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: event_invocation_logs_event_id_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_invocation_logs_event_id_idx ON hdb_catalog.event_invocation_logs USING btree (event_id);


--
-- Name: event_log_created_at_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_log_created_at_idx ON hdb_catalog.event_log USING btree (created_at);


--
-- Name: event_log_delivered_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_log_delivered_idx ON hdb_catalog.event_log USING btree (delivered);


--
-- Name: event_log_locked_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_log_locked_idx ON hdb_catalog.event_log USING btree (locked);


--
-- Name: event_log_trigger_name_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_log_trigger_name_idx ON hdb_catalog.event_log USING btree (trigger_name);


--
-- Name: hdb_cron_event_status; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX hdb_cron_event_status ON hdb_catalog.hdb_cron_events USING btree (status);


--
-- Name: hdb_scheduled_event_status; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX hdb_scheduled_event_status ON hdb_catalog.hdb_scheduled_events USING btree (status);


--
-- Name: hdb_schema_update_event_one_row; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE UNIQUE INDEX hdb_schema_update_event_one_row ON hdb_catalog.hdb_schema_update_event USING btree (((occurred_at IS NOT NULL)));


--
-- Name: hdb_version_one_row; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE UNIQUE INDEX hdb_version_one_row ON hdb_catalog.hdb_version USING btree (((version IS NOT NULL)));


--
-- Name: hdb_schema_update_event hdb_schema_update_event_notifier; Type: TRIGGER; Schema: hdb_catalog; Owner: postgres
--

CREATE TRIGGER hdb_schema_update_event_notifier AFTER INSERT OR UPDATE ON hdb_catalog.hdb_schema_update_event FOR EACH ROW EXECUTE FUNCTION hdb_catalog.hdb_schema_update_event_notifier();


--
-- Name: affiliates affiliates_accountid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.affiliates
    ADD CONSTRAINT affiliates_accountid_foreign FOREIGN KEY ("accountId") REFERENCES contactcenter.accounts(id) ON DELETE CASCADE;


--
-- Name: buyers buyers_accountid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.buyers
    ADD CONSTRAINT buyers_accountid_foreign FOREIGN KEY ("accountId") REFERENCES contactcenter.accounts(id) ON DELETE CASCADE;


--
-- Name: call_conversion_settings call_conversion_settings_callrouteid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.call_conversion_settings
    ADD CONSTRAINT call_conversion_settings_callrouteid_foreign FOREIGN KEY ("callRouteId") REFERENCES contactcenter.call_routes(id);


--
-- Name: call_conversion_settings call_conversion_settings_dedupesettingid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.call_conversion_settings
    ADD CONSTRAINT call_conversion_settings_dedupesettingid_foreign FOREIGN KEY ("deDupeSettingId") REFERENCES contactcenter.duplicate_settings(id);


--
-- Name: call_routes call_routes_accountid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.call_routes
    ADD CONSTRAINT call_routes_accountid_foreign FOREIGN KEY ("accountId") REFERENCES contactcenter.accounts(id) ON DELETE CASCADE;


--
-- Name: call_routes call_routes_calltargetid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.call_routes
    ADD CONSTRAINT call_routes_calltargetid_foreign FOREIGN KEY ("callTargetId") REFERENCES contactcenter.targets(id);


--
-- Name: call_routes call_routes_priorityid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.call_routes
    ADD CONSTRAINT call_routes_priorityid_foreign FOREIGN KEY ("priorityId") REFERENCES contactcenter.routing_priorities(id);


--
-- Name: campaign_affiliates campaign_affiliates_affiliateid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.campaign_affiliates
    ADD CONSTRAINT campaign_affiliates_affiliateid_foreign FOREIGN KEY ("affiliateId") REFERENCES contactcenter.affiliates(id);


--
-- Name: campaign_affiliates campaign_affiliates_campaignid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.campaign_affiliates
    ADD CONSTRAINT campaign_affiliates_campaignid_foreign FOREIGN KEY ("campaignId") REFERENCES contactcenter.campaigns(id);


--
-- Name: campaign_call_routes campaign_call_routes_callrouteid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.campaign_call_routes
    ADD CONSTRAINT campaign_call_routes_callrouteid_foreign FOREIGN KEY ("callRouteId") REFERENCES contactcenter.call_routes(id);


--
-- Name: campaign_call_routes campaign_call_routes_campaignid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.campaign_call_routes
    ADD CONSTRAINT campaign_call_routes_campaignid_foreign FOREIGN KEY ("campaignId") REFERENCES contactcenter.campaigns(id);


--
-- Name: campaigns campaigns_accountid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.campaigns
    ADD CONSTRAINT campaigns_accountid_foreign FOREIGN KEY ("accountId") REFERENCES contactcenter.accounts(id) ON DELETE CASCADE;


--
-- Name: campaigns campaigns_dedupesettingsid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.campaigns
    ADD CONSTRAINT campaigns_dedupesettingsid_foreign FOREIGN KEY ("deDupeSettingsId") REFERENCES contactcenter.duplicate_call_settings(id);


--
-- Name: campaigns campaigns_defaultnumberid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.campaigns
    ADD CONSTRAINT campaigns_defaultnumberid_foreign FOREIGN KEY ("defaultNumberId") REFERENCES contactcenter.numbers(id);


--
-- Name: campaigns campaigns_defaulttargetid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.campaigns
    ADD CONSTRAINT campaigns_defaulttargetid_foreign FOREIGN KEY ("defaultTargetId") REFERENCES contactcenter.targets(id);


--
-- Name: campaigns campaigns_dialsettingsid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.campaigns
    ADD CONSTRAINT campaigns_dialsettingsid_foreign FOREIGN KEY ("dialSettingsId") REFERENCES contactcenter.dial_settings(id);


--
-- Name: campaigns campaigns_distributionSetting_fkey; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.campaigns
    ADD CONSTRAINT "campaigns_distributionSetting_fkey" FOREIGN KEY ("distributionSetting") REFERENCES contactcenter.distributions_type(value) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: campaigns campaigns_duplicatesettingsid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.campaigns
    ADD CONSTRAINT campaigns_duplicatesettingsid_foreign FOREIGN KEY ("duplicateSettingsId") REFERENCES contactcenter.mark_as_duplicate_settings(id);


--
-- Name: campaigns campaigns_recordsettingid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.campaigns
    ADD CONSTRAINT campaigns_recordsettingid_foreign FOREIGN KEY ("recordSettingId") REFERENCES contactcenter.record_call_settings(id);


--
-- Name: campaigns campaigns_spamdetectionsettingsid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.campaigns
    ADD CONSTRAINT campaigns_spamdetectionsettingsid_foreign FOREIGN KEY ("spamDetectionSettingsId") REFERENCES contactcenter.spam_detection_settings(id);


--
-- Name: criterias criterias_comparisonType_fkey; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.criterias
    ADD CONSTRAINT "criterias_comparisonType_fkey" FOREIGN KEY ("comparisonType") REFERENCES contactcenter.comparisons_type(value) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: criterias criterias_tagroutableruleid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.criterias
    ADD CONSTRAINT criterias_tagroutableruleid_foreign FOREIGN KEY ("tagRoutableRuleId") REFERENCES contactcenter.tag_routing_tables(id);


--
-- Name: integration_settings integration_settings_accountid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.integration_settings
    ADD CONSTRAINT integration_settings_accountid_foreign FOREIGN KEY ("accountId") REFERENCES contactcenter.accounts(id) ON DELETE CASCADE;


--
-- Name: integration_settings integration_settings_conversionsetid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.integration_settings
    ADD CONSTRAINT integration_settings_conversionsetid_foreign FOREIGN KEY ("conversionSetId") REFERENCES contactcenter.integration_conversion_sets(id);


--
-- Name: integration_settings integration_settings_integrationid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.integration_settings
    ADD CONSTRAINT integration_settings_integrationid_foreign FOREIGN KEY ("integrationId") REFERENCES contactcenter.integrations(id);


--
-- Name: integrations integrations_accountid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.integrations
    ADD CONSTRAINT integrations_accountid_foreign FOREIGN KEY ("accountId") REFERENCES contactcenter.accounts(id) ON DELETE CASCADE;


--
-- Name: mark_as_duplicate_settings mark_as_duplicate_settings_duplicateSetting_fkey; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.mark_as_duplicate_settings
    ADD CONSTRAINT "mark_as_duplicate_settings_duplicateSetting_fkey" FOREIGN KEY ("duplicateSetting") REFERENCES contactcenter.duplicate_setting_type(value) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: number_tags number_tags_numberid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.number_tags
    ADD CONSTRAINT number_tags_numberid_foreign FOREIGN KEY ("numberId") REFERENCES contactcenter.numbers(id);


--
-- Name: number_tags number_tags_tagid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.number_tags
    ADD CONSTRAINT number_tags_tagid_foreign FOREIGN KEY ("tagId") REFERENCES contactcenter.tags(id);


--
-- Name: numbers numbers_accountid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.numbers
    ADD CONSTRAINT numbers_accountid_foreign FOREIGN KEY ("accountId") REFERENCES contactcenter.accounts(id) ON DELETE CASCADE;


--
-- Name: numbers numbers_affiliateid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.numbers
    ADD CONSTRAINT numbers_affiliateid_foreign FOREIGN KEY ("affiliateId") REFERENCES contactcenter.affiliates(id);


--
-- Name: numbers numbers_assignmentsettingsid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.numbers
    ADD CONSTRAINT numbers_assignmentsettingsid_foreign FOREIGN KEY ("assignmentSettingsId") REFERENCES contactcenter.number_assignment_settings(id);


--
-- Name: numbers numbers_campaignid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.numbers
    ADD CONSTRAINT numbers_campaignid_foreign FOREIGN KEY ("campaignId") REFERENCES contactcenter.campaigns(id);


--
-- Name: office_breaks office_breaks_opensettingsid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.office_breaks
    ADD CONSTRAINT office_breaks_opensettingsid_foreign FOREIGN KEY ("openSettingsId") REFERENCES contactcenter.open_settings(id);


--
-- Name: office_breaks office_breaks_starttimeid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.office_breaks
    ADD CONSTRAINT office_breaks_starttimeid_foreign FOREIGN KEY ("startTimeId") REFERENCES contactcenter.operation_times(id);


--
-- Name: open_settings open_settings_closetimeid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.open_settings
    ADD CONSTRAINT open_settings_closetimeid_foreign FOREIGN KEY ("closeTimeId") REFERENCES contactcenter.operation_times(id);


--
-- Name: open_settings open_settings_isoWeekday_fkey; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.open_settings
    ADD CONSTRAINT "open_settings_isoWeekday_fkey" FOREIGN KEY ("isoWeekday") REFERENCES contactcenter.iso_weekdays_type(value) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: open_settings open_settings_opentimeid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.open_settings
    ADD CONSTRAINT open_settings_opentimeid_foreign FOREIGN KEY ("openTimeId") REFERENCES contactcenter.operation_times(id);


--
-- Name: open_settings open_settings_scheduleid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.open_settings
    ADD CONSTRAINT open_settings_scheduleid_foreign FOREIGN KEY ("scheduleId") REFERENCES contactcenter.schedules_and_capacities(id);


--
-- Name: sip_numbers sip_numbers_callinstructionsid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.sip_numbers
    ADD CONSTRAINT sip_numbers_callinstructionsid_foreign FOREIGN KEY ("callInstructionsId") REFERENCES contactcenter.call_instructions(id);


--
-- Name: tags tags_criteriaid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.tags
    ADD CONSTRAINT tags_criteriaid_foreign FOREIGN KEY ("criteriaId") REFERENCES contactcenter.criterias(id);


--
-- Name: target_criterias target_criterias_targetid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.target_criterias
    ADD CONSTRAINT target_criterias_targetid_foreign FOREIGN KEY ("targetId") REFERENCES contactcenter.targets(id);


--
-- Name: targets targets_accountid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.targets
    ADD CONSTRAINT targets_accountid_foreign FOREIGN KEY ("accountId") REFERENCES contactcenter.accounts(id) ON DELETE CASCADE;


--
-- Name: targets targets_callinstructionsid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.targets
    ADD CONSTRAINT targets_callinstructionsid_foreign FOREIGN KEY ("callInstructionsId") REFERENCES contactcenter.call_instructions(id);


--
-- Name: targets targets_ownerid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.targets
    ADD CONSTRAINT targets_ownerid_foreign FOREIGN KEY ("ownerId") REFERENCES contactcenter.buyers(id);


--
-- Name: targets targets_scheduleid_foreign; Type: FK CONSTRAINT; Schema: contactcenter; Owner: postgres
--

ALTER TABLE ONLY contactcenter.targets
    ADD CONSTRAINT targets_scheduleid_foreign FOREIGN KEY ("scheduleId") REFERENCES contactcenter.schedules_and_capacities(id);


--
-- Name: event_invocation_logs event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_invocation_logs
    ADD CONSTRAINT event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.event_log(id);


--
-- Name: event_triggers event_triggers_schema_name_table_name_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_triggers
    ADD CONSTRAINT event_triggers_schema_name_table_name_fkey FOREIGN KEY (schema_name, table_name) REFERENCES hdb_catalog.hdb_table(table_schema, table_name) ON UPDATE CASCADE;


--
-- Name: hdb_action_permission hdb_action_permission_action_name_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_action_permission
    ADD CONSTRAINT hdb_action_permission_action_name_fkey FOREIGN KEY (action_name) REFERENCES hdb_catalog.hdb_action(action_name) ON UPDATE CASCADE;


--
-- Name: hdb_allowlist hdb_allowlist_collection_name_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_allowlist
    ADD CONSTRAINT hdb_allowlist_collection_name_fkey FOREIGN KEY (collection_name) REFERENCES hdb_catalog.hdb_query_collection(collection_name);


--
-- Name: hdb_computed_field hdb_computed_field_table_schema_table_name_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_computed_field
    ADD CONSTRAINT hdb_computed_field_table_schema_table_name_fkey FOREIGN KEY (table_schema, table_name) REFERENCES hdb_catalog.hdb_table(table_schema, table_name) ON UPDATE CASCADE;


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_cron_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hdb_cron_events hdb_cron_events_trigger_name_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_events
    ADD CONSTRAINT hdb_cron_events_trigger_name_fkey FOREIGN KEY (trigger_name) REFERENCES hdb_catalog.hdb_cron_triggers(name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hdb_permission hdb_permission_table_schema_table_name_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_permission
    ADD CONSTRAINT hdb_permission_table_schema_table_name_fkey FOREIGN KEY (table_schema, table_name) REFERENCES hdb_catalog.hdb_table(table_schema, table_name) ON UPDATE CASCADE;


--
-- Name: hdb_relationship hdb_relationship_table_schema_table_name_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_relationship
    ADD CONSTRAINT hdb_relationship_table_schema_table_name_fkey FOREIGN KEY (table_schema, table_name) REFERENCES hdb_catalog.hdb_table(table_schema, table_name) ON UPDATE CASCADE;


--
-- Name: hdb_remote_relationship hdb_remote_relationship_table_schema_table_name_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_remote_relationship
    ADD CONSTRAINT hdb_remote_relationship_table_schema_table_name_fkey FOREIGN KEY (table_schema, table_name) REFERENCES hdb_catalog.hdb_table(table_schema, table_name) ON UPDATE CASCADE;


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_scheduled_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

