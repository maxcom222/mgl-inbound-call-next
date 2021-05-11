import React, {useMemo, useState} from 'react';
import {useQuery} from '@apollo/client';
import {confirmAlert} from 'react-confirm-alert';
import moment from 'moment';
import {Tooltip} from 'react-tippy';
import { useFormik } from 'formik';
import * as yup from 'yup';

import {VIEW_NUMBERS, GET_NUMBER} from 'shared/queries/numbers';
import Layout from 'layouts';
import Widget from 'components/widget';
import Datatable from 'components/datatable';
import {CircularBadge} from 'components/badges';
import Flag from 'components/flag';
import {InlineTextInput} from 'components/forms/inline-inputs';
import { Button } from 'components/buttons';
import ItemsInput from 'components/forms/items-input';

const Index: React.FunctionComponent<any> = () => {
  const [expandRow, setExpandRow] = useState<any>(false);
  const handleConfirmDelete = ():void => {
    confirmAlert({
      title: 'Confirm Delete Number',
      message: 'Are you sure to delete this number?',
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
        Header: 'Number',
        accessor: 'phoneNumber',
      },
      {
        Header: 'Country',
        accessor: 'assignmentSettings',
        Cell: (cell: any) => (
          <Tooltip
            title={cell.value.countryCode}
            position="right"
            arrow={true}
            duration={0}
            hideDuration={0}
          >
            <Flag size={'sm'} code={cell.value.countryCode.toLowerCase()} />
          </Tooltip>
        ),
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Formatted',
        accessor: 'displayNumber',
      },
      {
        Header: 'Allocated',
        accessor: 'allocationDT',
        Cell: (props: any) => moment(props.value).format('MMM DD, YYYY'),
      },
      {
        Header: 'Renews',
        accessor: 'nextChargeDT',
        Cell: (props: any) => moment(props.value).format('MMM DD, YYYY'),
      },
      {
        Header: 'Campaign',
        accessor: 'day',
        Cell: '',
      },
      {
        Header: 'Publisher',
        accessor: 'provider',
      },
      {
        Header: 'Status',
        accessor: 'isActivated',
        Cell: (props: any) =>
          props.value ? (
            <CircularBadge size="xs" color="green">
              {' '}
            </CircularBadge>
          ) : (
            <CircularBadge size="xs" color="gray">
              {' '}
            </CircularBadge>
          ),
      },
      {
        Header: 'Actions',
        accessor: 'id',
        Cell: (cell: any) => (
          <div className="flex">
            <Button flat icon leftIcon="Edit" tooltip="Edit Number" className="mx-1" onClick={() => {
              setExpandRow({
                index: cell.row.index % cell.state.pageSize,
                content: (
                  <EditNumber
                    id={cell.value}
                    requestClose={() => {
                      void refetch();
                      setExpandRow(false);
                    }}
                  />
                )
              });
            }} />
            <Button flat icon leftIcon="PauseCircle" tooltip="Pause Number" className="mx-1" />
            <Button flat icon className="mx-1" tooltip="Delete Number" onClick={() => handleConfirmDelete()} />
          </div>
        ),
      },
    ],
    []
  );
  const {loading, data, refetch} = useQuery(VIEW_NUMBERS, {
    fetchPolicy: 'network-only'
  });

  if(loading) return <></>;

  console.log('-----', data);

  return (
    <Layout>
      <Widget title="Manage Numbers">
        <Datatable
          columns={columns}
          data={data.numbers}
          searchable
          filterOptions={[
            {
              label: 'No Campaign',
              option: (v) => v.campaignId !== null
            },
            {
              label: 'Unassigned',
              option: () => false
            },
            {
              label: 'No Publisher',
              option: (v) => v.affiliateId !== null
            },
            {
              label: 'Not in Number Pool',
              option: (v) => v.numberPoolId === null
            },
            {
              label: 'In Number Pool',
              option: (v) => v.numberPoolId !== null
            },
          ]}
          customColumnable
          noPagination
          expandRow={expandRow}
        />
      </Widget>
    </Layout>
  );
};

const EditNumber: React.FunctionComponent<any> = (props) => {
  const {loading, error, data} = useQuery(GET_NUMBER, {
    variables: {id: props.id},
  });

  if(loading) return <></>;
  if(error) return <>{error}</>;

  console.log(data);

  return <EditNumberContent number={data.number} requestClose={() => props.requestClose()} />;
};

const EditNumberContent: React.FunctionComponent<any> = (props) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      tags: [],

      submitting: false
    },
    validationSchema: yup.object().shape({
      blockDuplicatesForSeconds: yup.number().positive().required()
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      formik.setFieldValue('submitting', true);
    }
  });

  return (
    <div className="py-8">
      <InlineTextInput
        label="Name"
        value={formik.values.name}
        onChange={(value) => formik.setFieldValue('name', value)}
        error={''}
        tooltip="Name of the number. Used to quickly identify numbers on the portal and for reporting purposes."
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <ItemsInput
        label="Headers"
        placeholderName="Tag name"
        placeholderValue="value"
        value={formik.values.tags}
        onChange={(value) => formik.setFieldValue('tags', value)}
        error={formik.errors.tags}
        tooltip="Tags associated with a number. Tags will be attached to every call to the number."
        className="mb-8"
        mdLabel="3"
        mdInput="6"
        btnLabel="ADD HEADER"
      />
      <div className="row mt-12">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button className="w-32 mr-4" onClick={() => formik.handleSubmit()}>SAVE</Button>
          <Button outlined onClick={() => props.requestClose()}>CANCEL</Button>
        </div>
      </div>
    </div>
  );
}

export default Index;
