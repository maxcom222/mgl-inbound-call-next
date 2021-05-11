import React, {useMemo, useState} from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

import Layout from 'layouts';
import Widget from 'components/widget';
import Datatable from 'components/datatable';
import {InlineSwitch, InlineSelect, InlineTextInput} from 'components/forms/inline-inputs';
import ItemsInput from 'components/forms/items-input';
import { Button } from 'components/buttons';
import WidgetPannel from 'components/widget-pannel';
import TagRoutingFilters from 'components/tag-routing-filters';

const Index: React.FunctionComponent<any> = () => {
  const [expandRow, setExpandRow] = useState<any>(false);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: '_name',
      },
      {
        Header: 'Fire Pixel On',
        accessor: '_firePixelOn',
      },
      {
        Header: 'Method',
        accessor: '_method',
      },
      {
        Header: 'URL',
        accessor: '_url',
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
                  <EditPixel
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
      <Widget title="Manage Pixels">
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
                  <AddPixel
                    requestClose={() => {
                      // void refetch();
                      setExpandRow(false);
                    }}
                  />
                )
              });
            }}>
              CREATE PIXEL
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

const AddPixel: React.FunctionComponent<any> = (props) => {
  const eventTypes = [
    {
      label: 'Incoming',
      value: 'INCOMING'
    },
    {
      label: 'Connected (Answered)',
      value: 'CONNECTED'
    },
    {
      label: 'Completed',
      value: 'COMPLETED'
    },
    {
      label: 'Converted',
      value: 'CONVERTED'
    },
    {
      label: 'Error',
      value: 'ERROR'
    },
    {
      label: 'Payout',
      value: 'PAYOUT'
    },
    {
      label: 'Recording',
      value: 'RECORDING'
    },
    {
      label: 'Finalized',
      value: 'FINALIZED'
    },
  ];
  const contentTypes = [
    {
      label: 'application/json',
      value: 'application/json'
    },
    {
      label: 'application/xml',
      value: 'application/xml'
    }
  ];
  const formik = useFormik<any>({
    initialValues: {
      pixel: '',

      createNew: false,
      name: '',
      eventType: '',
      url: '',

      enablePostPixel: false,
      contentType: '',
      body: '',
      headers: [],
      criteria: {
        data: {
          tagRoutableRule: {
            data: []
          }
        }
      },

      submitting: false
    },
    validationSchema: yup.object().shape({
      name: yup.string().required(),
      eventType: yup.string().required(),
      url: yup.string().required()
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      formik.setFieldValue('submitting', true);
    },
  });
  const [errors] = useState({
    criteria: ''
  });

  console.log(formik.values);

  return (
    <div className="py-8">
      <InlineTextInput
        label="Name"
        placeholder="Enter name"
        value={formik.values.name}
        onChange={(value) => formik.setFieldValue('name', value)}
        error={formik.errors.name}
        tooltip="Enter a name for the pixel for your future reference."
        borderUnderline
        className="mb-5"
        mdLabel="3"
        mdInput="9"
      />
      <InlineSelect
        label="Fire Pixel On"
        placeholder="Choose Event Type"
        value={formik.values.eventType}
        options={eventTypes}
        onChange={(value) => formik.setFieldValue('eventType', value)}
        error={formik.errors.eventType}
        tooltip="Choose the event that will trigger your postback."
        className="mb-5"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="URL"
        placeholder="http://"
        value={formik.values.url}
        onChange={(value) => formik.setFieldValue('url', value)}
        error={formik.errors.url}
        tooltip="MGL will fire this URL based on your configuration choices."
        width="full"
        className="mb-5"
        mdLabel="3"
        mdInput="6"
      />
      <InlineSwitch
        label="Enable POST Pixel"
        onChange={(checked) => formik.setFieldValue('enablePostPixel', checked)}
        checked={formik.values.enablePostPixel}
        error={formik.errors.enablePostPixel}
        tooltip="If this option is enabled, HTTP POST will be used to send the pixel."
        className="mb-5"
        mdLabel="3"
        mdInput="9"
      />

      {formik.values.enablePostPixel &&
        <>
          <InlineSelect
            label="Content Type"
            placeholder="Choose Type"
            value={formik.values.contentType}
            options={contentTypes}
            onChange={(value) => formik.setFieldValue('contentType', value)}
            error={formik.errors.contentType}
            tooltip="The content type of the body"
            className="mb-5"
            mdLabel="3"
            mdInput="9"
          />
          <InlineTextInput
            label="Body"
            value={formik.values.body}
            onChange={(value) => formik.setFieldValue('body', value)}
            error={formik.errors.body}
            tooltip="The body of the POST request that will be fired"
            width="full"
            className="mb-5"
            mdLabel="3"
            mdInput="6"
          />
          <ItemsInput
            label="Headers"
            placeholderName="Header name"
            placeholderValue="value"
            value={formik.values.headers}
            onChange={(value) => formik.setFieldValue('headers', value)}
            error={formik.errors.headers}
            tooltip="Any additional headers to be used on the request"
            className="mb-5"
            mdLabel="3"
            mdInput="6"
            btnLabel="ADD HEADER"
          />
        </>
      }

      <div className="relative w-full flex flex-wrap justify-center mt-8">
        <div className="md:w-9/12 w-full">
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
        </div>
      </div>

      <div className="row mt-8">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button
            className="w-40 mr-4"
            onClick={() => formik.handleSubmit()}
            loading={formik.values.submitting}
          >
            {
              formik.values.createNew ? 'CREATE' : 'ADD'
            }
          </Button>
          <Button outlined onClick={() => props.requestClose()}>CANCEL</Button>
        </div>
      </div>
    </div>
  );
}

const EditPixel: React.FunctionComponent<any> = () => <p>...</p>;

export default Index;
