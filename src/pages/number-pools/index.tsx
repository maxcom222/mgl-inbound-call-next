import React, {useMemo, useState} from 'react';
import {confirmAlert} from 'react-confirm-alert';
import {Tooltip} from 'react-tippy';
import { useFormik } from 'formik';
import * as yup from 'yup';

import Layout from 'layouts';
import Widget from 'components/widget';
import Datatable from 'components/datatable';
import Flag from 'components/flag';
import {InlineBoxSelect, InlineNumberInput, InlineReactSelect, InlineTextInput} from 'components/forms/inline-inputs';
import { Button } from 'components/buttons';
import countryOptions from 'json/countries.json';
import api from 'shared/utils/api';
import {NotificationManager} from 'react-notifications';

const countries = countryOptions.map((el) => ({
  label: el.name,
  value: el.alpha2Code
}));

const Index: React.FunctionComponent<any> = () => {
  const [expandRow, setExpandRow] = useState<any>(false);
  const handleConfirmDelete = ():void => {
    confirmAlert({
      title: 'Confirm Delete Number',
      message: 'Are you sure to delete this number pool?',
      buttons: [
        {
          label: 'Yes, delete it!',
          onClick: () => ''
        },
        {
          label: 'No',
          onClick: () => ''
        }
      ]
    });
  }
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Country',
        accessor: 'countryCode',
        Cell: (cell: any) => (
          <Tooltip
            title={cell.value}
            position="right"
            arrow={true}
            duration={0}
            hideDuration={0}
          >
            <Flag size={'sm'} code={cell.value.toLowerCase()} />
          </Tooltip>
        ),
      },
      {
        Header: 'Closed Browser Delay',
        accessor: 'closedBrowserDelay',
      },
      {
        Header: 'Browser Idle Limit',
        accessor: 'browserIdleLimit',
      },
      {
        Header: 'Pool Size',
        accessor: 'poolSize',
      },
      {
        Header: 'Allocating',
        accessor: 'allocating',
      },
      {
        Header: 'Actions',
        accessor: 'id',
        Cell: (cell: any) => (
          <div className="flex">
            <Button flat icon leftIcon="Edit" tooltip="Edit Pool" className="mx-1" onClick={() => {
              setExpandRow({
                index: cell.row.index % cell.state.pageSize,
                content: (
                  <EditPool
                    requestClose={() => {
                      // void refetch();
                      setExpandRow(false);
                    }}
                  />
                )
              });
            }} />
            <Button
              flat
              icon
              leftIcon="XCircle"
              className="mx-1"
              tooltip="Delete Pool"
              onClick={() => handleConfirmDelete()}
            />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <Layout>
      <Widget title="Manage Pools">
        <Datatable
          columns={columns}
          data={[]}
          customColumnable
          headerLeft={
            <Button outlined size="sm" leftIcon="Plus" color="green" onClick={() => {
              setExpandRow({
                index: -1,
                content: (
                  <AddPool
                    requestClose={() => {
                      // void refetch();
                      setExpandRow(false);
                    }}
                  />
                )
              });
            }}>
              CREATE NUMBER POOL
            </Button>
          }
          noPagination
          expandRow={expandRow}
        />
      </Widget>
    </Layout>
  );
};

