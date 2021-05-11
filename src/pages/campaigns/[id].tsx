import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { NotificationManager } from 'react-notifications';
import Link from 'next/link';
import * as Icon from 'react-feather';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import {GET_CAMPAIGN} from 'shared/queries/campaigns';
import { VIEW_TARGETS } from 'shared/queries/targets';
import {VIEW_AFFILIATES} from 'shared/queries/publishers';
import Layout from 'layouts';
import Widget from 'components/widget';
import WidgetPannel from 'components/widget-pannel';
import { UnderlinedTabs , BoxTabs } from 'components/tabs';
import {
  InlineText,
  InlineTextInput,
  InlineSelect,
  InlineSwitch,
  InlineBoxSelect,
  InlineNumberInput,
  InlineReactSelect,
  InlinePhoneInput
} from 'components/forms/inline-inputs';
import { NumberInput } from 'components/forms/text-inputs';
import ItemsInput from 'components/forms/items-input';
import Datatable from 'components/datatable';
import { CircularBadge } from 'components/badges';

import api from 'shared/utils/api';
import {Button} from 'components/buttons';
import TagRoutingFilters from 'components/tag-routing-filters';
import Payouts from 'components/payouts';
import { GET_ROUTE } from 'shared/queries/call_routes';
import Card from 'components/card';
import timezoneOptions from 'json/timezones.json';
import languageOptions from 'json/languages.json';
import DateTimePicker from "components/forms/date-time-picker";
import {getDaysHours, getSeconds} from 'functions/time';
import { confirmAlert } from 'react-confirm-alert';
import groupBy from 'json-groupby';
import { GET_NUMBERS_BY_PUBLISHER } from 'shared/queries/numbers';

const timezones = timezoneOptions.map((el) => ({
  label: el.text,
  value: el.value
}));

const languages = Object.keys(languageOptions).map((key) => ({
  label: languageOptions[key].name,
  value: key
}));

const Index: React.FunctionComponent<any> = () => {
  const router = useRouter()
  const { id } = router.query;

  const { loading, error, data, refetch } = useQuery(GET_CAMPAIGN, {
    variables: { id },
  });

  if(loading) return <></>;
  if(error) return <>{error}</>;

  console.log(data);

  return (
    <Layout>
      <UnderlinedTabs
        tabs={[
          {
            index: 0,
            title: 'Campaign Settings',
            content: <TabCampaignSettings campaign={data.campaign} onChange={() => refetch()} />
          },
          {
            index: 1,
            title: 'Offer',
            content: <TabOffer />
          },
          {
            index: 2,
            title: 'Performance Summary',
            content: <TabPerformanceSummary />
          },
        ]}
        noContentPadding
        className="mt-4"
      />
    </Layout>
  );
};

// tabs

const TabCampaignSettings: React.FunctionComponent<any> = (props) => (
  <Widget>
    <GeneralInfo campaign={props.campaign} />
    <SpamFilter campaign={props.campaign} />
    <DefaultPayoutSettings campaign={props.campaign} />
    <Publishers
      campaign={props.campaign}
      onChange={() => props.onChange()}
    />
    <CallTrackingTags affiliateNumbers={props.campaign.affiliateNumbers} />
    <CallRouting
      routes={props.campaign.routes.map((el) => ({
        ...el.route
      }))}
      onChange={() => props.onChange()}
    />
    <UrlParameters />
    <TrackingPixels />
  </Widget>
)

const TabOffer: React.FunctionComponent<any> = () => (
  <Widget>
    {/* <Button
      outlined
      leftIcon="Plus"
      color="green"
    >
      CREATE OFFER
    </Button> */}

    <Offer />
  </Widget>
)

const TabPerformanceSummary: React.FunctionComponent<any> = () => (
  <Widget>
    <PerformanceSummary />
  </Widget>
)

// widgets in tab

const GeneralInfo: React.FunctionComponent<any> = (props) => {
  const formik = useFormik({
    initialValues: {
      RoutePreviouslyConnectedCalls: (() => {
        if(props.campaign.deDupeSettings.routeToDifferent){
          return 'routeToDifferent';
        }
        else if(props.campaign.deDupeSettings.routeToOriginal){
          return 'routeToOriginal';
        }
        else{
          return 'normally';
        }
      })(),

      workflowSid: props.campaign.workflowSid,
      name: props.campaign.name,
      numberDisplayFormat: props.campaign.numberDisplayFormat !== null ? props.campaign.numberDisplayFormat : '',
      evalAnonymDuplication: props.campaign.evalAnonymDuplication,
      payoutDupesGlobal: props.campaign.payoutDupesGlobal,

      duplicateSettingsId: props.campaign.duplicateSettings.id,
      duplicateSetting: props.campaign.duplicateSettings.duplicateSetting,

      deDupeSettingsId: props.campaign.deDupeSettings.id,
      routeToDifferent: props.campaign.deDupeSettings.routeToDifferent,
      routeToOriginal: props.campaign.deDupeSettings.routeToOriginal,
      strict: props.campaign.deDupeSettings.strict,

      recordSettingId: props.campaign.recordSetting.id,
      record: props.campaign.recordSetting.record,
      recordFromAnswer: props.campaign.recordSetting.recordFromAnswer,
      trimSilence: props.campaign.recordSetting.trimSilence,

      dialSettingsId: props.campaign.dialSettings.id,
      dialAttempts: props.campaign.dialSettings.dialAttempts,

      submitting: false
    },
    validationSchema: yup.object().shape({
      dialAttempts: yup.number().integer().positive()
    }),
    onSubmit: (values) => {
      formik.setFieldValue('submitting', true);

      void api.post('campaign/update', {
        workflowSid: values.workflowSid,
        name: values.name,
        numberDisplayFormat: values.numberDisplayFormat,
        evalAnonymDuplication: values.evalAnonymDuplication,
        payoutDupesGlobal: values.payoutDupesGlobal,

        duplicateSetting: values.duplicateSetting,

        routeToDifferent: values.routeToDifferent,
        routeToOriginal: values.routeToOriginal,
        strict: values.strict,

        record: values.record,
        recordFromAnswer: values.recordFromAnswer,
        trimSilence: values.trimSilence,

        dialAttempts: values.dialAttempts
      }).then(() => {
        formik.setFieldValue('submitting', false);
        NotificationManager.success('Campaign setting has been updated');
      }).catch(() => {
        formik.setFieldValue('submitting', false);
        NotificationManager.error('Operation faild');
      });
    }
  });
  console.log('campaign', formik.values);

  return(
    <WidgetPannel title="General Info">
      <InlineTextInput
        label="Campaign Name"
        placeholder="e.g. Facebook France Insurance"
        value={formik.values.name}
        onChange={(value) => formik.setFieldValue('name', value)}
        error={formik.errors.name}
        tooltip="
          Your campaign name will be used to display information around the MGL portal.
          Short campaign names work best.
        "
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="Number Format"
        placeholder={'(nnn) nnn-nnnn'}
        value={formik.values.numberDisplayFormat}
        onChange={(value) => formik.setFieldValue('numberDisplayFormat', value)}
        error={''}
        tooltip="
          Automatically format your Javascript generated phone numbers by using an 'n' for each number.
          Example: (nnn) nnn-nnnn will display as (212) 332-2354.
        "
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineSelect
        label="Report Duplicate Calls On"
        value={formik.values.duplicateSetting}
        onChange={(value) => formik.setFieldValue('duplicateSetting', value)}
        options={[
          {
            label: 'On Connect',
            value: 'ON_CONNECT'
          },
          {
            label: 'On Incomming',
            value: 'ON_INCOMMING'
          },
          {
            label: 'On Call Length',
            value: 'ON_CALL_LENGTH'
          },
        ]}
        error={formik.errors.duplicateSetting}
        tooltip="Configure the creteria used to flag calls as Duplicate in Reporting"
        className="mb-8"
        mdLabel="3"
        mdInput="9"
        />
      <InlineBoxSelect
        label="Route Previously Connected Calls"
        value={formik.values.RoutePreviouslyConnectedCalls}
        onChange={(value) => {
          formik.setFieldValue('RoutePreviouslyConnectedCalls', value);
          if(value === 'routeToOriginal'){
            formik.setFieldValue('routeToOriginal', true);
            formik.setFieldValue('routeToDifferent', false);
          }
          else if(value === 'routeToDifferent'){
            formik.setFieldValue('routeToDifferent', true);
            formik.setFieldValue('routeToOriginal', false);
          }
          else{
            formik.setFieldValue('routeToDifferent', false);
            formik.setFieldValue('routeToOriginal', false);
            formik.setFieldValue('strict', false);
          }
        }}
        options={[
          {
            label: 'Normally',
            value: 'normally'
          },
          {
            label: 'To Original',
            value: 'routeToOriginal'
          },
          {
            label: 'To Different',
            value: 'routeToDifferent'
          },
        ]}
        tooltip="
          Route duplicate callers to the original target they were routed to, a different target,
          or follow the routing plan normally. This setting only applies to the most recent duplicate phone call.
        "
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      { formik.values.RoutePreviouslyConnectedCalls !== 'normally' &&
        <InlineSwitch
          label="Strict"
          checked={formik.values.strict}
          onChange={(checked) => formik.setFieldValue('strict', checked)}
          error={formik.errors.strict}
          tooltip="Adhere to the rule strictly even if the target is not accepting calls."
          className="mb-8"
          mdLabel="3"
          mdInput="9"
        />
      }
      <InlineSwitch
        label="Handle Anonymous Calls as Duplicate"
        checked={formik.values.evalAnonymDuplication}
        onChange={(checked) => formik.setFieldValue('evalAnonymDuplication', checked)}
        error={formik.errors.evalAnonymDuplication}
        tooltip="Handle Anonymous Calls as duplicate calls."
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineSwitch
        label="Payout Once Per Caller"
        checked={formik.values.payoutDupesGlobal}
        onChange={(checked) => formik.setFieldValue('payoutDupesGlobal', checked)}
        error={formik.errors.payoutDupesGlobal}
        tooltip="Only allow one payout per Caller ID regardless of what Publisher generates the call."
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineSwitch
        label="Record Calls"
        checked={formik.values.record}
        onChange={(checked) => formik.setFieldValue('record', checked)}
        error={formik.errors.record}
        tooltip="Record all calls for this campaign."
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineSwitch
        label="Wait for Answer"
        checked={formik.values.recordFromAnswer}
        onChange={(checked) => formik.setFieldValue('recordFromAnswer', checked)}
        error={formik.errors.recordFromAnswer}
        tooltip="Start recording after answer."
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineSwitch
        label="Trim Silence"
        checked={formik.values.trimSilence}
        onChange={(checked) => formik.setFieldValue('trimSilence', checked)}
        error={formik.errors.trimSilence}
        tooltip="Trim Silince from the recording"
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineNumberInput
        label="Target Dial Attempts"
        placeholder={3}
        min={0}
        integer
        value={formik.values.dialAttempts}
        onChange={(value) => formik.setFieldValue('dialAttempts', value)}
        error={formik.errors.dialAttempts}
        tooltip="The number of attempts to reach the target"
        width="sm"
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <div className="row mt-12">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button
            className="w-32"
            loading={formik.values.submitting}
            onClick={() => formik.handleSubmit()}
          >
            SAVE
          </Button>
        </div>
      </div>
    </WidgetPannel>
  );
}

