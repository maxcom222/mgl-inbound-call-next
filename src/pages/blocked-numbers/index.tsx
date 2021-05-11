import React, {useMemo, useState} from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

import Layout from 'layouts';
import Widget from 'components/widget';
import Datatable from 'components/datatable';
import {
  InlineBoxSelect,
  InlineNumberInput,
  InlinePhoneInput,
  InlineReactSelect,
  InlineTextSwitch
} from 'components/forms/inline-inputs';
import { Button } from 'components/buttons';

const Index: React.FunctionComponent<any> = () => {
  const [expandRow, setExpandRow] = useState<any>(false);

  const columns = useMemo(
    () => [
      {
        Header: 'Blocked Number',
        accessor: '_phoneNumber',
      },
      {
        Header: 'Campaign',
        accessor: '_campaignName',
      },
      {
        Header: 'Blocked Until',
        accessor: '_blockedUntil',
      },
      {
        Header: 'Actions',
        accessor: 'id',
        Cell: (cell: any) => (
          <div className="flex">
            <Button flat icon leftIcon="Edit" tooltip="Edit Blocked Number Settings" className="mx-1" onClick={() => {
              setExpandRow({
                index: cell.row.index % cell.state.pageSize,
                content: (
                  <EditSettings
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
              tooltip="Unblock Number"
              onClick={() => false}
            />
          </div>
        ),
      },
    ],
    []
  );

  // const numbers = [
  //   {
  //     _phoneNumber: '+12345678910',
  //     _campaignName: 'Medigap Mailers - MGL',
  //     _blockedUntil: 'Dec 31, 2020 12:00 AM',
  //   }
  // ];

  return (
    <Layout>
      <Widget title="Manage Pools">
        <Datatable
          columns={columns}
          data={[]}
          headerLeft={
            <Button
              outlined
              size="sm"
              leftIcon="Slash"
              color="green"
              onClick={() => {
              setExpandRow({
                index: -1,
                content: (
                  <AddBlockedNumber
                    requestClose={() => {
                      // void refetch();
                      setExpandRow(false);
                    }}
                  />
                )
              });
            }}>
              BLOCK A NUMBER
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

const AddBlockedNumber: React.FunctionComponent<any> = (props) => {
  const formik = useFormik<any>({
    initialValues: {
      _blockType: 'NUMBER',
      _phoneNumber: '',
      _areaCode: '',
      _scope: 'ALL_CAMPAIGN',
      _campaignId: '',
      _duration: -1,

      submitting: false
    },
    validationSchema: yup.object().shape({
      _blockType: yup.string().required(),
      _phoneNumber: yup.number().when('_blockType', {
        is: 'NUMBER',
        then: yup.number().required()
      }),
      _areaCode: yup.number().when('_blockType', {
        is: 'PREFIX',
        then: yup.number().required()
      }),
      _scope: yup.string().required(),
      _campaignId: yup.string().when('_scope', {
        is: 'SELECT_CAMPAIGN',
        then: yup.string().required()
      }),
      _duration: yup.number().required()
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
      <InlineBoxSelect
        label="Number Type"
        options={[
          {
            label: 'Number',
            value: 'NUMBER'
          },
          {
            label: 'Anonymous',
            value: 'ANONYMOUS'
          },
          {
            label: 'Prefix',
            value: 'PREFIX'
          }
        ]}
        value={formik.values._blockType}
        onChange={(value) => {
          formik.setFieldValue('_blockType', value);
        }}
        error={formik.errors._blockType}
        tooltip="Enter a number to block or block all anonymous callers."
        className="mb-8"
        mdLabel="3"
        mdInput="9"
        fixWidth
      />
      {formik.values._blockType === 'NUMBER' &&
        <InlinePhoneInput
          label="Enter Number"
          value={formik.values._phoneNumber}
          onChange={(value) => formik.setFieldValue('_phoneNumber', value)}
          error={formik.errors._phoneNumber}
          tooltip="Enter a specific number to be blocked"
          className="mb-8"
          mdLabel="3"
          mdInput="9"
        />
      }
      {formik.values._blockType === 'PREFIX' &&
        <InlineNumberInput
          label="Number prefix"
          value={formik.values._areaCode}
          onChange={(value) => formik.setFieldValue('_areaCode', value)}
          error={formik.errors._areaCode}
          tooltip="Enter a number prefix to be blocke. Caller IDs starting with the prefix will be blocked."
          integer
          min={0}
          width="sm"
          className="mb-8"
          mdLabel="3"
          mdInput="9"
        />
      }
      <InlineBoxSelect
        label="Scope"
        options={[
          {
            label: 'All Campaign',
            value: 'ALL_CAMPAIGN'
          },
          {
            label: 'Select Campaign',
            value: 'SELECT_CAMPAIGN'
          }
        ]}
        value={formik.values._scope}
        onChange={(value) => {
          formik.setFieldValue('_scope', value);
        }}
        error={formik.errors._scope}
        tooltip="Block the caller on a specific campaign or all campaigns."
        className="mb-8"
        mdLabel="3"
        mdInput="9"
        fixWidth
      />
      {formik.values._scope === 'SELECT_CAMPAIGN' &&
        <InlineReactSelect
          label="Campaign"
          placeholder="Select Campaign"
          value={formik.values._campaignId}
          options={[]}
          onChange={(value) => formik.setFieldValue('_campaignId', value)}
          error={formik.errors._campaignId}
          tooltip="Block the caller on this campaign."
          className="mb-8"
          mdLabel="3"
          mdInput="9"
        />
      }
      <InlineTextSwitch
        label="Specify Duration"
        placeholder="Hours to block number"
        value={formik.values._duration}
        unsetValue={-1}
        onChange={(value) => formik.setFieldValue('_duration', value !== '' ? Number(value) : null)}
        error={formik.errors._duration}
        tooltip="Block the caller for a specific time period."
        fixWidth
        type="number"
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

const EditSettings: React.FunctionComponent<any> = (props) => (
  <EditSettingsContent requestClose={() => props.requestClose()} />
);

const EditSettingsContent: React.FunctionComponent<any> = () => (
  <div className="py-8">

  </div>
)

export default Index;
