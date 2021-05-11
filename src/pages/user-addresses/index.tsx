import React, {useMemo, useState} from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

import Layout from 'layouts';
import Widget from 'components/widget';
import Datatable from 'components/datatable';
import {InlineTextInput, InlineReactSelect} from 'components/forms/inline-inputs';
import { Button } from 'components/buttons';
import countriesData from 'json/countries.json';

const countries = countriesData.map((el) => ({
    label: el.name,
    value: el.alpha2Code
  }));

const Index: React.FunctionComponent<any> = () => {
  const [expandRow, setExpandRow] = useState<any>(false);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: '_name',
      },
      {
        Header: 'Country',
        accessor: '_country',
      },
      {
        Header: 'Business Name',
        accessor: '_businessName',
      },
      {
        Header: 'Address',
        accessor: '_address',
      },
      {
        Header: 'Actions',
        accessor: 'id',
        Cell: (cell: any) => (
          <div className="flex">
            <Button flat icon leftIcon="Edit" tooltip="Edit" className="mx-1" onClick={() => {
              setExpandRow({
                index: cell.row.index % cell.state.pageSize,
                content: (
                  <EditAddress
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
              tooltip="Delete"
              onClick={() => false}
            />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <Layout>
      <Widget title="Manage Addresses">
        <Datatable
          columns={columns}
          data={[]}
          headerLeft={
            <Button
              outlined
              size="sm"
              leftIcon="Plus"
              color="green"
              onClick={() => {
              setExpandRow({
                index: -1,
                content: (
                  <AddAddress
                    requestClose={() => {
                      // void refetch();
                      setExpandRow(false);
                    }}
                  />
                )
              });
            }}>
              ADD ADDRESS
            </Button>
          }
          searchable
          noPagination
          expandRow={expandRow}
        />
      </Widget>
    </Layout>
  );
};

const AddAddress: React.FunctionComponent<any> = (props) => {
  const formik = useFormik<any>({
    initialValues: {
      _name: '',
      _country: '',
      _businessName: '',
      _address: '',
      _city: '',
      _state: '',
      _zipcode: '',

      submitting: false
    },
    validationSchema: yup.object().shape({
      _name: yup.string().required(),
      _country: yup.string().required(),
      _businessName: yup.string().required()
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
        value={formik.values._name}
        onChange={(value) => formik.setFieldValue('_name', value)}
        error={formik.errors._name}
        tooltip="Unique name of the address"
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineReactSelect
        label="Country"
        placeholder="Select Country"
        options={countries}
        value={formik.values._country}
        onChange={(value) => formik.setFieldValue('_country', value)}
        error={formik.errors._country}
        tooltip="Country in which the address is registered"
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="Business Name"
        value={formik.values._businessName}
        onChange={(value) => formik.setFieldValue('_businessName', value)}
        error={formik.errors._businessName}
        tooltip="Name of the business in a specified country"
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="Street address"
        value={formik.values._address}
        onChange={(value) => formik.setFieldValue('_address', value)}
        error={formik.errors._address}
        tooltip="Stree address, including the unit/office number"
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
        tooltip="City"
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="State/Region"
        value={formik.values._state}
        onChange={(value) => formik.setFieldValue('_state', value)}
        error={formik.errors._state}
        tooltip="State or region"
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="ZIP/Postal Code"
        value={formik.values._zipcode}
        onChange={(value) => formik.setFieldValue('_zipcode', value)}
        error={formik.errors._zipcode}
        tooltip="ZIP or Postal Code"
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
            className="w-48 mr-2"
            onClick={() => formik.handleSubmit()}
            loading={formik.values.submitting}
          >
            CREATE ADDRESS
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

const EditAddress: React.FunctionComponent<any> = () => <p>...</p>;

export default Index;
