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
        Header: 'API Access Token Name',
        accessor: '_name',
      },
      {
        Header: 'Date (Last Use)',
        accessor: '_date',
      },
      {
        Header: 'Resource (Last Use)',
        accessor: '_resource',
      },
      {
        Header: 'IP (Last Use)',
        accessor: '_ip',
      },
      {
        Header: 'Actions',
        accessor: 'id',
        Cell: (cell: any) => (
          <div className="flex">
            <Button
              flat
              icon
              leftIcon="FileText"
              tooltip="Token Usage Details"
              className="mx-1"
              onClick={() => {
                setExpandRow({
                  index: cell.row.index % cell.state.pageSize,
                  content: (
                    <ViewToken
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
      <Widget title="Manage API Access Tokens">
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
                  <AddToken
                    requestClose={() => {
                      // void refetch();
                      setExpandRow(false);
                    }}
                  />
                )
              });
            }}>
              ADD API ACCESS TOKEN
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

const AddToken: React.FunctionComponent<any> = (props) => {
  const formik = useFormik<any>({
    initialValues: {
      _name: '',

      submitting: false
    },
    validationSchema: yup.object().shape({
      _name: yup.string().required()
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
            ADD
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

const ViewToken: React.FunctionComponent<any> = () => <p>...</p>;

export default Index;