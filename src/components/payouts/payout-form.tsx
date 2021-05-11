import React, {useState} from 'react';

import WidgetPannel from 'components/widget-pannel';
import OpenCloseHours from 'components/open-close-hours';
import {
  InlineNumberInput,
  InlineSelect,
  InlineReactSelect,
  InlineSwitch,
  InlineTextSwitch,
  InlineBoxSelect
} from 'components/forms/inline-inputs';
import timezoneOptions from 'json/timezones.json';
import {Button} from 'components/buttons';
import TagRoutingFilters from 'components/tag-routing-filters';
import {useFormik} from 'formik';
import * as yup from 'yup';
import { NumberInput } from 'components/forms/text-inputs';
import {getDaysHours, getSeconds} from 'functions/time';

const timezones = timezoneOptions.map((el) => ({
  label: el.text,
  value: el.value
}));

const PayoutForm: React.FunctionComponent<any> = (props) => {
  const [errors, setErrors] = useState({
    criteria: ''
  });

  const initialValues = (
    {
      ...props.value,

      secondsFromLastCall: props.value.deDupeSetting.secondsFromLastCall > 0
        ? null
        : props.value.deDupeSetting.secondsFromLastCall,
      days: getDaysHours(props.value.deDupeSetting.secondsFromLastCall).days,
      hours: getDaysHours(props.value.deDupeSetting.secondsFromLastCall).hours,

      setRevsharePayoutLimits: false,
      minPayoutLimit: 0,
      maxPayoutLimit: 0,

      limitPayout:
        ![
          props.value.schedule.allTimeCap,
          props.value.schedule.allTimeSumCap,
          props.value.schedule.monthlyCap,
          props.value.schedule.monthlySumCap,
          props.value.schedule.dailyCap,
          props.value.schedule.dailySumCap,
          props.value.schedule.hourlyCap,
          props.value.schedule.hourlySumCap,
          props.value.schedule.concurrencyCap
        ].every((el) => el === -1),
      ...props.value.schedule,

      hoursOfOperation: {
        data: props.value.schedule.hoursOfOperation.map((el) => ({
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
                props.value.criteria !== null &&
                props.value.criteria.length > 0 &&
                typeof props.value.criteria[0].tagRoutableRule !== 'undefined' &&
                props.value.criteria[0].tagRoutableRule.length > 0 &&
                props.value.criteria[0].tagRoutableRule[0].tagCriteria.length > 0
              )
                ? props.value.criteria[0].tagRoutableRule.map((el) => (
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
      }
    }
  );

  delete initialValues.schedule;
  delete initialValues.deDupeSetting;

  const formik = useFormik({
    initialValues,
    validationSchema: yup.object().shape({
      payoutType: yup.string().required(),
      payoutValue: yup.number().required(),
      conversionType: yup.string().when('payoutType', {
        is: 'FIXED_AMOUNT',
        then: yup.string().required()
      }),

      days: yup.number().when('secondsFromLastCall', {
        is: null,
        then: yup.number().required()
      }),
      hours: yup.number().when('secondsFromLastCall', {
        is: null,
        then: yup.number().required()
      }),

      minPayoutLimit: yup.number().when('setRevsharePayoutLimits', {
        is: true,
        then: yup.number().required()
      }),
      maxPayoutLimit: yup.number().when('setRevsharePayoutLimits', {
        is: true,
        then: yup.number().required()
      }),

      timeZoneId: yup.string().required(),

      allTimeCap: yup.number().when('limitPayout', {
        is: true,
        then: yup.number().required()
      }),
      allTimeSumCap: yup.number().when('limitPayout', {
        is: true,
        then: yup.number().required()
      }),
      monthlyCap: yup.number().when('limitPayout', {
        is: true,
        then: yup.number().required()
      }),
      monthlySumCap: yup.number().when('limitPayout', {
        is: true,
        then: yup.number().required()
      }),
      dailyCap: yup.number().when('limitPayout', {
        is: true,
        then: yup.number().required()
      }),
      dailySumCap: yup.number().when('limitPayout', {
        is: true,
        then: yup.number().required()
      }),
      hourlyCap: yup.number().when('limitPayout', {
        is: true,
        then: yup.number().required()
      }),
      hourlySumCap: yup.number().when('limitPayout', {
        is: true,
        then: yup.number().required()
      }),
      concurrencyCap: yup.number().when('limitPayout', {
        is: true,
        then: yup.number().required()
      }),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      if(validateCriteria(values.criteria)){
        setErrors({...errors, criteria: ''});
        const newValue = {
          ...values,

          deDupeSetting: {
            secondsFromLastCall:
              (values.secondsFromLastCall === 0 || values.secondsFromLastCall === -1)
                ? values.secondsFromLastCall
                : getSeconds(values.days, values.hours)
          },

          criteria: [
            {
              tagRoutableRule: values.criteria.data.tagRoutableRule.data.map((el) => ({
                tagCriteria: el.tagCriteria.data
              }))
            }
          ],

          schedule: {
            allTimeCap: values.allTimeCap,
            allTimeSumCap: values.allTimeSumCap,
            monthlyCap: values.monthlyCap,
            monthlySumCap: values.monthlySumCap,
            dailyCap: values.dailyCap,
            dailySumCap: values.dailySumCap,
            hourlyCap: values.hourlyCap,
            hourlySumCap: values.hourlySumCap,
            concurrencyCap: values.concurrencyCap,

            timeZoneId: values.timeZoneId,

            hoursOfOperation: values.hoursOfOperation.data.map((el) => ({
              openTime: el.openTime.data,
              closeTime: el.closeTime.data,
              inverted: el.inverted,
              isClosed: el.isClosed
            }))
          },
        };

        delete newValue.id;
        delete newValue.hoursOfOperation;
        delete newValue.secondsFromLastCall;
        delete newValue.allTimeCap;
        delete newValue.allTimeSumCap;
        delete newValue.monthlyCap;
        delete newValue.monthlySumCap;
        delete newValue.dailyCap;
        delete newValue.dailySumCap;
        delete newValue.hourlyCap;
        delete newValue.hourlySumCap;
        delete newValue.concurrencyCap;
        delete newValue.timeZoneId;
        delete newValue.days;
        delete newValue.hours;
        delete newValue.limitPayout;
        delete newValue.maxPayoutLimit;
        delete newValue.minPayoutLimit;
        delete newValue.setRevsharePayoutLimits;

        props.onChange(newValue);
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

  return (
    <WidgetPannel
      title="Payout Setting"
      paddingBottom={4}
    >
      <InlineBoxSelect
        label="Payout Type"
        value={formik.values.payoutType}
        onChange={(value) => formik.setFieldValue('payoutType', value)}
        error={formik.errors.payoutType}
        tooltip="Payouts are a fixed price or a percentage of revenue."
        className="mb-8"
        mdLabel="3"
        mdInput="9"
        options={[
          {
            label: 'Fixed Amount',
            value: 'FIXED_AMOUNT'
          },
          {
            label: 'Revshare Percentage',
            value: 'REVSHARE_PERCENTAGE'
          },
        ]}
      />
      {
        formik.values.payoutType === 'FIXED_AMOUNT'
          ? (
            <>
              <InlineSelect
                label="Payout On"
                placeholder="Choose Type"
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
                    label: 'Inbound Call',
                    value: 'INBOUND_CALL'
                  },
                  {
                    label: 'Converted Call',
                    value: 'CONVERTED_CALL'
                  },
                ]}
                value={formik.values.conversionType}
                onChange={(value) => formik.setFieldValue('conversionType', value)}
                error={formik.errors.conversionType}
                tooltip="When the selected conversion event happens, the publisher will be credited."
                className="mb-8"
                mdLabel="3"
                mdInput="9"
              />
            </>
            )
          : null
      }
      <InlineNumberInput
        label={formik.values.payoutType === 'FIXED_AMOUNT' ? 'Payout Amount ($)' : 'Payout Percentage (%)'}
        value={formik.values.payoutValue}
        min={0}
        onChange={(value) => formik.setFieldValue('payoutValue', value)}
        error={formik.errors.payoutValue}
        tooltip={
          formik.values.payoutType === 'FIXED_AMOUNT'
            ? 'The amount of money credited to this publisher for each conversion'
            : 'The aount of money credited as a percentage of the revenue'
          }
        borderUnderline
        width="sm"
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      {
        formik.values.payoutType === 'REVSHARE_PERCENTAGE'
          ? (
            <>
              <InlineSwitch
                label="Set Revshare Payout Limits"
                checked={formik.values.setRevsharePayoutLimits}
                onChange={(checked) => formik.setFieldValue('setRevsharePayoutLimits', checked)}
                error={formik.errors.setRevsharePayoutLimits}
                tooltip="You can set minimum and maximum payout for Revshare a call."
                className="mb-8"
                mdLabel="3"
                mdInput="9"
              />
              {formik.values.setRevsharePayoutLimits &&
                <div className="row mb-8">
                  <div className="flex col-md-9 col-md-offset-3">
                    <div className="flex items-center mr-4">
                      <label className="mr-2">Min ($)</label>
                      <NumberInput
                        min={0}
                        value={formik.values.minPayoutLimit}
                        onChange={(value) => formik.setFieldValue('minPayoutLimit', value)}
                        width="xs"
                        error={formik.errors.minPayoutLimit}
                      />
                    </div>
                    <div className="flex items-center mr-4">
                      <label className="mr-2">Max ($)</label>
                      <NumberInput
                        min={0}
                        value={formik.values.maxPayoutLimit}
                        onChange={(value) => formik.setFieldValue('maxPayoutLimit', value)}
                        width="xs"
                        error={formik.errors.maxPayoutLimit}
                      />
                    </div>
                  </div>
                </div>
              }
            </>
          )
          : null
      }
      <InlineBoxSelect
        label="Duplicate Payouts"
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
        tooltip="
          When enabled, the publisher will be credited on duplicate or repeat calls.
          Disabling this option will prevent them from being paid multiple times.
          Time limits allow for duplicate payouts after a specific length of time.
        "
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      {(formik.values.secondsFromLastCall > 0 || formik.values.secondsFromLastCall === null) &&
        <div className="row mb-8">
          <div className="flex col-md-9 col-md-offset-3">
            <div className="flex items-center mr-8">
              <NumberInput
                min={0}
                value={formik.values.days}
                onChange={(value) => formik.setFieldValue('days', value)}
                width="xs"
                error={formik.errors.days}
              />
              <label className="ml-2">Days</label>
            </div>
            <div className="flex items-center mr-8">
              <NumberInput
                min={0}
                value={formik.values.hours}
                onChange={(value) => formik.setFieldValue('hours', value)}
                width="xs"
                error={formik.errors.hours}
              />
              <label className="ml-2">Hours</label>
            </div>
          </div>
        </div>
      }
      <OpenCloseHours
        label="Payout Hours"
        value={formik.values.hoursOfOperation}
        onChange={(value) => formik.setFieldValue('hoursOfOperation', value)}
        tooltip="The hours of operation where your publisher should be credited for calls."
        className="mb-8"
      />
      <InlineReactSelect
        label="Timezone"
        placeholder="Search Timezone"
        options={timezones}
        value={formik.values.timeZoneId}
        onChange={(value) => formik.setFieldValue('timeZoneId', value)}
        error={formik.errors.timeZoneId}
        tooltip="The timezone setting for this publisher's hours of operation limitations"
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineSwitch
        label="Limit Payout"
        checked={formik.values.limitPayout}
        onChange={(checked) => {
          if(!checked){
            formik.setFieldValue('allTimeCap', -1);
            formik.setFieldValue('allTimeSumCap', -1);
            formik.setFieldValue('monthlyCap', -1);
            formik.setFieldValue('monthlySumCap', -1);
            formik.setFieldValue('dailyCap', -1);
            formik.setFieldValue('dailySumCap', -1);
            formik.setFieldValue('hourlyCap', -1);
            formik.setFieldValue('hourlySumCap', -1);
            formik.setFieldValue('concurrencyCap', -1);
          }
          formik.setFieldValue('limitPayout', checked)
        }}
        error={formik.errors.limitPayout}
        tooltip="Set caps to payouts based on calls, amount, and concurrency."
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      {formik.values.limitPayout &&
        <>
          <InlineTextSwitch
            label="Global Cap"
            value={formik.values.allTimeCap}
            unsetValue={-1}
            onChange={(value) => formik.setFieldValue('allTimeCap', value !== '' ? Number(value) : null)}
            error={formik.errors.allTimeCap}
            tooltip="Payouts will be credited until the global call cap is reached."
            type="number"
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          <InlineTextSwitch
            label="Global Payout Cap"
            value={formik.values.allTimeSumCap}
            unsetValue={-1}
            onChange={(value) => formik.setFieldValue('allTimeSumCap', value !== '' ? Number(value) : null)}
            error={formik.errors.allTimeSumCap}
            tooltip="Payouts will be credited until the global payout cap is reached."
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
            tooltip="Payouts will be credited until the monthly call cap is reached."
            type="number"
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          <InlineTextSwitch
            label="Monthly Payout Cap"
            value={formik.values.monthlySumCap}
            unsetValue={-1}
            onChange={(value) => formik.setFieldValue('monthlySumCap', value !== '' ? Number(value) : null)}
            error={formik.errors.monthlySumCap}
            tooltip="Payouts will be credited until the monthly payout cap is reached."
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
            tooltip="Payouts will be credited until the daily call cap is reached."
            type="number"
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          <InlineTextSwitch
            label="Daily Payout Cap"
            value={formik.values.dailySumCap}
            unsetValue={-1}
            onChange={(value) => formik.setFieldValue('dailySumCap', value !== '' ? Number(value) : null)}
            error={formik.errors.dailySumCap}
            tooltip="Payouts will be credited until the daily payout cap is reached."
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
            tooltip="Payouts will be credited until the hourly call cap is reached."
            type="number"
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          <InlineTextSwitch
            label="Hourly Payout Cap"
            value={formik.values.hourlySumCap}
            unsetValue={-1}
            onChange={(value) => formik.setFieldValue('hourlySumCap', value !== '' ? Number(value) : null)}
            error={formik.errors.hourlySumCap}
            tooltip="Payouts will be credited until the hourly payout cap is reached."
            type="number"
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          <InlineTextSwitch
            label="Concurrency Cap"
            value={formik.values.concurrencyCap}
            unsetValue={-1}
            onChange={(value) => formik.setFieldValue('concurrencyCap', value !== '' ? Number(value) : null)}
            error={formik.errors.concurrencyCap}
            tooltip="
              Payouts will be credited until the concurrency cap is reached.
              When a call is completed, payouts will continue to accrue.
            "
            type="number"
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
        </>
      }
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

      <div className="row mt-12">
        <div className="col-md-9 col-md-offset-3 col-xs-12">
          <Button
            className="mr-4"
            onClick={() => formik.handleSubmit()}
          >
            {
              props.new === true
                ? 'ADD PAYOUT'
                : 'UPDATE PAYOUT'
            }
          </Button>
          <Button
            outlined
            onClick={() => {
              if(props.new === true) props.onDelete();
              else props.onCancel();
            }}
          >
            CANCEL
          </Button>
        </div>
      </div>
    </WidgetPannel>
  );
}

export default PayoutForm;