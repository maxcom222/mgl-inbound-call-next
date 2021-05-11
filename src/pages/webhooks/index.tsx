import React, {useMemo, useState} from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

import Layout from 'layouts';
import Widget from 'components/widget';
import Datatable from 'components/datatable';
import {InlineTextInput} from 'components/forms/inline-inputs';
import { Button } from 'components/buttons';

const Index: React.FunctionComponent<any> = () => {
  const [expandRow, setExpandRow] = useState<any>(false);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: '_name',
      },
      {
        Header: 'Call Token',
        accessor: '_callToken',
      },
      {
        Header: 'Revenue Token',
        accessor: '_revenueToken',
      },
      {
        Header: 'Fire Conversion',
        accessor: '_conversionType',
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
                  <EditWebhook
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
              tooltip="Delete URL Param"
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
      <Widget title="Manage Webhooks">
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
                  <AddWebhook
                    requestClose={() => {
                      // void refetch();
                      setExpandRow(false);
                    }}
                  />
                )
              });
            }}>
              CREATE WEBHOOK
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

const AddWebhook: React.FunctionComponent<any> = (props) => {
  const formik = useFormik<any>({
    initialValues: {
      _name: '',
      _callToken: '',
      _revenueToken: '',
      _conversionType: '',

      submitting: false
    },
    validationSchema: yup.object().shape({
      _name: yup.string().required(),
      _callToken: yup.string().required(),
      _revenueToken: yup.string().required()
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
        tooltip="Your webhook name will be used to display information about the webhook."
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="Call Token"
        value={formik.values._callToken}
        onChange={(value) => formik.setFieldValue('_callToken', value)}
        error={formik.errors._callToken}
        tooltip="The URL variable your system will pass back our Call ID with."
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="Revenue Token"
        value={formik.values._revenueToken}
        onChange={(value) => formik.setFieldValue('_revenueToken', value)}
        error={formik.errors._revenueToken}
        tooltip="The URL variable your system will pass back revenue with."
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="Fire Conversion"
        placeholder="Optional: sale_successful=yes"
        value={formik.values._conversionType}
        onChange={(value) => formik.setFieldValue('_conversionType', value)}
        error={formik.errors._conversionType}
        tooltip="When the configured URL variable or string is found, MGL will fire the associated conversion."
        borderUnderline
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
            CREATE
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

const EditWebhook: React.FunctionComponent<any> = () => <p>...</p>;

export default Index;
