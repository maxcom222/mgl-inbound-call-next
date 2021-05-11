import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { NotificationManager } from 'react-notifications';

import api from 'shared/utils/api';
import Layout from 'layouts';
import Widget from 'components/widget';
import WidgetPannel from 'components/widget-pannel';
import timezoneOptions from 'json/timezones.json';
import {
  InlineTextInput,
  InlineNumberInput,
  InlinePhoneInput,
  InlineReactSelect,
  InlineTextSwitch,
  InlineBoxSelect
} from 'components/forms/inline-inputs';
import TagRoutingFilters from 'components/tag-routing-filters';
import OpenCloseHours from 'components/open-close-hours';
import {VIEW_OWNERS} from 'shared/queries/owners';
import {GET_TARGET} from 'shared/queries/targets';
import { Button } from 'components/buttons';

const timezones = timezoneOptions.map((el) => ({
  label: el.text,
  value: el.value
}));

const Index: React.FunctionComponent<any> = () => {
  const router = useRouter();
  const { id } = router.query;

  const {loading: loadingOwners, data: ownersData} = useQuery(VIEW_OWNERS);
  const {loading: loadingTarget, data: targetData} = useQuery(GET_TARGET, {
    variables: { id },
  });

  if(
    loadingOwners ||
    loadingTarget
  ) return <></>;

  return (
    <PageContent
      id={id} target={targetData.target}
      owners={ownersData.buyers.map((el) => ({
        label: el.name,
        value: el.id.toString()
      }))}
      router={router}
    />
  );
};

