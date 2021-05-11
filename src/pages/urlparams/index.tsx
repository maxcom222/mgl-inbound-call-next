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
        Header: 'URL Parameter',
        accessor: '_urlParameter',
      },
      {
        Header: 'Reporting Menu Name',
        accessor: '_reportingMenuname',
      },
      {
        Header: 'Report Name',
        accessor: '_reportName',
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
                  <EditUrlParam
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
                  <AddUrlParam
                    requestClose={() => {
                      // void refetch();
                      setExpandRow(false);
                    }}
                  />
                )
              });
            }}>
              CREATE URL PARAMETER
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

const AddUrlParam: React.FunctionComponent<any> = (props) => {
  const formik = useFormik<any>({
    initialValues: {
      _urlParameter: '',
      _reportingMenuname: '',
      _reportName: '',

      submitting: false
    },
    validationSchema: yup.object().shape({
      _urlParameter: yup.string().required(),
      _reportingMenuname: yup.string().required(),
      _reportName: yup.string().required()
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
        label="URL Parameter"
        value={formik.values._urlParameter}
        onChange={(value) => formik.setFieldValue('_urlParameter', value)}
        error={formik.errors._urlParameter}
        tooltip="The URL parameter you'd like MGL to tag."
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="Reporting Menu Name"
        value={formik.values._reportingMenuname}
        onChange={(value) => formik.setFieldValue('_reportingMenuname', value)}
        error={formik.errors._reportingMenuname}
        tooltip="The menu Option in Reporting under the Tags menu where you can find this data."
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="Report Name"
        value={formik.values._reportName}
        onChange={(value) => formik.setFieldValue('_reportName', value)}
        error={formik.errors._reportName}
        tooltip="The name of the report that will show up in your Menu Name."
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

const EditUrlParam: React.FunctionComponent<any> = () => <p>...</p>;

export default Index;