const SpamFilter: React.FunctionComponent<any> = (props) => {
  const formik = useFormik({
    initialValues: props.campaign.spamDetection
      ? {
        workflowSid: props.campaign.workflowSid,
        blockDuplicatesForSeconds: props.campaign.spamDetection.blockDuplicatesForSeconds,
        trackAnonymous: props.campaign.spamDetection.trackAnonymous,

        submitting: false
      }
      : {
        workflowSid: props.campaign.workflowSid,
        blockDuplicatesForSeconds: '',
        trackAnonymous: false,

        submitting: false
      },
    validationSchema: yup.object().shape({
      blockDuplicatesForSeconds: yup.number().positive().required()
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      formik.setFieldValue('submitting', true);

      void api.post('campaign/update-spam-detection', {
        workflowSid: values.workflowSid,
        blockDuplicatesForSeconds: values.blockDuplicatesForSeconds,
        trackAnonymous: values.trackAnonymous
      }).then(() => {
        formik.setFieldValue('submitting', false);
        NotificationManager.success('Campaign setting has been updated');
      });
    }
  });

  return(
    <WidgetPannel title="Spam Filter">
      <InlineNumberInput
        label="Filter Repeat Callers (Second)"
        type={'number'}
        min={0}
        integer
        value={formik.values.blockDuplicatesForSeconds}
        onChange={(value) => formik.setFieldValue('blockDuplicatesForSeconds', value)}
        error={formik.errors.blockDuplicatesForSeconds}
        tooltip="Automatically block calls with the same Caller ID for the specified number of seconds."
        width="sm"
        placeholder={2}
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineSwitch
        label="Filter Anonymous Calls As Spam"
        checked={formik.values.trackAnonymous}
        onChange={(checked) => formik.setFieldValue('trackAnonymous', checked)}
        error={formik.errors.trackAnonymous}
        tooltip="
          Consider anonymous calls (e.g.: +anonymous, +restricted, +unavailable, etc.)
          as the same Caller ID to be blocked for the specified number of seconds.
        "
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <div className="row mt-12">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button
            className="w-32"
            loading={formik.values.submitting}
            onClick={() => formik.handleSubmit()}
          >
            SAVE
          </Button>
        </div>
      </div>
    </WidgetPannel>
  );
}

const DefaultPayoutSettings: React.FunctionComponent<any> = (props) => {
  const [payouts, setPayouts] = useState(props.campaign.defaultPayoutSettings);
  const [submitting, setSubmitting] = useState(false);
  console.log('payouts',payouts);

  const handleSubmit = ():void => {
    const newPayouts = {
      campaignId: props.campaign.id,

      payoutSettings: payouts.map((el) => ({
        payoutType: el.payoutType,
        payoutValue: el.payoutValue,
        conversionType: el.conversionType,
        conversionValue: el.conversionValue,
        schedule: {
          data: {
            allTimeCap: el.schedule.allTimeCap,
            allTimeSumCap: el.schedule.allTimeSumCap,
            monthlyCap: el.schedule.monthlyCap,
            monthlySumCap: el.schedule.monthlySumCap,
            dailyCap: el.schedule.dailyCap,
            dailySumCap: el.schedule.dailySumCap,
            hourlyCap: el.schedule.hourlyCap,
            hourlySumCap: el.schedule.hourlySumCap,
            concurrencyCap: el.schedule.concurrencyCap,

            timeZoneId: el.schedule.timeZoneId,

            hoursOfOperation: {
              data: el.schedule.hoursOfOperation.map((ele) => ({
                openTime: {
                  data: {
                    hour: ele.openTime.hour,
                    minute: ele.openTime.minute
                  }
                },
                closeTime: {
                  data: {
                    hour: ele.closeTime.hour,
                    minute: ele.closeTime.minute
                  }
                },
                inverted: ele.inverted,
                isClosed: ele.isClosed
              }))
            }
          }
        },
        criteria: {
          data: {
            tagRoutableRule: {
              data: el.criteria.length > 0
                ? el.criteria[0].tagRoutableRule.map((ele) => (
                    {
                      tagCriteria: {
                        data: ele.tagCriteria.map((elem) => ({
                          comparisonType: elem.comparisonType,
                          isNegativeMatch: elem.isNegativeMatch,
                          isNumber: elem.isNumber,
                          tagId: elem.tagId,
                          tagIds: elem.tagIds,
                          value: elem.value
                        }))
                      }
                    }
                  ))
                : []
            }
          }
        },
        deDupeSetting: {
          data: {
            secondsFromLastCall: el.deDupeSetting.secondsFromLastCall
          }
        }
      }))
    };

    // console.log('submitting', JSON.stringify(newPayouts));return;
    setSubmitting(true);

    void api.post('campaign/set-campaign-payout-settings', newPayouts).then(() => {
      setSubmitting(false);
      NotificationManager.success('Campaign default payout has been updated');
    });
  }

  return(
    <WidgetPannel title="Default Payout Settings">
      <div className="relative w-full flex flex-wrap justify-center">
        <div className="md:w-9/12 w-full">
          <Payouts
            btnLabel="Add Campaign Payout Setting"
            value={payouts}
            onChange={(value) => setPayouts(value)}
            controllable
          />
        </div>
      </div>
      <div className="row mt-12">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button
            className="w-32"
            loading={submitting}
            onClick={() => handleSubmit()}
          >
            SAVE
          </Button>
        </div>
      </div>
    </WidgetPannel>
  );
}

const Publishers: React.FunctionComponent<any> = (props) => {
  const groupedNumbers = groupBy(props.campaign.affiliateNumbers, ['affiliate.id']);
  const numbers = Object.keys(groupedNumbers).map((key) => ({
    affiliateId: key,
    name: groupedNumbers[key][0].affiliate.name,
    enabled: groupedNumbers[key][0].affiliate.enabled,
    items: groupedNumbers[key].map((el) => el)
  }));

  const workflowSid = props.campaign.workflowSid;

  const columns = useMemo(
    () => [
      {
        Header: 'Enabled',
        accessor: 'enabled',
        Cell: (cell) => cell.value
          ? <Icon.Check size={14} strokeWidth={3} className="text-green-600" />
          : <Icon.Minus size={14} strokeWidth={3} className="text-gray-500" />
      },
      {
        Header: 'Offer',
        accessor: 'offer',
      },
      {
        Header: 'Publisher',
        accessor: 'name'
      },
      {
        Header: 'Phone Numbers',
        accessor: (row) => ({
          numbers: row.items
        }),
        Cell: (cell) => cell.value.numbers.length > 0
          ? (
            cell.value.numbers.map((el, key) => (
              <div key={key} className={`flex justify-between items-center ${key !== 0 ? 'mt-1' : ''}`}>
                <p>{el.phoneNumber}</p>
                <Button
                  flat
                  icon
                  leftIcon="X"
                  className="mx-1"
                  tooltip="Remove Number"
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    btn.disabled = true;
                    void api.post('campaign/delete-publisher-number', {
                      phoneNumberId: el.id
                    }).then(() => {
                      btn.disabled = false;
                      props.onChange();
                    });
                  }}
                />
              </div>
            ))
          )
          : 'None'
      },
      {
        Header: 'Configuration Overrides',
        accessor: 'configurationOverrides',
        Cell: () => 'Using Campaign Payout Settings'
      },
      {
        Header: 'Actions',
        accessor: (row: any) => ({
          id: row.id,
          affiliateId: row.affiliateId
        }),
        Cell: (cell: any) => (
          <div className="flex">
            <Button
              flat
              icon
              leftIcon="Edit"
              className="mx-1"
              tooltip="Override Campaign Configuration Settings"
              onClick={() => setExpandRow({
                index: cell.row.index % cell.state.pageSize,
                content: (
                  <OverrideCampaignPayoutSettings
                    requestClose={() => {
                      // void refetch();
                      setExpandRow(false);
                    }}
                  />
                )
              })}
            />
            <Button
              flat
              icon
              leftIcon="Plus"
              className="mx-1"
              tooltip="Add Numbers"
              onClick={() => setExpandRow({
                index: cell.row.index % cell.state.pageSize,
                content: (
                  <AddNumbers
                    affiliate={{
                      affiliateId: cell.value.affiliateId,
                      workflowSid: props.campaign.workflowSid
                    }}
                    requestClose={() => {
                      props.onChange();
                      setExpandRow(false);
                    }}
                  />
                )
              })}
            />
            <Button
              flat
              icon
              leftIcon="XCircle"
              className="mx-1"
              tooltip="Delete"
              onClick={() => handleDeletePublisher(cell.value.id)}
            />
          </div>
        ),
      },
    ],
    []
  );

  const {loading, data, refetch } = useQuery(VIEW_AFFILIATES);

  const [ expandRow, setExpandRow ] = useState<any>(false);

  const handleDeletePublisher = (affiliateId: number):void => {
    confirmAlert({
      title: 'Confirm Delete Campaign Publisher',
      message: 'Are you sure to remove this publisher from the campaign?',
      buttons: [
        {
          label: 'Yes, remove it!',
          onClick: () => {
            void api.post('campaign/delete-campaign-publisher', {
              affiliateId,
              workflowSid
            }).then(() => {
              NotificationManager.success('Publisher has been removed');
              void refetch();
            });
          }
        },
        {
          label: 'No',
          onClick: () => false
        }
      ]
    });
  }

  if(loading) return <></>;

  console.log('groupedNumbers', groupedNumbers);
  console.log('numbers',numbers);

  return(
    <WidgetPannel title="Publishers" paddingTop={4}>
      <div className="row">
        <div className="col-md-12">
          <Datatable
            columns={columns}
            data={numbers}
            searchable
            headerLeft={
              <>
                <Button
                  outlined
                  size="sm"
                  leftIcon="Plus"
                  color="green"
                  className="mr-2"
                  onClick={() => setExpandRow({
                    index: -1,
                    content: (
                      <AddPublisher
                        workflowSid={props.campaign.workflowSid}
                        publishers={data.affiliates.filter((el) =>
                          props.campaign.affiliateNumbers.findIndex((ell) => el.id === ell.affiliate.id) === -1
                        ).map((el) => ({ label: el.name, value: el.id, createNumbers: el.createNumbers }))}
                        requestClose={() => {
                          props.onChange();
                          setExpandRow(false);
                        }}
                      />
                    )
                    })}
                >
                  ADD PUBLISHER TO CAMPAIGN
                </Button>
                <Button
                  outlined
                  size="sm"
                  leftIcon="Plus"
                  className="mr-2"
                  onClick={() => setExpandRow({
                    index: -1,
                    content: (
                      <InvitePublisher
                        publishers={data.affiliates.filter((el) =>
                          props.campaign.affiliateNumbers.findIndex((ell) => el.id === ell.affiliate.id) === -1
                        ).map((el) => ({ label: el.name, value: el.id }))}
                        requestClose={() => {
                          // void refetch();
                          setExpandRow(false);
                        }}
                      />
                    )
                    })}
                >
                  INVITE PUBLISHER TO OFFER
                </Button>
              </>
            }
            expandRow={expandRow}
            filterOptions={[
              {
                label: 'Offer Publishers',
                option: (v) => v.enabled
              },
              {
                label: 'Non-offer Publishers',
                option: () => false
              },
            ]}
          />
        </div>
      </div>
    </WidgetPannel>
  );
}