const PageContent: React.FunctionComponent<any> = (props) => {
  const target = props.target;
  const router = props.router;
  const owners = props.owners;

  const [errors, setErrors] = useState({
    criteria: ''
  });

  const formik = useFormik({
    initialValues: {
      workerSid: target.workerSid,
      name: target.name,
      subId: target.subId,
      ownerId: target.owner !== null ? target.owner.id : null,

      instructionId: target.instructions.id,
      callType: target.instructions.callType,
      _number: target.instructions.number,
      connectionTimeOut: target.instructions.connectionTimeOut,
      timeZoneId: target.schedule.timeZoneId,

      scheduleId: 0,
      allTimeCap: target.schedule.allTimeCap,
      monthlyCap: target.schedule.monthlyCap,
      dailyCap: target.schedule.dailyCap,
      hourlyCap: target.schedule.hourlyCap,
      concurrencyCap: target.schedule.concurrencyCap,

      hoursOfOperation: {
        data: target.schedule.hoursOfOperation.map((el) => ({
          openTime: {
            data: {
              hour: el.openTime.hour,
              minute: el.openTime.minute
            }
          },
          closeTime: {
            data: {
              hour: el.closeTime.hour,
              minute: el.closeTime.minute
            }
          },
          inverted: el.inverted,
          isClosed: el.isClosed
        }))
      },

      criteria: {
        data: {
          tagRoutableRule: {
            data:
              (
                target.criteria !== null &&
                target.criteria.length > 0 &&
                typeof target.criteria[0].tagRoutableRule !== 'undefined' &&
                target.criteria[0].tagRoutableRule.length > 0 &&
                target.criteria[0].tagRoutableRule[0].tagCriteria.length > 0
              )
                ? target.criteria[0].tagRoutableRule.map((el) => (
                  {
                    tagCriteria: {
                      data: el.tagCriteria.map((ell) => ({
                        comparisonType: ell.comparisonType,
                        isNegativeMatch: ell.isNegativeMatch,
                        isNumber: ell.isNumber,
                        tagId: ell.tagId,
                        tagIds: ell.tagIds,
                        value: ell.value
                      }))
                    }
                  }
                ))
                : []
          }
        }
      },

      enabled: false,

      submitting: false
    },
    validationSchema: yup.object().shape({
      name: yup.string().required(),
      subId: yup.string().required(),
      ownerId: yup.string().required(),
      _number: yup.string().required(),
      connectionTimeOut: yup.string().required(),
      timeZoneId: yup.string().required(),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      if(validateCriteria(values.criteria)){
        const newTarget = {
          workerSid: values.workerSid,
          targetGroupId: '',
          name: values.name,
          instructions: {
            data: {
              connectionTimeOut: values.connectionTimeOut,
              callType: values.callType,
              number: values._number
            }
          },
          isHighRateTarget: false,
          subId: values.subId,
          targetCallIncrement: 'onConvert',
          conversionTimerOffset: 0,
          schedule: {
            data: {
              concurrencyCap: values.concurrencyCap,
              timeZoneId: values.timeZoneId,
              allTimeSumCap: -1,
              monthlySumCap: -1,
              dailySumCap: -1,
              hourlySumCap: -1,
              allTimeCap: values.allTimeCap,
              monthlyCap: values.monthlyCap,
              dailyCap: values.dailyCap,
              hourlyCap: values.hourlyCap,

              hoursOfOperation: values.hoursOfOperation
            }
          },
          criteria: values.criteria,
          accountId: 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0',
          ownerId: values.ownerId,
          enabled: true
        };
        console.log('submitting: ', JSON.stringify(newTarget));
        formik.setFieldValue('submitting', true);
        api
          .post(`target/update`, newTarget)
          .then((res) => {
            console.log('-----res', res);
            formik.setFieldValue('submitting', false);
            NotificationManager.success('Target has been updated');
            router.push('/targets');
          })
          .catch(() => {
            formik.setFieldValue('submitting', false);
            NotificationManager.error('Operation faild');
          });;
      }else{
        setErrors({...errors, criteria: 'Routing Filters need to be finished'});
      }
    }
  });

  const validateCriteria = (criteria):boolean => {
    let valid = true;

    criteria.data.tagRoutableRule.data.map((el) => {
      el.tagCriteria.data.map((tagCriteria) => {
        if(tagCriteria.tagId === null || tagCriteria.value === '') valid = false;
      });
    });

    return valid;
  }

  console.log('formik', formik.values);

  return(
    <Layout>
      <Widget title={formik.values.name}>
        <WidgetPannel title="Main Info">
          <InlineTextInput
            label="Name"
            value={formik.values.name}
            onChange={(value) => formik.setFieldValue('name', value)}
            error={formik.errors.name}
            tooltip="
              Your target name will be used to display information around the MGL portal.
              Short target names work best.
            "
            borderUnderline
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          <InlineTextInput
            label="Sub ID"
            value={formik.values.subId}
            onChange={(value) => formik.setFieldValue('subId', value)}
            error={formik.errors.subId}
            tooltip="Your target's tracking subid"
            borderUnderline
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          <InlineReactSelect
            label="Buyer"
            options={owners}
            value={formik.values.ownerId}
            onChange={(value) => formik.setFieldValue('ownerId', value)}
            error={formik.errors.ownerId}
            tooltip="The Buyer that owns this target (optional)"
            className="mb-8"
            mdLabel="3"
            mdInput="9"
            />
          <InlineBoxSelect
            label="Type"
            value={formik.values.callType}
            onChange={(value) => formik.setFieldValue('callType', value)}
            options={[
              {
                label: 'Number',
                value: 'number'
              },
              {
                label: 'SIP',
                value: 'sip'
              },
            ]}
            tooltip="
              Select either a phone number or SIP endpoint to route your calls to this target.
            "
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          <InlinePhoneInput
            label="Number"
            placeholder="+12345678910"
            type="number"
            value={formik.values._number}
            onChange={(value) => formik.setFieldValue('_number', value)}
            error={formik.errors._number}
            tooltip="
              Phone numbers should follow this format:
              +(country code) (phone number).
              US Example: +12223334444
            "
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          <InlineNumberInput
            label="Connection Timeout"
            placeholder=""
            value={formik.values.connectionTimeOut}
            onChange={(value) => formik.setFieldValue('connectionTimeOut', value)}
            error={formik.errors.connectionTimeOut}
            tooltip="
              If this target does not answer a call within the specified period of time,
              re-route the call to another target."
            min={0}
            integer
            width="sm"
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          <InlineReactSelect
            label="TimeZone"
            options={timezones}
            value={formik.values.timeZoneId}
            onChange={(value) => formik.setFieldValue('timeZoneId', value)}
            error={formik.errors.timeZoneId}
            tooltip="Select the Timezone that this target operates in. All caps operate based on this timezone."
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          <OpenCloseHours
            label="Hours of Operation"
            value={formik.values.hoursOfOperation}
            onChange={(value) => formik.setFieldValue('hoursOfOperation', value)}
            tooltip="Set your target's hours of operation. For weekly schedule use advanced settings."
          />
        </WidgetPannel>
        <WidgetPannel title="Cap Settings">
          <InlineTextSwitch
            label="Global Call Cap"
            value={formik.values.allTimeCap}
            unsetValue={-1}
            onChange={(value) => formik.setFieldValue('allTimeCap', value !== '' ? Number(value) : null)}
            error={formik.errors.allTimeCap}
            tooltip="Calls will route to this target until the global call cap is reached."
            type="number"
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          <InlineTextSwitch
            label="Monthly Cap"
            value={formik.values.monthlyCap}
            unsetValue={-1}
            onChange={(value) => formik.setFieldValue('monthlyCap', value !== '' ? Number(value) : null)}
            error={formik.errors.monthlyCap}
            tooltip="Calls will route to this target until the monthly call cap is reached."
            type="number"
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          <InlineTextSwitch
            label="Daily Cap"
            value={formik.values.dailyCap}
            unsetValue={-1}
            onChange={(value) => formik.setFieldValue('dailyCap', value !== '' ? Number(value) : null)}
            error={formik.errors.dailyCap}
            tooltip="Calls will route to this target until the daily call cap is reached."
            type="number"
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          <InlineTextSwitch
            label="Hourly Cap"
            value={formik.values.hourlyCap}
            unsetValue={-1}
            onChange={(value) => formik.setFieldValue('hourlyCap', value !== '' ? Number(value) : null)}
            error={formik.errors.hourlyCap}
            tooltip="Calls will route to this target until the hourly call cap is reached."
            type="number"
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
        </WidgetPannel>
        <WidgetPannel
          title="Concurrency Settings"
          tooltip="Configure maximum count of simultaneous live calls for this target."
        >
          <InlineTextSwitch
            label="Max Concurrency"
            value={formik.values.concurrencyCap}
            unsetValue={-1}
            onChange={(value) => formik.setFieldValue('concurrencyCap', value !== '' ? Number(value) : null)}
            error={formik.errors.concurrencyCap}
            tooltip="
              Calls will route to this target until the maximum concurrency limit is reached.
              When a call is completed, calls will continue to route to this target.
            "
            type="number"
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
        </WidgetPannel>
        <WidgetPannel
          title="Tag Routing Filters"
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
          tooltip="Configure Tag Routing Filters to specify which calls can be routed to this Target."
        >
          <div className="relative w-full flex flex-wrap justify-center">
            <div className="md:w-9/12 w-full">
              <TagRoutingFilters
                value={formik.values.criteria}
                onChange={(value) => formik.setFieldValue('criteria', value)}
              />
            </div>
          </div>
        </WidgetPannel>
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-9">
            <Button
              loading={formik.values.submitting}
              onClick={() => formik.handleSubmit()}
            >
              UPDATE TARGET
            </Button>
          </div>
        </div>
      </Widget>
    </Layout>
  );
}

export default Index;
