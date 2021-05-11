import React, {useMemo, useState} from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

import Layout from 'layouts';
import Widget from 'components/widget';
import Datatable from 'components/datatable';
import {InlineReactSelect, } from 'components/forms/inline-inputs';
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
        Header: 'Type',
        accessor: '_type',
      },
      {
        Header: 'Status',
        accessor: '_status',
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
                  <EditPlatform
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
      <Widget title="Manage URL Parameters">
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
                  <AddPlatform
                    requestClose={() => {
                      // void refetch();
                      setExpandRow(false);
                    }}
                  />
                )
              });
            }}>
              ADD PLATFORM INTEGRATION
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

const AddPlatform: React.FunctionComponent<any> = (props) => {
  const platforms = [
    {
      label: 'Google AdWords',
      value: 'GOOGLE_ADWORDS'
    },
    {
      label: 'Facebook Ads',
      value: 'FACEBOOK_ADS'
    }
  ];

  const formik = useFormik<any>({
    initialValues: {
      _platform: '',

      submitting: false
    },
    validationSchema: yup.object().shape({
      _platform: yup.string().required()
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
      <InlineReactSelect
        label="Platform"
        value={formik.values._platform}
        onChange={(value) => formik.setFieldValue('_platform', value)}
        options={platforms}
        error={formik.errors._platform}
        tooltip="Select the platform with which you want to integrate."
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
            AUTHORIZE
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

const EditPlatform: React.FunctionComponent<any> = () => <p>...</p>;

export default Index;
