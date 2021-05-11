import React, {useState} from 'react';
import {useQuery} from '@apollo/client';
import * as yup from 'yup';
import {useFormik} from 'formik';

import Layout from 'layouts';
import timezoneOptions from 'json/timezones.json';
import Widget from 'components/widget';
import WidgetPannel from 'components/widget-pannel';
import {
  InlineTextInput,
  InlineReactSelect,
  InlineTextSwitch,
  InlineBoxSelect,
  InlineSwitch
} from 'components/forms/inline-inputs';
import { Button } from 'components/buttons';
import OpenCloseHours from 'components/open-close-hours';
import { ReactSelect } from 'components/forms/selects';
import { VIEW_TARGETS } from 'shared/queries/targets';
import Help from 'components/help';
import { Tooltip } from 'react-tippy';
import { CircularBadge } from 'components/badges';

const timezones = timezoneOptions.map((el) => ({
  label: el.text,
  value: el.value
}));

const Index: React.FunctionComponent<any> = () => {
  const {loading: loadingTargets, data: targetsData} = useQuery(VIEW_TARGETS);

  if(loadingTargets) return <></>;

  return (
    <PageContent
      targets={targetsData.targets}
    />
  );
};

const PageContent: React.FunctionComponent<any> = (props) => {
  const targets = props.targets;

  const [targetSelected, setTargetSelected] = useState('');

  const formik = useFormik({
    initialValues: {
      _name: '',
      timeZoneId: '',
      _simuldial: false,
      _overrideSchedule: 'OFF',
        hoursOfOperation: {
          data: []
        },

      _overrideCapacity: 'OFF',
        allTimeCap: -1,
        monthlyCap: -1,
        dailyCap: -1,
        hourlyCap: -1,
      _overrideConcurrency: 'OFF',
        concurrencyCap: -1,

      _targets: [],

      submitting: false
    },
    validationSchema: yup.object().shape({
      _name: yup.string().required(),
      timeZoneId: yup.string().required(),
      _simuldial: yup.boolean().required(),
      _overrideSchedule: yup.string().required(),

      allTimeCap: yup.number().when('_overrideCapacity', {
        is: (fp) => fp !== 'OFF',
        then: yup.number().required()
      }),
      monthlyCap: yup.number().when('_overrideCapacity', {
        is: (fp) => fp !== 'OFF',
        then: yup.number().required()
      }),
      dailyCap: yup.number().when('_overrideCapacity', {
        is: (fp) => fp !== 'OFF',
        then: yup.number().required()
      }),
      hourlyCap: yup.number().when('_overrideCapacity', {
        is: (fp) => fp !== 'OFF',
        then: yup.number().required()
      }),
      
      concurrencyCap: yup.string().when('_overrideConcurrency', {
        is: (fp) => fp !== 'OFF',
        then: yup.number().required()
      })
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      formik.setFieldValue('submitting', true);
    }
  });

  console.log('values',formik.values);

  return(
    <Layout>
      <Widget title="Create Group">
        <div>
          <InlineTextInput
            label="Name"
            value={formik.values._name}
            onChange={(value) => formik.setFieldValue('_name', value)}
            error={formik.errors._name}
            tooltip="
              The name used to identify this group throughout MGL.
              Shorter names are better."
            borderUnderline
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          <InlineReactSelect
            label="TimeZone"
            placeholder="Select TimeZone"
            options={timezones}
            value={formik.values.timeZoneId}
            onChange={(value) => formik.setFieldValue('timeZoneId', value)}
            error={formik.errors.timeZoneId}
            tooltip="Select the Timezone that this target group operates in. All caps operate based on this timezone."
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          <InlineSwitch
            label="Simuldial"
            checked={formik.values._simuldial}
            onChange={(checked) => formik.setFieldValue('_simuldial', checked)}
            error={formik.errors._simuldial}
            tooltip="
              Dial all targets in this group at the same time.
              The first target to answer gets the call ensuring the shortest hold time possible for callers."
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          <InlineBoxSelect
            label="Override Schedule"
            value={formik.values._overrideSchedule}
            onChange={(value) => formik.setFieldValue('_overrideSchedule', value)}
            error={formik.errors._overrideSchedule}
            options={[
              {
                label: 'Off',
                value: 'OFF'
              },
              {
                label: 'Campaign',
                value: 'CAMPAIGN'
              },
              {
                label: 'Global',
                value: 'GLOBAL'
              }
            ]}
            tooltip="
              Override pre-configured settings of targets inside of this group."
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          {formik.values._overrideSchedule !== 'OFF' &&
            <>
              <OpenCloseHours
                label="Hours of Operation"
                value={formik.values.hoursOfOperation}
                onChange={(value) => formik.setFieldValue('hoursOfOperation', value)}
                tooltip="Set your target's hours of operation. For weekly schedule use advanced settings."
                className="mb-8"
              />
            </>
          }
        </div>
        <WidgetPannel
          title="Cap Settings"
          tooltip="Configure Cap Settings to define the capacity attributes of this Target Group's targets."
        >
          <InlineBoxSelect
            label="Override Capacity"
            value={formik.values._overrideCapacity}
            onChange={(value) => formik.setFieldValue('_overrideCapacity', value)}
            error={formik.errors._overrideCapacity}
            options={[
              {
                label: 'Off',
                value: 'OFF'
              },
              {
                label: 'Campaign',
                value: 'CAMPAIGN'
              },
              {
                label: 'Global',
                value: 'GLOBAL'
              }
            ]}
            tooltip="
              Override pre-configured settings of targets inside of this group."
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          {formik.values._overrideCapacity !== 'OFF' &&
            <>
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
            </>
          }
          <InlineBoxSelect
            label="Override Concurrency"
            value={formik.values._overrideConcurrency}
            onChange={(value) => formik.setFieldValue('_overrideConcurrency', value)}
            error={formik.errors._overrideConcurrency}
            options={[
              {
                label: 'Off',
                value: 'OFF'
              },
              {
                label: 'Campaign',
                value: 'CAMPAIGN'
              },
              {
                label: 'Global',
                value: 'GLOBAL'
              }
            ]}
            tooltip="
              Override pre-configured settings of targets inside of this group."
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          {formik.values._overrideConcurrency !== 'OFF' &&
            <>
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
            </>
          }
        </WidgetPannel>
        <WidgetPannel
          title="Add Targets"
          tooltip="Add targets to this group which will use the group's settings."
        >
          <div className="row">
            <div className="col-md-3 flex justify-end items-center">
              <label className="flex items-center pb-2 md:pb-0">
                <span className="text-sm text-default whitespace-no-wrap mr-1">Select Target</span>
                <Help>
                  Select the Timezone that this target group operates in. All caps operate based on this timezone.
                </Help>
              </label>
            </div>
            <div className="col-md-9 flex items-center">
              <ReactSelect
                placeholder="Select Target"
                options={
                  targets.filter((el) =>
                    formik.values._targets.findIndex((ell) => el.id.toString() === ell) === -1
                  ).map((el) => ({
                    label: el.name,
                    value: el.id.toString()
                  }))
                }
                value={targetSelected}
                onChange={(value) => setTargetSelected(value)}
                error={formik.errors.timeZoneId}
                className="block w-full md:w-72 mt-1 mr-8"
              />
              <Button
                outlined
                color="green"
                disabled={targetSelected === ''}
                onClick={() => {
                  const _newTargets:any = [...formik.values._targets];
                  _newTargets.push(targetSelected);
                  setTargetSelected('');
                  formik.setFieldValue('_targets', _newTargets);
                }}
              >
                ADD
              </Button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-md-offset-3">
              {formik.values._targets.length > 0 &&
                <table className="table mt-4">
                  <thead>
                    <tr>
                      <th>Target</th>
                      <th>Destination</th>
                      <th>Status</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      targets.filter((el) =>
                        formik.values._targets.findIndex((ell) => el.id.toString() === ell) !== -1
                      ).map((el, key) => (
                        <tr key={key}>
                          <td>{el.name}</td>
                          <td>{el.instructions.number}</td>
                          <td>
                            {
                              el.enabled ? (
                                <Tooltip
                                  title="Open"
                                  position="right"
                                  arrow={true}
                                  duration={0}
                                  hideDuration={0}
                                >
                                  <CircularBadge size="xs" color="green">
                                    {' '}
                                  </CircularBadge>
                                </Tooltip>
                              ) : (
                                <Tooltip
                                  title="Disabled"
                                  position="right"
                                  arrow={true}
                                  duration={0}
                                  hideDuration={0}
                                >
                                  <CircularBadge size="xs" color="gray">
                                    {' '}
                                  </CircularBadge>
                                </Tooltip>
                              )
                            }
                          </td>
                          <td>
                            <Button
                              flat
                              icon
                              leftIcon="XCircle"
                              className="mx-1"
                              onClick={() => {
                                const _newTargets = formik.values._targets.filter((ell) => ell !== el.id.toString());
                                formik.setFieldValue('_targets', _newTargets);
                              }}
                            />
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              }
            </div>
          </div>
        </WidgetPannel>
        <div className="row mt-12">
          <div className="col-md-9 col-md-offset-3 col-xs-12">
            <Button
              loading={formik.values.submitting}
              className="w-32"
              onClick={() => formik.handleSubmit()}
            >
              CREATE GROUP
            </Button>
          </div>
        </div>
      </Widget>
    </Layout>
  );
}

export default Index;
