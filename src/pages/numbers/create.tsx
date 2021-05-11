import React from 'react';
import {useQuery} from '@apollo/client';
import * as yup from 'yup';
import {useFormik} from 'formik';
import api from 'shared/utils/api';
import Router from 'next/router';

import {VIEW_AFFILIATES} from 'shared/queries/publishers';
import Layout from 'layouts';
import Widget from 'components/widget';
import countryOptions from 'json/countries.json';
import {InlineNumberInput, InlineReactSelect, InlineSwitch, InlineBoxSelect} from 'components/forms/inline-inputs';
import {NotificationManager} from 'react-notifications';
import { Button } from 'components/buttons';

const countries = countryOptions.map((el) => ({
    label: el.name,
    value: el.alpha2Code
  }));

const Index: React.FunctionComponent<any> = () => {
  const {loading, data } = useQuery(VIEW_AFFILIATES);

  if(loading) return <></>;

  return <PageContent publishers={data.affiliates.map((el) => ({ label: el.name, value: el.id })) } />;
}

const PageContent: React.FunctionComponent<any> = (props) => {
  const publishers = props.publishers;

  const formik = useFormik<any>({
    initialValues: {
      country: '',
      isBill: false,
      resource_type: '',
      area_code: '',
      phoneNumber: '',
      publisher: '',

      searched: false,
      numbers: [],
      submitting: false
    },
    validationSchema: yup.object().shape({
      country: yup.string().required(),
      isBill: yup.boolean().required(),
      resource_type: yup.string().when('country', {
        is: (country) => country === 'US' || country === 'CA',
        then: yup.string().required()
      }),
      area_code: yup.string(),
      phoneNumber: yup.string().nullable().when('searched', {
        is: true,
        then: yup.string().required()
      }),
      publisher: yup.string().required()
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      formik.setFieldValue('submitting', true);

      if(formik.values.searched){
        void api.post('numbers/buy', {
          phoneNumber: values.phoneNumber,
          affiliateId : values.publisher,
          accountId: "e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0"
        })
        .then((res) => {
          console.log('created number..........', res);
          formik.setFieldValue('submitting', false);
          NotificationManager.success('Number has been successfully created');
          Router.push('/numbers');
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
    <Layout>
      <Widget title="Create Number">
        <InlineReactSelect
          label="Country"
          placeholder="Select Country"
          options={countries}
          value={formik.values.country}
          error={formik.errors.country}
          onChange={(value) => {
            formik.setFieldValue('country', value);
            initNumbers();
          }}
          tooltip="Select the country you would like to purchase a phone numbers in."
          className="mb-8"
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
          className="mb-8"
          mdLabel="3"
          mdInput="9"
        />
        {
          (formik.values.country === 'US' || formik.values.country === 'CA') &&
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
              className="mb-8"
              mdLabel="3"
              mdInput="9"
              fixWidth
            />
            <InlineNumberInput
              label="Prefix"
              placeholder="Optional"
              value={formik.values.area_code}
              onChange={(value) => {
                formik.setFieldValue('area_code', value);
                initNumbers();
              }}
              error={formik.errors.area_code}
              tooltip="Entering '212' will make MGL only select phone numbers with the prefix '212'."
              min={0}
              integer
              width="sm"
              className="mb-8"
              mdLabel="3"
              mdInput="9"
            />
          </>
        }
        <InlineReactSelect
          label="Assign Publisher"
          placeholder="Select Publisher"
          value={formik.values.publisher}
          options={publishers}
          onChange={(value) => formik.setFieldValue('publisher', value)}
          error={formik.errors.publisher}
          tooltip="Allow a publisher to use this Number Pool's resources."
          className="mb-8"
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
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
        }
        <div className="row mt-12">
          <div className="col-md-3"></div>
          <div className="col-md-9">
            <Button
              className="w-48"
              onClick={() => formik.handleSubmit()}
              loading={formik.values.submitting}
            >
              {
                formik.values.searched ? 'CREATE NUMBER' : 'SEARCH NUMBERS'
              }
            </Button>
          </div>
        </div>
      </Widget>
    </Layout>
  );
};

export default Index;
