import React from 'react';
import * as yup from 'yup';
import {useFormik} from 'formik';

import Layout from 'layouts';
import Widget from 'components/widget';
import countriesData from 'json/countries.json';
import timezonesData from 'json/timezones.json';
import statesData from 'json/states.json';
import {InlineReactSelect, InlineTextInput} from 'components/forms/inline-inputs';
import { Button } from 'components/buttons';

const countries = countriesData.map((el) => ({
    label: el.name,
    value: el.alpha2Code
  }));
const timezones = timezonesData.map((el) => ({
  label: el.text,
  value: el.value
}));
const states = statesData.map((el) => ({
  label: el.name,
  value: el.abbreviation
}));

const Index: React.FunctionComponent<any> = () => <PageContent />

const PageContent: React.FunctionComponent<any> = () => {
  const formik = useFormik<any>({
    initialValues: {
      _country: '',
      _timezone: '',
      _company: '',
      _address1: '',
      _address2: '',
      _city: '',
      _state: '',
      _zipcode: '',

      submitting: false
    },
    validationSchema: yup.object().shape({
      _country: yup.string().required(),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      formik.setFieldValue('submitting', true);
    },
  });

  return (
    <Layout>
      <Widget title="Edit Account">
        <InlineReactSelect
          label="Country"
          placeholder="Select Country"
          options={countries}
          value={formik.values._country}
          onChange={(value) => formik.setFieldValue('_country', value)}
          error={formik.errors._country}
          tooltip="Select the country you are located in."
          className="mb-8"
          mdLabel="3"
          mdInput="9"
        />
        <InlineReactSelect
          label="Timezone"
          placeholder="Select Timezone"
          options={timezones}
          value={formik.values._timezone}
          onChange={(value) => formik.setFieldValue('_timezone', value)}
          error={formik.errors._timezone}
          tooltip="Select the timezone you are located in."
          className="mb-8"
          mdLabel="3"
          mdInput="9"
        />
        <InlineTextInput
          label="Company"
          value={formik.values._company}
          onChange={(value) => formik.setFieldValue('company', value)}
          error={formik.errors._company}
          tooltip="The name of your company"
          borderUnderline
          className="mb-8"
          mdLabel="3"
          mdInput="9"
        />
        <InlineTextInput
          label="Address"
          value={formik.values._address1}
          onChange={(value) => formik.setFieldValue('_address1', value)}
          error={formik.errors._address1}
          tooltip="The physical location associated with your business or billing address"
          borderUnderline
          className="mb-8"
          mdLabel="3"
          mdInput="9"
        />
        <InlineTextInput
          placeholder="Optional"
          value={formik.values._address2}
          onChange={(value) => formik.setFieldValue('_address2', value)}
          error={formik.errors._address2}
          borderUnderline
          className="mb-8"
          mdLabel="3"
          mdInput="9"
        />
        <InlineTextInput
          label="City"
          value={formik.values._city}
          onChange={(value) => formik.setFieldValue('_city', value)}
          error={formik.errors._city}
          tooltip="The city you or your business are located in"
          borderUnderline
          className="mb-8"
          mdLabel="3"
          mdInput="9"
        />
        <InlineReactSelect
          label="State"
          placeholder="Select State"
          options={states}
          value={formik.values._state}
          onChange={(value) => formik.setFieldValue('_state', value)}
          error={formik.errors._state}
          tooltip="The state you or your business are located in"
          className="mb-8"
          mdLabel="3"
          mdInput="9"
        />
        <InlineTextInput
          label="Zip Code"
          value={formik.values._zipcode}
          onChange={(value) => formik.setFieldValue('_zipcode', value)}
          error={formik.errors._zipcode}
          tooltip="The zip code you or your business are located in"
          borderUnderline
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
              onClick={() => formik.handleSubmit()}
              loading={formik.values.submitting}
            >
              UPDATE
            </Button>
          </div>
        </div>
      </Widget>

    </Layout>
  );
};

export default Index;