const AddPool: React.FunctionComponent<any> = (props) => {
  const formik = useFormik<any>({
    initialValues: {
      _countryCode: '',
      _name: '',
      _closedBrowserDelay: '',
      _idleLimit: '',
      _poolSize: '',
      resource_type: '',
      area_code: '',

      phoneNumber: '',
      searched: false,
      numbers: [],

      submitting: false
    },
    validationSchema: yup.object().shape({
      _name: yup.string().required(),
      _countryCode: yup.string().required(),
      _poolSize: yup.number().required(),

      resource_type: yup.string().when('_countryCode', {
        is: (_countryCode) => _countryCode === 'US' || _countryCode === 'CA',
        then: yup.string().required()
      }),
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
        void api.post('numbers/buy', {
          phoneNumber: values.phoneNumber,
          affiliateId : values.publisher,
          accountId: "e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0"
        })
        .then((res) => {
          console.log('created number..........', res);
          formik.setFieldValue('submitting', false);
          NotificationManager.success('Number has been successfully created');
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
    }
  });

  const initNumbers = ():void => {
    formik.setFieldValue('phoneNumber', '');
    formik.setFieldValue('searched', false);
    formik.setFieldValue('numbers', []);
  }

  console.log(formik.values);

  return (
    <div className="py-8">
      <InlineReactSelect
        instanceId="react-select-country"
        label="Country"
        placeholder="Select Country"
        options={countries}
        value={formik.values._countryCode}
        onChange={(value) => {
          formik.setFieldValue('_countryCode', value);
          initNumbers();
        }}
        error={formik.errors._countryCode}
        tooltip="Select the country you would like to purchase a phone numbers in."
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="Name"
        placeholder="California Local Numbers"
        value={formik.values._name}
        onChange={(value) => formik.setFieldValue('_name', value)}
        error={formik.errors._name}
        tooltip="
          Your number pool name will be used to display information around the MGL portal.
          Short number pool names work best.
        "
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineNumberInput
        label="Closed Browser Delay"
        placeholder="30"
        value={formik.values._closedBrowserDelay}
        onChange={(value) => formik.setFieldValue('_closedBrowserDelay', value)}
        error={formik.errors._closedBrowserDelay}
        tooltip="
          The length of time MGL locks a number to a user after they close their browser.
          Example: 60 seconds locks the number for 1 minute.
        "
        integer
        min={0}
        width="sm"
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineNumberInput
        label="Idle Limit"
        placeholder="300"
        value={formik.values._idleLimit}
        onChange={(value) => formik.setFieldValue('_idleLimit', value)}
        error={formik.errors._idleLimit}
        tooltip="
          The length of time MGL locks a number to a user if they leave their browser open.
          Example: 3000 seconds locks the number for 5 minutes.
        "
        integer
        min={0}
        width="sm"
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineNumberInput
        label="Pool Size"
        value={formik.values._poolSize}
        onChange={(value) => formik.setFieldValue('_poolSize', value)}
        error={formik.errors._poolSize}
        tooltip="How many numbers would you like to keep in your number pool?"
        integer
        min={0}
        width="sm"
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      {(formik.values._countryCode === 'US' || formik.values._countryCode === 'CA') &&
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
            className="w-48 mr-2"
            onClick={() => formik.handleSubmit()}
            loading={formik.values.submitting}
          >
            {
              formik.values.searched ? 'SAVE' : 'SEARCH NUMBERS'
            }
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

const EditPool: React.FunctionComponent<any> = (props) => (
  <EditPoolContent requestClose={() => props.requestClose()} />
);

const EditPoolContent: React.FunctionComponent<any> = (props) => {
  const formik = useFormik<any>({
    initialValues: {
      _name: '',
      _closedBrowserDelay: '',
      _idleLimit: '',
      _poolSize: '',

      submitting: false
    },
    validationSchema: yup.object().shape({
      _name: yup.string().required(),
      _poolSize: yup.number().required(),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      formik.setFieldValue('submitting', true);
    }
  });

  console.log(formik.values);

  return (
    <div className="py-8">
      <InlineTextInput
        label="Name"
        placeholder="California Local Numbers"
        value={formik.values._name}
        onChange={(value) => formik.setFieldValue('_name', value)}
        error={formik.errors._name}
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineNumberInput
        label="Closed Browser Delay"
        placeholder="30"
        value={formik.values._closedBrowserDelay}
        onChange={(value) => formik.setFieldValue('_closedBrowserDelay', value)}
        error={formik.errors._closedBrowserDelay}
        integer
        min={0}
        width="sm"
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineNumberInput
        label="Idle Limit"
        placeholder="300"
        value={formik.values._idleLimit}
        onChange={(value) => formik.setFieldValue('_idleLimit', value)}
        error={formik.errors._idleLimit}
        integer
        min={0}
        width="sm"
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineNumberInput
        label="Pool Size"
        value={formik.values._poolSize}
        onChange={(value) => formik.setFieldValue('_poolSize', value)}
        error={formik.errors._poolSize}
        integer
        min={0}
        width="sm"
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <div className="row mt-12">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button
            className="w-32 mr-2"
            onClick={() => formik.handleSubmit()}
            loading={formik.values.submitting}
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

export default Index;