const CallTrackingTags: React.FunctionComponent<any> = (props) => {
  const tags = [];
  const columns = [
    {
      Header: 'Name',
      accessor: 'name'
    },
    {
      Header: 'Phone Number',
      accessor: 'number'
    },
    {
      Header: 'Publisher',
      accessor: 'publisher'
    },
    {
      Header: 'Capture User Data',
      accessor: 'captureUserData'
    },
    {
      Header: 'Number Pool',
      accessor: 'pool'
    },
    {
      Header: 'Number to Replace',
      accessor: 'replace'
    },
    {
      Header: 'Actions',
      accessor: 'actions'
    },
  ];

  const [ expandRow, setExpandRow ] = useState<any>(false);

  return(
    <WidgetPannel title="Call Tracking Tags" paddingTop={4}>
      <Datatable
        columns={columns}
        data={tags}
        headerLeft={
          <Button
            outlined
            size="sm"
            leftIcon="Plus"
            color="green"
            onClick={() => setExpandRow({
              index: -1,
              content: (
                <AddCallTrackingTag
                  affiliateNumbers={props.affiliateNumbers}
                  requestClose={() => {
                    // void refetch();
                    setExpandRow(false);
                  }}
                />
              )
              })}
          >
            ADD CALL TRACKING TAG
          </Button>
        }
        expandRow={expandRow}
      />
    </WidgetPannel>
  );
}

const CallRouting: React.FunctionComponent<any> = (props) => {
  const routes = props.routes.filter((el) => el.callTarget !== null);

  const { loading, data: targetsData } = useQuery(VIEW_TARGETS, {
    fetchPolicy: 'network-only'
  });

  if(loading) return <></>;

  console.log('targets', targetsData ? targetsData.targets : '');
  console.log('routes', routes);

  return(
    <CallRoutingContent
      targets={targetsData.targets.filter((el) =>
        routes.findIndex((ell) => el.id === ell.callTarget.id) === -1
      )}
      routes={routes}
      onChange={() => props.onChange()}
    />
  )
}

const CallRoutingContent: React.FunctionComponent<any> = (props) => {
  const router = useRouter()
  const campaignId = router.query.id;

  const [ expandRow, setExpandRow ] = useState<any>(false);

  const targetsColumns = [
    {
      Header: 'Name',
      accessor: (d: any) => ({
        id: d.id,
        name: d.name
      }),
      Cell: (cell: any) => (
        <Link href={`/targets/${cell.value.id}`}>
          <a target="_blank">
            {cell.value.name}
          </a>
        </Link>
      ),
    },
    {
      Header: 'Type',
      accessor: 'instructions',
      Cell: (cell: any) => {
        if (cell.value.callType === 'number') {
          return <Icon.Phone size={16} />;
        }else if(cell.value.callType === 'sip'){
          return <Icon.Radio size={16} />;
        }

        return <></>;
      },
    },
    {
      Header: 'Destination',
      accessor: (d: any) => d.instructions.number,
      Cell: (cell: any) => cell.value,
    },
    {
      Header: 'Status',
      accessor: 'enabled',
      Cell: (cell: any) =>
        cell.value ? (
          <CircularBadge size="xs" color="green">
            {' '}
          </CircularBadge>
        ) : (
          <CircularBadge size="xs" color="gray">
            {' '}
          </CircularBadge>
        ),
    },
    {
      Header: 'Actions',
      accessor: 'id',
      Cell: (cell: any) => (
        <div className="flex">
          {
            <Button
              flat
              icon
              leftIcon="ChevronsRight"
              className="mx-1"
              tooltip="Add Target to Routing Plan"
              disabled={false}
              onClick={(e) => {
                const btn = e.currentTarget;
                btn.disabled = true;
                void api.post('campaign/add-route', {
                  targetId: cell.value,
                  campaignId,
                  accountId: 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0'
                }).then(() => {
                  btn.disabled = false;
                  props.onChange();
                });
              }}
            />
          }
        </div>
      ),
    },
  ];
  const routesColumns = useMemo(() => [
    {
      Header: 'Priority',
      accessor: (row) => ({
        id: row.id,
        priority: row.priority.priority,
      }),
      Cell: (cell) => (
        <NumberInput
          value={cell.value.priority}
          min={0}
          width="xs"
          onChange={(value) => {
            void api.post('campaign/set-priority', {
              campaignId,
              callRouteId: cell.value.id,
              priority: value
            }).then(() => {
              props.onChange();
            }).catch(() => {
              NotificationManager.error('Operation faild');
            });
          }}
        />
      )
    },
    {
      Header: 'Weight',
      accessor: (row) => ({
        id: row.id,
        weight: row.priority.weight,
      }),
      Cell: (cell) => (
        <NumberInput
          value={cell.value.weight}
          min={0}
          width="xs"
          onChange={(value) => {
            void api.post('campaign/set-weight', {
              campaignId,
              callRouteId: cell.value.id,
              weight: value
            }).then(() => {
              props.onChange();
            }).catch(() => {
              NotificationManager.error('Operation faild');
            });
          }}
        />
      )
    },
    {
      Header: 'Name',
      accessor: (d: any) => ({
        id: d.callTarget.id,
        name: d.callTarget.name
      }),
      Cell: (cell: any) => (
        <Link href={`/targets/${cell.value.id}`}>
          <a target="_blank">
            {cell.value.name}
          </a>
        </Link>
      ),
    },
    {
      Header: 'Destination',
      accessor: (d: any) => d.callTarget.instructions.number,
      Cell: (cell: any) => cell.value,
    },
    {
      Header: 'Type',
      accessor: (d) => d.callTarget.instructions.callType,
      Cell: (cell: any) => {
        if (cell.value === 'number') {
          return <Icon.Phone size={16} />;
        }else if(cell.value === 'sip'){
          return <Icon.Radio size={16} />;
        }

        return <></>;
      },
    },
    {
      Header: 'Status',
      accessor: 'enabled',
      Cell: (cell: any) =>
        cell.value ? (
          <CircularBadge size="xs" color="green">
            {' '}
          </CircularBadge>
        ) : (
          <CircularBadge size="xs" color="gray">
            {' '}
          </CircularBadge>
        ),
    },
    {
      Header: 'Actions',
      accessor: (row: any) => ({
        id: row.id,
        queueSid: row.queueSid
      }),
      Cell: (cell: any) => (
        <div className="flex">
          <Button
            flat
            icon
            leftIcon="Edit"
            className="mx-1"
            tooltip="Edit"
            onClick={() => {
              setExpandRow({
                index: cell.row.index % cell.state.pageSize,
                content: (
                  <EditCallRoute
                    id={cell.value.id}
                    requestClose={() => {
                      // void refetch();
                      setExpandRow(false);
                    }}
                  />
                )
              });
            }}
          />
          <Button
            flat
            icon
            leftIcon="XCircle"
            className="mx-1"
            tooltip="Remove"
            disabled={false}
            onClick={(e) => {
              const btn = e.currentTarget;
              btn.disabled = true;
              void api.post('campaign/delete-call-route', {
                queueSid: cell.value.queueSid
              }).then(() => {
                btn.disabled = false;
                props.onChange();
              });
            }}
          />
        </div>
      ),
    },
  ],
  []);

  const targets = props.targets;
  const routes = props.routes;

  return(
    <WidgetPannel title="Call Routing" paddingTop={4}>
      <div className="row">
        <div className="col-md-5">
          <BoxTabs
            tabs={
              [
                { index: 0, title: 'Targets', active: true, content: (
                  <Datatable
                    columns={targetsColumns}
                    data={targets}
                  />
                )},
                { index: 1, title: 'Groups', active: false, content: (
                  <p>No Data</p>
                )},
              ]
            }
          />
        </div>
        <div className="col-md-7">
          <BoxTabs
            tabs={
              [
                { index: 0, title: 'Routing Plan', active: true, content: (
                  <Datatable
                    columns={routesColumns}
                    data={routes}
                    expandRow={expandRow}
                  />
                )}
              ]
            }
          />
        </div>
      </div>
    </WidgetPannel>
  );
}

const UrlParameters: React.FunctionComponent<any> = (props) => {
  const urlParameters = [];
  const columns = [
    {
      Header: 'URL Parameter',
      accessor: 'urlParameter'
    },
    {
      Header: 'Reporting Menu Name',
      accessor: 'reportingMenuName'
    },
    {
      Header: 'Report Name',
      accessor: 'reportName'
    },
    {
      Header: 'Actions',
      accessor: 'actions'
    }
  ];

  const [ expandRow, setExpandRow ] = useState<any>(false);

  return(
    <WidgetPannel title="URL Parameters" paddingTop={4}>
      <Datatable
        columns={columns}
        data={urlParameters}
        headerLeft={
          <Button
            outlined
            size="sm"
            leftIcon="Plus"
            color="green"
            onClick={() => setExpandRow({
              index: -1,
              content: (
                <AddUrlParameters
                  affiliateNumbers={props.affiliateNumbers}
                  requestClose={() => {
                    // void refetch();
                    setExpandRow(false);
                  }}
                />
              )
              })}
          >
            ADD URL PARAMETER
          </Button>
        }
        expandRow={expandRow}
      />
    </WidgetPannel>
  );
}

const TrackingPixels: React.FunctionComponent<any> = (props) => {
  const trackingPixels = [];
  const columns = [
    {
      Header: 'Name',
      accessor: 'name'
    },
    {
      Header: 'Fire Pixel On',
      accessor: 'firePixelOn'
    },
    {
      Header: 'Method',
      accessor: 'method'
    },
    {
      Header: 'URL',
      accessor: 'url'
    },
    {
      Header: 'Actions',
      accessor: 'actions'
    }
  ];

  const [ expandRow, setExpandRow ] = useState<any>(false);

  return(
    <WidgetPannel title="Tracking Pixels" paddingTop={4}>
      <Datatable
        columns={columns}
        data={trackingPixels}
        headerLeft={
          <Button
            outlined
            size="sm"
            leftIcon="Plus"
            color="green"
            onClick={() => setExpandRow({
              index: -1,
              content: (
                <AddTrackingPixels
                  affiliateNumbers={props.affiliateNumbers}
                  requestClose={() => {
                    // void refetch();
                    setExpandRow(false);
                  }}
                />
              )
              })}
          >
            ADD PIXEL
          </Button>
        }
        expandRow={expandRow}
      />
    </WidgetPannel>
  );
}

const Offer: React.FunctionComponent<any> = () => {
  const [editing, setEditing] = useState(false);

  return(
    <>
      <Card borderTop>
        <div className="row mb-2">
          <div className="col-md-2">
            <label>Display Name</label>
          </div>
          <div className="col-md-10">
            <p className="font-semibold">awesdfwef</p>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-2">
            <label>Description</label>
          </div>
          <div className="col-md-10">
            <p className="font-semibold">awesdfwef</p>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-2">
            <label>Notes</label>
          </div>
          <div className="col-md-10">
            <p className="font-semibold">awesdfwef</p>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-2">
            <label>Category</label>
          </div>
          <div className="col-md-10">
            <p className="font-semibold">awesdfwef</p>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-2">
            <label>Language(s)</label>
          </div>
          <div className="col-md-10">
            <p className="font-semibold">awesdfwef</p>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-2">
            <label>Offer Visibility</label>
          </div>
          <div className="col-md-10">
            <p className="font-semibold">awesdfwef</p>
          </div>
        </div>

        <p className="text-base mt-6 mb-2">Publisher Number Limits</p>

        <div className="row mb-2">
          <div className="col-md-2">
            <label>Max Numbers Per Publisher</label>
          </div>
          <div className="col-md-10">
            <p className="font-semibold">awesdfwef</p>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-2">
            <label>Allow Toll-Free Numbers</label>
          </div>
          <div className="col-md-10">
            <p className="font-semibold">awesdfwef</p>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-2">
            <label>Allow DID Numbers</label>
          </div>
          <div className="col-md-10">
            <p className="font-semibold">awesdfwef</p>
          </div>
        </div>
        <div className="mt-8">
          <Button
            outlined
            leftIcon="Edit"
            className="mr-4"
            onClick={() => setEditing(true)}
          >
            EDIT DRAFT
          </Button>
          <Button
            leftIcon="PauseCircle"
            className="mr-4"
          >
            PAUSE OFFER
          </Button>
          <Button
            outlined
            leftIcon="Power"
            color="red"
            className="mr-4"
          >
            END OFFER
          </Button>
        </div>
      </Card>
      {editing &&
      <>
        <br/>
        <EditOfferDraft
          onChange={() => false}
          onCancel={() => setEditing(false)}
        />
      </>
      }
    </>
  );
}

const EditOfferDraft: React.FunctionComponent<any> = (props) => (
  <Card borderTop>
    <div>
      <InlineTextInput
        label="Display name"
        value={''}
        onChange={() => false}
        error={false}
        borderUnderline
        mdLabel="3"
        mdInput="9"
        className="mb-5"
      />
      <InlineTextInput
        label="Description"
        value={''}
        onChange={() => false}
        error={false}
        mdLabel="3"
        mdInput="9"
        className="mb-5"
      />
      <InlineTextInput
        label="Notes"
        value={''}
        onChange={() => false}
        error={false}
        mdLabel="3"
        mdInput="9"
        className="mb-5"
      />
      <InlineReactSelect
        label="Category"
        placeholder="Select/Enter Category"
        value={''}
        onChange={() => false}
        options={[]}
        error={false}
        mdLabel="3"
        mdInput="9"
        className="mb-5"
      />
      <InlineReactSelect
        label="Select Supported Languages"
        placeholder="Search Languages"
        value={''}
        onChange={() => false}
        isMulti
        options={languages}
        error={false}
        mdLabel="3"
        mdInput="9"
        className="mb-5"
      />
      <InlineReactSelect
        label="Expiration Timezone"
        placeholder="Search Timezone"
        value={''}
        onChange={() => false}
        options={timezones}
        error={false}
        className="mb-5"
        mdLabel="3"
        mdInput="9"
      />
      <div className="row mb-5">
        <div className="col-md-3 flex justify-end items-center">
          <label>Expiration Date</label>
        </div>
        <div className="col-md-9">
          <DateTimePicker
            value={new Date()}
            onChange={() => false}
            showTimeInput
            dateFormat="MMMM d, yyyy h:mm aa"
          />
        </div>
      </div>
      <InlineSelect
        label="Offer Visibility"
        placeholder="Select Visibility"
        value={'PRIVATE'}
        onChange={() => false}
        isMulti
        options={[
          {
            label: 'Private',
            value: 'PRIVATE'
          },
          {
            label: 'Account',
            value: 'ACCOUNT'
          },
        ]}
        error={false}
        mdLabel="3"
        mdInput="9"
        className="mb-5"
      />
      <InlineSwitch
        label="Require Approval"
        checked={false}
        onChange={() => false}
        error={false}
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
    </div>

    <WidgetPannel title="Public Number Limits">
      <InlineNumberInput
        label="Max Numbers Per Publisher"
        value={null}
        onChange={() => false}
        error={false}
        min={0}
        width="sm"
        mdLabel="3"
        mdInput="9"
        className="mb-5"
      />
      <InlineSwitch
        label="Allow Toll-Free Numbers"
        checked={false}
        onChange={() => false}
        error={false}
        className="mb-5"
        mdLabel="3"
        mdInput="9"
      />
      <InlineSwitch
        label="Allow DID Numbers"
        checked={false}
        onChange={() => false}
        error={false}
        className="mb-5"
        mdLabel="3"
        mdInput="9"
      />
    </WidgetPannel>
    <div className="row">
      <div className="col-md-3"></div>
      <div className="col-md-9">
        <Button
          className="mr-4"
          loading={false}
          onClick={() => false}
        >
          SAVE AS DRAFT
        </Button>
        <Button
          outlined
          color="green"
          className="mr-4"
          onClick={() => false}
        >
          SAVE & PUBLISH
        </Button>
        <Button
          outlined
          className="mr-4"
          onClick={() => props.onCancel()}
        >
          CANCEL
        </Button>
      </div>
    </div>
  </Card>
)

const PerformanceSummary: React.FunctionComponent<any> = () => {
  const chartData = [
    {
      name: '14. Sep',
    },
    {
      name: '3:00 am',
    },
    {
      name: '4:00 am',
    },
    {
      name: '5:00 am',
    },
    {
      name: '6:00 am',
    },
    {
      name: '7:00 am',
      Incoming: 380,
      Connected: 360,
      Revenue: 1400,
      Payout: 590,
    },
    {
      name: '8:00 am',
      Incoming: 590,
      Connected: 470,
      Revenue: 1506,
      Payout: 868,
    },
    {
      name: '9:00 am',
      Incoming: 350,
      Connected: 320,
      Revenue: 989,
      Payout: 1397,
    },
    {
      name: '10:00 am',
      Incoming: 480,
      Connected: 390,
      Revenue: 1228,
      Payout: 1480,
    },
    {
      name: '11:00 am',
      Incoming: 460,
      Connected: 430,
      Revenue: 1100,
      Payout: 1520,
    },
    {
      name: '12:00 am',
      Incoming: 380,
      Connected: 410,
      Revenue: 1700,
      Payout: 1400,
    },
    {
      name: '1:00 pm',
    },
    {
      name: '2:00 pm',
    },
    {
      name: '3:00 pm',
    },
    {
      name: '4:00 pm',
    },
    {
      name: '5:00 pm',
    },
    {
      name: '6:00 pm',
    },
  ];

  return(
    <>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <ComposedChart
            width={500}
            height={400}
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 0" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis
              yAxisId="left"
              axisLine={false}
              label={{
                value: 'Call Counts',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <YAxis
              yAxisId="right"
              unit="$"
              axisLine={false}
              orientation={'right'}
              label={{
                value: 'Amount',
                angle: 90,
                position: 'insideRight',
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              strokeWidth={2}
              dataKey="Incoming"
              stroke="#ff7300"
            />
            <Line
              yAxisId="left"
              type="monotone"
              strokeWidth={2}
              dataKey="Connected"
              stroke="#48bb78"
            />
            <Bar
              yAxisId="right"
              dataKey="Revenue"
              barSize={10}
              fill="#48bb78"
            />
            <Bar
              yAxisId="right"
              dataKey="Payout"
              barSize={10}
              fill="#413ea0"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>
              <div>9/18</div>
              <div>Friday</div>
            </th>
            <th>
              <div>9/17</div>
              <div>Thursday</div>
            </th>
            <th>
              <div>9/16</div>
              <div>Wednesday</div>
            </th>
            <th>
              <div>9/15</div>
              <div>Tuesday</div>
            </th>
            <th>
              <div>9/14</div>
              <div>Monday</div>
            </th>
            <th>
              <div>9/13</div>
              <div>Sunday</div>
            </th>
            <th>
              <div>9/12</div>
              <div>Saturday</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Impressions</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Imcoming</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Connected</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Completed</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Converted</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Avg Call Length</td>
            <td>00:00:00</td>
            <td>00:00:00</td>
            <td>00:00:00</td>
            <td>00:00:00</td>
            <td>00:00:00</td>
            <td>00:00:00</td>
            <td>00:00:00</td>
          </tr>
          <tr>
            <td>Revenue</td>
            <td>$0</td>
            <td>$0</td>
            <td>$0</td>
            <td>$0</td>
            <td>$0</td>
            <td>$0</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>Payout</td>
            <td>$0</td>
            <td>$0</td>
            <td>$0</td>
            <td>$0</td>
            <td>$0</td>
            <td>$0</td>
            <td>$0</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

// table contents

// in publishers
const AddPublisher: React.FunctionComponent<any> = (props) => {
  const publishers = props.publishers;

  const formik = useFormik<any>({
    initialValues: {
      canCreateNew: false,
      createNew: false,
      numberIds: [], // existing numbers id belonging to selected publisher
      publisher: '', // affiliate id
      resource_type: '', // number type
      area_code: '', // prefix
      isBill: false,
      phoneNumber: '', // new number selected among purchased ones

      searched: false,
      numbers: [],

      submitting: false
    },
    validationSchema: yup.object().shape({
      isBill: yup.boolean().required(),
      resource_type: yup.string().when('createNew', {
        is: true,
        then: yup.string().required()
      }),
      area_code: yup.string(),
      phoneNumber: yup.string().nullable().when('searched', {
        is: true,
        then: yup.string().required()
      }),
      publisher: yup.string().required(),
      numberIds: yup.array().when('createNew', {
        is: false,
        then: yup.array().required()
      }),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      formik.setFieldValue('submitting', true);

      const newNumberIds = [...formik.values.numberIds];

      if(values.createNew){
        if(values.searched){
          void api.post('numbers/buy', {
            phoneNumber: values.phoneNumber,
            affiliateId : values.publisher,
            accountId: "e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0"
          })
          .then((res) => {
            newNumberIds.push(res.data.id);
            saveNumbers(newNumberIds, values.publisher);
          });
        }else{
          void api.get('numbers/search', {
            params: {
              resource_type: values.resource_type,
              area_code: values.area_code
            }
          })
          .then((res) => {
            if(res.data.length === 0){
              NotificationManager.warning(`
                There is no available number.
                Try again after change parameters
              `);
            }else{
              formik.setFieldValue('searched', true);
            }
            formik.setFieldValue('numbers', res.data);
            formik.setFieldValue('submitting', false);
          });

          return;
        }
      }else{
        saveNumbers(newNumberIds, values.publisher);
      }
    },
  });

  const { data: publisherNumbersData } = useQuery(GET_NUMBERS_BY_PUBLISHER, {
    variables: {
      id: formik.values.publisher
    }
  });

  const initNumbers = ():void => {
    formik.setFieldValue('phoneNumber', '');
    formik.setFieldValue('searched', false);
    formik.setFieldValue('numbers', []);
  }

  const saveNumbers = (numberIdsParam, affiliateIdParam):void => {
    void api.post('campaign/add-campaign-publisher', {
      affiliateId : affiliateIdParam,
      numberIds: numberIdsParam,
      workflowSid: props.workflowSid
    })
    .then(() => {
      formik.setFieldValue('submitting', false);
      NotificationManager.success('Publisher has been added to the campaign');
      props.requestClose();
    });
  }

  console.log('errors', formik.errors);

  return (
    <div className="py-8">
      <InlineReactSelect
        label="Publisher"
        placeholder="Select Publisher"
        value={formik.values.publisher}
        options={publishers}
        onChange={(value) => {
          formik.setFieldValue('publisher', value);
          formik.setFieldValue('canCreateNew', publishers.find((el) => el.value === value).createNumbers);
          formik.setFieldValue('createNew', false);
          initNumbers();
        }}
        error={formik.errors.publisher}
        tooltip="Selecting a Publisher to associate with this Campaign will enable enhanced tracking via our JS tag."
        className="mb-5"
        mdLabel="3"
        mdInput="9"
      />
      {formik.values.publisher !== '' &&
        <>
          <InlineSwitch
            label="Create New United States Number"
            checked={formik.values.createNew}
            onChange={(checked) => formik.setFieldValue('createNew', checked)}
            tooltip="Enable this to create a new number."
            disabled={!formik.values.canCreateNew}
            className="mb-5"
            mdLabel="3"
            mdInput="9"
          />
          {
            formik.values.createNew
              ? (
                <>
                  <InlineBoxSelect
                    label="Number Type"
                    options={[
                      {
                        label: 'Toll Free',
                        value: 'tollfree'
                      },
                      {
                        label: 'Local',
                        value: 'local'
                      },
                    ]}
                    value={formik.values.resource_type}
                    onChange={(value) => {
                      formik.setFieldValue('resource_type', value);
                      initNumbers();
                    }}
                    error={formik.errors.resource_type}
                    tooltip={`
                      Choose the number type
                      <br>
                      <br>
                      TollFree: Only use Toll Free numbers. 
                      <br>
                      Notice that Toll Free numbers have higher per-minute charges than local phone numbers
                      <br>
                      <br>
                      Local: Only use Local numbers.
                    `}
                    className="mb-5"
                    mdLabel="3"
                    mdInput="9"
                  />
                  <InlineNumberInput
                    label="Prefix"
                    placeholder="Optional"
                    value={formik.values.area_code}
                    onChange={(value) => {
                      formik.setFieldValue('area_code', value);
                      initNumbers();
                    }}
                    min={0}
                    integer
                    error={formik.errors.area_code}
                    tooltip="Entering '212' will make MGL only select phone numbers with the prefix '212'."
                    width="sm"
                    className="mb-5"
                    mdLabel="3"
                    mdInput="9"
                  />
                  <InlineSwitch
                    label="Bill Card"
                    onChange={(checked) => formik.setFieldValue('isBill', checked)}
                    checked={formik.values.isBill}
                    error={formik.errors.isBill}
                    tooltip="
                      If your account balance is not enough to complete this allocation,
                      we will bill your default credit card instead.
                    "
                    className="mb-5"
                    mdLabel="3"
                    mdInput="9"
                  />
                  {formik.values.numbers.length > 0 &&
                    <InlineReactSelect
                      label="Phone Number"
                      placeholder="Select Number"
                      value={formik.values.phoneNumber}
                      options={formik.values.numbers.map((el, key) => ({
                        label: el.phoneNumber,
                        value: key
                      }))}
                      onChange={(value) => formik.setFieldValue('phoneNumber', formik.values.numbers[value])}
                      error={formik.errors.phoneNumber}
                      tooltip="Pick one among searched numbers."
                      className="mb-5"
                      mdLabel="3"
                      mdInput="9"
                    />
                  }
                </>
              )
              : (
                <>
                  {(publisherNumbersData && publisherNumbersData.numbers) &&
                    <InlineReactSelect
                      label="Existing Numbers"
                      placeholder="Select Numbers"
                      options={publisherNumbersData.numbers.map((el) => ({
                        label: el.phoneNumber,
                        value: el.id
                      }))}
                      value={formik.values.numberIds}
                      onChange={(value) => formik.setFieldValue('numberIds', value)}
                      error={formik.errors.numberIds}
                      tooltip="Pick one among searched numbers."
                      isMulti
                      className="mb-5"
                      mdLabel="3"
                      mdInput="9"
                    />
                  }
                </>
              )
          }
        </>
      }

      <div className="row mt-8">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button
            className="w-40 mr-4"
            onClick={() => formik.handleSubmit()}
            loading={formik.values.submitting}
          >
            {
              (formik.values.createNew && !formik.values.searched) ? 'SEARCH NUMBERS' : 'ADD'
            }
          </Button>
          <Button outlined onClick={() => props.requestClose()}>CANCEL</Button>
        </div>
      </div>
    </div>
  );
};

const InvitePublisher: React.FunctionComponent<any> = (props) => {
  const publishers = props.publishers;

  const formik = useFormik<any>({
    initialValues: {
      publisher: '',
      invitationMessage: '',
      submitting: false
    },
    validationSchema: yup.object().shape({
      publisher: yup.string().required()
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      formik.setFieldValue('submitting', true);
    },
  });

  return (
    <div className="py-8">
      <InlineReactSelect
        label="Publisher"
        placeholder="Select Publisher"
        value={formik.values.publisher}
        options={publishers}
        onChange={(value) => formik.setFieldValue('publisher', value)}
        error={formik.errors.publisher}
        tooltip="Selecting a Publisher to associate with this Campaign will enable enhanced tracking via our JS tag."
        className="mb-5"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="Invitation Message"
        value={formik.values.invitationMessage}
        onChange={(value) => formik.setFieldValue('invitationMessage', value)}
        error={formik.errors.invitationMessage}
        tooltip="Invitation Message"
        className="mb-5"
        mdLabel="3"
        mdInput="9"
      />
      <div className="row mt-8">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button
            className="w-40 mr-4"
            onClick={() => formik.handleSubmit()}
            loading={formik.values.submitting}
          >
            INVITE PUBLISHER
          </Button>
          <Button outlined onClick={() => props.requestClose()}>CANCEL</Button>
        </div>
      </div>
    </div>
  );
};

const OverrideCampaignPayoutSettings: React.FunctionComponent<any> = (props) => {
  const [payouts, setPayouts] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = ():void => {
    setSubmitting(true);
  }

  return (
    <div className="py-8">
      <div className="relative w-full flex flex-wrap justify-center">
        <div className="md:w-9/12 w-full">
          <Payouts
            btnLabel="Add Publisher Payout Override"
            value={payouts}
            onChange={(value) => setPayouts(value)}
            controllable
          />
        </div>
      </div>
      <div className="row mt-12">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button
            className="w-32 mr-4"
            loading={submitting}
            onClick={() => handleSubmit()}
          >
            SAVE
          </Button>
          <Button
            outlined
            onClick={() => props.requestClose()}
          >
            CANCEL
          </Button>
        </div>
      </div>
    </div>
  );
}

const AddNumbers: React.FunctionComponent<any> = (props) => {
  const affiliate = props.affiliate;

  const formik = useFormik<any>({
    initialValues: {
      country: '',
      isBill: false,
      resource_type: '',
      area_code: '',
      phoneNumber: '',

      searched: false,
      numbers: [],
      submitting: false
    },
    validationSchema: yup.object().shape({
      isBill: yup.boolean().required(),
      resource_type: yup.string().required(),
      area_code: yup.string(),
      phoneNumber: yup.string().nullable().when('searched', {
        is: true,
        then: yup.string().required()
      }),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      formik.setFieldValue('submitting', true);

      if(formik.values.searched){
        void api.post('campaign/add-number', {
          affiliates: [
            {
              phoneNumber: values.phoneNumber,
              affiliateId : affiliate.affiliateId,
            }
          ],
          workflowSid: affiliate.workflowSid
        })
        .then(() => {
          formik.setFieldValue('submitting', false);
          NotificationManager.success('Number has been added to the publisher');
          props.requestClose();
        });
      }else{
        void api.get('numbers/search', {
          params: {
            resource_type: values.resource_type,
            area_code: values.area_code
          }
        })
        .then((res) => {
          if(res.data.length === 0){
            NotificationManager.warning(`
              There is no available number.
              Try again after change parameters
            `);
          }else{
            formik.setFieldValue('searched', true);
          }
          formik.setFieldValue('numbers', res.data);
          formik.setFieldValue('submitting', false);
        });
      }
    },
  });

  const initNumbers = ():void => {
    formik.setFieldValue('phoneNumber', '');
    formik.setFieldValue('searched', false);
    formik.setFieldValue('numbers', []);
  }

  return (
    <div className="py-8">
      <InlineSwitch
        label="Create New United States Number"
        onChange={() => false}
        checked={false}
        error={''}
        tooltip="Enable this to create a new number"
        disabled
        className="mb-5"
        mdLabel="3"
        mdInput="9"
      />
      <InlineBoxSelect
        label="Number Type"
        options={[
          {
            label: 'Toll Free',
            value: 'tollfree'
          },
          {
            label: 'Local',
            value: 'local'
          },
        ]}
        value={formik.values.resource_type}
        onChange={(value) => {
          formik.setFieldValue('resource_type', value);
          initNumbers();
        }}
        error={formik.errors.resource_type}
        tooltip={`
          Choose the number type
          <br>
          <br>
          TollFree: Only use Toll Free numbers. 
          <br>
          Notice that Toll Free numbers have higher per-minute charges than local phone numbers
          <br>
          <br>
          Local: Only use Local numbers.
        `}
        className="mb-5"
        mdLabel="3"
        mdInput="9"
      />
      <InlineNumberInput
        label="Prefix"
        placeholder="Optional"
        value={formik.values.area_code}
        onChange={(value) => {
          formik.setFieldValue('area_code', value);
          initNumbers();
        }}
        min={0}
        integer
        error={formik.errors.area_code}
        tooltip="Entering '212' will make MGL only select phone numbers with the prefix '212'."
        width="sm"
        className="mb-5"
        mdLabel="3"
        mdInput="9"
      />
      <InlineSwitch
        label="Bill Card"
        onChange={(checked) => formik.setFieldValue('isBill', checked)}
        checked={formik.values.isBill}
        error={formik.errors.isBill}
        tooltip="
          If your account balance is not enough to complete this allocation,
          we will bill your default credit card instead.
        "
        className="mb-5"
        mdLabel="3"
        mdInput="9"
      />
      {formik.values.numbers.length > 0 &&
        <InlineReactSelect
          label="Phone Number"
          placeholder="Select Number"
          value={formik.values.phoneNumber}
          options={formik.values.numbers.map((el, key) => ({
            label: el.phoneNumber,
            value: key
          }))}
          onChange={(value) => formik.setFieldValue('phoneNumber', formik.values.numbers[value])}
          error={formik.errors.phoneNumber}
          tooltip="Pick one among searched numbers."
          className="mb-5"
          mdLabel="3"
          mdInput="9"
        />
      }

      <div className="row mt-8">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button
            className="w-40 mr-4"
            onClick={() => formik.handleSubmit()}
            loading={formik.values.submitting}
          >
            {
              formik.values.searched ? 'ADD' : 'SEARCH NUMBERS'
            }
          </Button>
          <Button outlined onClick={() => props.requestClose()}>CANCEL</Button>
        </div>
      </div>
    </div>
  );
};

// in call tracking tags
const AddCallTrackingTag: React.FunctionComponent<any> = (props) => {
  const affiliateNumbers = props.affiliateNumbers.map((el) => ({
    label: el.phoneNumber,
    value: el.id
  }));

  const formik = useFormik<any>({
    initialValues: {
      name: '',
      number: '',
      replace: '',
      captureUserData: false,
      pool: '',

      submitting: false
    },
    validationSchema: yup.object().shape({
      name: yup.string().required(),
      number: yup.string().required(),
      replace: yup.string().required(),
      captureUserData: yup.boolean().required(),
      pool: yup.string().when('captureUserData', {
        is: true,
        then: yup.string().required()
      }),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      formik.setFieldValue('submitting', true);
    },
  });

  return (
    <div className="py-8">
      <InlineTextInput
        label="Name"
        placeholder="Tag Name"
        value={formik.values.name}
        onChange={(value) => formik.setFieldValue('name', value)}
        error={formik.errors.name}
        tooltip="The name associated with the Tag, used for reporting purposes"
        borderUnderline
        className="mb-5"
        mdLabel="3"
        mdInput="9"
      />
      <InlineReactSelect
        label="Primary Number"
        placeholder="Select Publisher Number"
        value={formik.values.number}
        options={affiliateNumbers}
        onChange={(value) => formik.setFieldValue('number', value)}
        error={formik.errors.number}
        tooltip="
          The number displayed when the tag is used on a website.
          If Capture User Data is enabled,
          this number will be only used once all the available numbers in the pool are exhuasted.
        "
        className="mb-5"
        mdLabel="3"
        mdInput="9"
      />
      <InlinePhoneInput
        label="Number to Replace"
        placeholder="+"
        value={formik.values.replace}
        onChange={(value) => formik.setFieldValue('replace', value)}
        error={formik.errors.replace}
        tooltip="The phone number in the page content, that will be replaced with the MGL tracking number"
        className="mb-5"
        mdLabel="3"
        mdInput="9"
      />
      <InlineSwitch
        label="Capture User Data"
        onChange={(checked) => formik.setFieldValue('captureUserData', checked)}
        checked={formik.values.captureUserData}
        error={formik.errors.captureUserData}
        tooltip="Capture all available information about users that view this tag."
        className="mb-5"
        mdLabel="3"
        mdInput="9"
      />
      {formik.values.captureUserData &&
        <InlineReactSelect
          label="Number Pool"
          placeholder="Select Number Pool"
          value={formik.values.pool}
          options={[]}
          onChange={(value) => formik.setFieldValue('pool', value)}
          error={formik.errors.pool}
          tooltip="When Capture User Data is enabled, the Number pool will be used to track users' calls in real-time."
          className="mb-5"
          mdLabel="3"
          mdInput="9"
        />
      }

      <div className="row mt-8">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button
            className="w-40 mr-4"
            onClick={() => formik.handleSubmit()}
            loading={formik.values.submitting}
          >
            GENERATE
          </Button>
          <Button outlined onClick={() => props.requestClose()}>CANCEL</Button>
        </div>
      </div>
    </div>
  );
};

// in call routing
const EditCallRoute: React.FunctionComponent<any> = (props) => {
  const { loading, data, refetch } = useQuery(GET_ROUTE, {
    variables: { id: props.id },
  });

  if(loading) return <></>;

  return (
    <EditCallRouteContent
      route={data.route}
      requestClose={() => {
        void refetch();
        props.requestClose();
      }}
    />
  )
}

const EditCallRouteContent: React.FunctionComponent<any> = (props) => {
  const router = useRouter()
  const campaignId = router.query.id;
  const route = props.route;
  console.log('route', route);

  const formik = useFormik({
    initialValues: {
      id: route.id,
      targetName: route.callTarget.name,

      priority: route.priority.priority,
      weight: route.priority.weight,

      conversionType: route.conversionSettings[0].conversionType,
      conversionValue: route.conversionSettings[0].conversionValue,  // not used
      payoutValue: route.conversionSettings[0].payoutValue,

      secondsFromLastCall:
        route.conversionSettings[0].deDupeSetting.secondsFromLastCall > 0
          ? null
          : route.conversionSettings[0].deDupeSetting.secondsFromLastCall,
      days: getDaysHours(route.conversionSettings[0].deDupeSetting.secondsFromLastCall).days,
      hours: getDaysHours(route.conversionSettings[0].deDupeSetting.secondsFromLastCall).hours,

      submitting: false
    },
    validationSchema: yup.object().shape({
      priority: yup.string().required(),
      weight: yup.string().required(),
      conversionType: yup.string().required(),
      payoutValue: yup.number().required(),

      days: yup.number().when('secondsFromLastCall', {
        is: null,
        then: yup.number().required()
      }),
      hours: yup.number().when('secondsFromLastCall', {
        is: null,
        then: yup.number().required()
      }),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      formik.setFieldValue('submitting', true);
      void api.post('campaign/update-route', {
        campaignId,
        callRouteId: values.id,
        priority: values.priority,
        weight: values.weight,
        conversionType: values.conversionType,
        conversionValue: values.conversionValue,
        payoutValue: values.payoutValue,
        secondsFromLastCall:
          (values.secondsFromLastCall === 0 || values.secondsFromLastCall === -1)
            ? values.secondsFromLastCall
            : getSeconds(values.days, values.hours)
      })
      .then(() => {
        formik.setFieldValue('submitting', false);
        NotificationManager.success('Call route has been updated');
        props.requestClose();
      });
    }
  });

  console.log('initial...', formik.values);

  return (
    <div className="py-8">
      <InlineText
        label="Name"
        value={formik.values.targetName}
        tooltip="The name of the target that will be added to your campaign"
        className="mb-5"
        mdLabel="4"
        mdInput="8"
      />
      <InlineNumberInput
        label="Priority"
        placeholder=""
        value={formik.values.priority}
        onChange={(value) => formik.setFieldValue('priority', value)}
        error={formik.errors.priority}
        tooltip="The priority that MGL will select available targets. 1 is the highest priority."
        min={0}
        integer
        width="sm"
        className="mb-5"
        mdLabel="4"
        mdInput="8"
      />
      <InlineNumberInput
        label="Weight"
        placeholder=""
        value={formik.values.weight}
        onChange={(value) => formik.setFieldValue('weight', value)}
        error={formik.errors.weight}
        tooltip="
          If you have 2 targets with the same priority,
          weight will be used to balance the routing between the targets.
          Weights are relative values. Example: 2 Targets with a weight of 10 will each receiven 50% of the calls.
        "
        min={0}
        integer
        width="sm"
        className="mb-5"
        mdLabel="4"
        mdInput="8"
      />
      <InlineSelect
        label="Convert On"
        placeholder="Select Conversion Type"
        value={formik.values.conversionType}
        onChange={(value) => formik.setFieldValue('conversionType', value)}
        options={[
          {
            label: 'Call Length',
            value: 'CALL_LENGTH'
          },
          {
            label: 'Call Successfully Connected',
            value: 'CALL_SUCCESSFULLY_CONNECTED'
          },
          {
            label: 'Postback/Webhook',
            value: 'POSTBACK/WEBHOOK'
          },
          {
            label: 'Dialed',
            value: 'DIALED'
          },
        ]}
        error={formik.errors.conversionType}
        tooltip="A conversion will be triggered when the selected event happens."
        className="mb-5"
        mdLabel="4"
        mdInput="8"
      />
      <InlineNumberInput
        label="Revenue($)"
        placeholder=""
        value={formik.values.payoutValue}
        onChange={(value) => formik.setFieldValue('payoutValue', value)}
        error={formik.errors.payoutValue}
        tooltip="The amount of money generated when this call is received"
        min={0}
        integer
        width="sm"
        className="mb-5"
        mdLabel="4"
        mdInput="8"
      />
      <InlineBoxSelect
        label="Duplicate Conversions"
        value={formik.values.secondsFromLastCall}
        onChange={(value) => formik.setFieldValue('secondsFromLastCall', value)}
        options={[
          {
            label: 'Disable',
            value: -1
          },
          {
            label: 'Enable',
            value: 0
          },
          {
            label: 'Time Limit',
            value: null
          }
        ]}
        error={formik.errors.secondsFromLastCall}
        tooltip="Configure how MGL will handle and credit duplicate conversions."
        className="mb-5"
        mdLabel="4"
        mdInput="8"
      />
      {(formik.values.secondsFromLastCall > 0 || formik.values.secondsFromLastCall === null) &&
        <div className="row mb-5">
          <div className="flex col-md-8 col-md-offset-4">
            <div className="flex items-center mr-8">
              <NumberInput
                min={0}
                value={formik.values.days}
                onChange={(value) => formik.setFieldValue('days', value)}
                error={formik.errors.days}
                width="xs"
              />
              <label className="ml-2">Days</label>
            </div>
            <div className="flex items-center mr-8">
              <NumberInput
                min={0}
                value={formik.values.hours}
                onChange={(value) => formik.setFieldValue('hours', value)}
                error={formik.errors.hours}
                width="xs"
              />
              <label className="ml-2">Hours</label>
            </div>
          </div>
        </div>
      }
      <div className="row mt-8">
        <div className="col-md-4"></div>
        <div className="col-md-8">
          <Button
            className="w-32 mr-4"
            loading={formik.values.submitting}
            onClick={() => formik.handleSubmit()}
          >
            UPDATE
          </Button>
          <Button outlined onClick={() => props.requestClose()}>CANCEL</Button>
        </div>
      </div>
    </div>
  );
}

// in url parameters
const AddUrlParameters: React.FunctionComponent<any> = (props) => {
  const formik = useFormik<any>({
    initialValues: {
      urlParameter: '',

      createNew: false,
      name: '',
      reportingMenuName: '',
      reportName: '',

      submitting: false
    },
    validationSchema: yup.object().shape({
      urlParameter: yup.string().when('createNew', {
        is: false,
        then: yup.string().required()
      }),

      name: yup.string().when('createNew', {
        is: true,
        then: yup.string().required()
      }),
      reportingMenuName: yup.string().when('createNew', {
        is: true,
        then: yup.string().required()
      }),
      reportName: yup.string().when('createNew', {
        is: true,
        then: yup.string().required()
      }),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      formik.setFieldValue('submitting', true);
    },
  });

  return (
    <div className="py-8">
      <InlineBoxSelect
        label="Choose Option"
        value={formik.values.createNew}
        onChange={(value) => formik.setFieldValue('createNew', value)}
        options={[
          {
            label: 'Select Existing',
            value: false
          },
          {
            label: 'Create New',
            value: true
          }
        ]}
        tooltip="Choose to link an existing URL parameter or create a new one."
        fixWidth
        className="mb-5"
        mdLabel="3"
        mdInput="9"
      />
      {
        !formik.values.createNew
          ? (
            <InlineReactSelect
              label="URL Parameter"
              placeholder="Select URL Parameter"
              value={formik.values.urlParameter}
              options={[]}
              onChange={(value) => formik.setFieldValue('urlParameter', value)}
              error={formik.errors.urlParameter}
              tooltip="Select an existing URL parameter to link to this Campaign"
              className="mb-5"
              mdLabel="3"
              mdInput="9"
            />
          )
          : (
            <>
              <InlineTextInput
                label="URL Parameter"
                value={formik.values.name}
                onChange={(value) => formik.setFieldValue('name', value)}
                error={formik.errors.name}
                tooltip="The URL parameter you'd like MGL to tag"
                borderUnderline
                className="mb-5"
                mdLabel="3"
                mdInput="9"
              />
              <InlineTextInput
                label="Reporting Menu Name"
                value={formik.values.reportingMenuName}
                onChange={(value) => formik.setFieldValue('reportingMenuName', value)}
                error={formik.errors.reportingMenuName}
                tooltip="The Menu Option in Reporting under the Tags menu where you can find this data"
                borderUnderline
                className="mb-5"
                mdLabel="3"
                mdInput="9"
              />
              <InlineTextInput
                label="Report Name"
                value={formik.values.reportName}
                onChange={(value) => formik.setFieldValue('reportName', value)}
                error={formik.errors.reportName}
                tooltip="The name of the report that will show up in your Menu name"
                borderUnderline
                className="mb-5"
                mdLabel="3"
                mdInput="9"
              />
            </>
          )
      }

      <div className="row mt-8">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button
            className="w-40 mr-4"
            onClick={() => formik.handleSubmit()}
            loading={formik.values.submitting}
          >
            {
              formik.values.createNew ? 'CREATE' : 'ADD'
            }
          </Button>
          <Button outlined onClick={() => props.requestClose()}>CANCEL</Button>
        </div>
      </div>
    </div>
  );
};

// in tracking pixels
const AddTrackingPixels: React.FunctionComponent<any> = (props) => {
  const contentTypes = [
    {
      label: 'application/json',
      value: 'application/json'
    },
    {
      label: 'application/xml',
      value: 'application/xml'
    }
  ];

  const formik = useFormik<any>({
    initialValues: {
      pixel: '',

      createNew: false,
      name: '',
      eventType: '',
      url: '',

      enablePostPixel: false,
      contentType: '',
      body: '',
      headers: [],
      criteria: {
        data: {
          tagRoutableRule: {
            data: []
          }
        }
      },

      submitting: false
    },
    validationSchema: yup.object().shape({
      pixel: yup.string().when('createNew', {
        is: false,
        then: yup.string().required()
      }),

      name: yup.string().when('createNew', {
        is: true,
        then: yup.string().required()
      }),
      eventType: yup.string().when('createNew', {
        is: true,
        then: yup.string().required()
      }),
      url: yup.string().when('createNew', {
        is: true,
        then: yup.string().required()
      }),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      formik.setFieldValue('submitting', true);
    },
  });
  const [errors] = useState({
    criteria: ''
  });

  return (
    <div className="py-8">
      <InlineBoxSelect
        label="Choose Option"
        value={formik.values.createNew}
        onChange={(value) => formik.setFieldValue('createNew', value)}
        options={[
          {
            label: 'Select Existing',
            value: false
          },
          {
            label: 'Create New',
            value: true
          }
        ]}
        tooltip=""
        fixWidth
        className="mb-5"
        mdLabel="3"
        mdInput="9"
      />
      {
        !formik.values.createNew
          ? (
            <InlineReactSelect
              label="Pixel"
              placeholder="Select Pixel"
              value={formik.values.pixel}
              options={[]}
              onChange={(value) => formik.setFieldValue('pixel', value)}
              error={formik.errors.pixel}
              className="mb-5"
              mdLabel="3"
              mdInput="9"
            />
          )
          : (
            <>
              <InlineTextInput
                label="Name"
                value={formik.values.name}
                onChange={(value) => formik.setFieldValue('name', value)}
                error={formik.errors.name}
                tooltip="Enter a name for the pixel for your future reference."
                borderUnderline
                className="mb-5"
                mdLabel="3"
                mdInput="9"
              />
              <InlineSelect
                label="Fire Pixel On"
                placeholder="Choose Event Type"
                value={formik.values.eventType}
                options={[]}
                onChange={(value) => formik.setFieldValue('eventType', value)}
                error={formik.errors.eventType}
                tooltip="Choose the event that will trigger your postback."
                className="mb-5"
                mdLabel="3"
                mdInput="9"
              />
              <InlineTextInput
                label="URL"
                placeholder="http://"
                value={formik.values.url}
                onChange={(value) => formik.setFieldValue('url', value)}
                error={formik.errors.url}
                tooltip="MGL will fire this URL based on your configuration choices."
                width="full"
                className="mb-5"
                mdLabel="3"
                mdInput="6"
              />
              <InlineSwitch
                label="Enable POST Pixel"
                onChange={(checked) => formik.setFieldValue('enablePostPixel', checked)}
                checked={formik.values.enablePostPixel}
                error={formik.errors.enablePostPixel}
                tooltip="If this option is enabled, HTTP POST will be used to send the pixel."
                className="mb-5"
                mdLabel="3"
                mdInput="9"
              />

              {formik.values.enablePostPixel &&
                <>
                  <InlineSelect
                    label="Content Type"
                    placeholder="Choose Type"
                    value={formik.values.contentType}
                    options={contentTypes}
                    onChange={(value) => formik.setFieldValue('contentType', value)}
                    error={formik.errors.contentType}
                    tooltip="The content type of the body"
                    className="mb-5"
                    mdLabel="3"
                    mdInput="9"
                  />
                  <InlineTextInput
                    label="Body"
                    value={formik.values.body}
                    onChange={(value) => formik.setFieldValue('body', value)}
                    error={formik.errors.body}
                    tooltip="The body of the POST request that will be fired"
                    width="full"
                    className="mb-5"
                    mdLabel="3"
                    mdInput="6"
                  />
                  <ItemsInput
                    label="Headers"
                    placeholderName="Header name"
                    placeholderValue="value"
                    value={formik.values.headers}
                    onChange={(value) => formik.setFieldValue('headers', value)}
                    error={formik.errors.headers}
                    tooltip="Any additional headers to be used on the request"
                    className="mb-5"
                    mdLabel="3"
                    mdInput="6"
                    btnLabel="ADD HEADER"
                  />
                </>
              }

              <div className="relative w-full flex flex-wrap justify-center mt-8">
                <div className="md:w-9/12 w-full">
                  <WidgetPannel
                    title="Tag Filters"
                    paddingTop={4}
                    headerLeft={
                      errors.criteria !== ''
                        ? (
                          <p className="text-xs text-red-500 m-0">{errors.criteria}</p>
                        )
                        : ''
                    }
                    headerRight={
                      formik.values.criteria.data.tagRoutableRule.data.length ?
                        <Button
                          outlined
                          leftIcon="Minus"
                          size="xs"
                          color="red"
                          className="px-4"
                          onClick={() => {
                            formik.setFieldValue('criteria', {
                              data: {
                                tagRoutableRule: {
                                  data: []
                                }
                              }
                            });
                          }}
                        >
                          REMOVE FILTERS
                        </Button>
                      :
                        ''
                    }
                    tooltip="Specify Tag Filters to give payout only if the call satisfies the filters."
                  >
                    <TagRoutingFilters
                      value={formik.values.criteria}
                      onChange={(value) => formik.setFieldValue('criteria', value)}
                    />
                  </WidgetPannel>
                </div>
              </div>
            </>
          )
      }

      <div className="row mt-8">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button
            className="w-40 mr-4"
            onClick={() => formik.handleSubmit()}
            loading={formik.values.submitting}
          >
            {
              formik.values.createNew ? 'CREATE' : 'ADD'
            }
          </Button>
          <Button outlined onClick={() => props.requestClose()}>CANCEL</Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
