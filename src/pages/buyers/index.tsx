import React, { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import * as yup from 'yup';
import { useFormik } from 'formik';

import {
  GET_OWNER,
  VIEW_OWNERS,
  INSERT_OWNER,
  UPDATE_OWNER,
  UPDATE_OWNER_CAN_DISPUTE_CONVERSION,
  UPDATE_OWNER_CAN_PAUSE_TARGETS,
  UPDATE_OWNER_CAN_SET_CONCURRENCY_CAPS,
  DELETE_OWNER
} from 'shared/queries/owners';
import Layout from 'layouts';
import Widget from 'components/widget';
import Datatable from 'components/datatable';
import Switch from 'components/switch';
import { CircularBadge } from 'components/badges';
import { confirmAlert } from 'react-confirm-alert';
import { InlineTextInput, InlineSwitch } from 'components/forms/inline-inputs';
import { NotificationManager } from 'react-notifications';
import { Button } from 'components/buttons';
import { Tooltip } from 'react-tippy';

const Index: React.FunctionComponent<any> = () => {
  const [ expandRow, setExpandRow ] = useState<any>(false);
  const [ deleteBuyer ] = useMutation(
    DELETE_OWNER,
    {
      onCompleted: () => {
        NotificationManager.success('Owner has been deleted');
        void refetch();
      },
    }
  );
  const [ updateBuyerCanPauseTargets ] = useMutation(
    UPDATE_OWNER_CAN_PAUSE_TARGETS,
    {
      onCompleted: () => {
        void refetch();
      }
    }
  );
  const [ updateBuyerCanSetConcurrencyCaps ] = useMutation(
    UPDATE_OWNER_CAN_SET_CONCURRENCY_CAPS,
    {
      onCompleted: () => {
        void refetch();
      }
    }
  );
  const [ updateBuyerCanDisputeConversions ] = useMutation(
    UPDATE_OWNER_CAN_DISPUTE_CONVERSION,
    {
      onCompleted: () => {
        void refetch();
      }
    }
  );
  const handleConfirmDelete = (id: number):void => {
    confirmAlert({
      title: 'Confirm Delete Buyer',
      message: 'Are you sure to delete this buyer?',
      buttons: [
        {
          label: 'Yes, delete it!',
          onClick: () => {
            void deleteBuyer({
              variables: {
                id
              }
            });
          }
        },
        {
          label: 'No',
          onClick: () => false
        }
      ]
    });
  }

  const columns = useMemo(
    () => [
      {
        Header: 'Company Name',
        accessor: 'name',
      },
      {
        Header: 'Sub ID',
        accessor: 'subId',
        Cell: (props: any) => (props.value === null ? '' : props.value),
      },
      {
        Header: 'Can Pause Targets',
        accessor: (d: any) => ({
          id: d.id,
          canPauseTargets: d.canPauseTargets
        }),
        Cell: (props: any) => (
          <Switch
            size="xs"
            checked={props.value.canPauseTargets}
            onChange={
              (checked) => {
                void updateBuyerCanPauseTargets({
                  variables: {
                    id: props.value.id,
                    canPauseTargets: checked
                  }
                }
              )}
            }
          />
        ),
      },
      {
        Header: 'Can Set Target Concurrency',
        accessor: (d: any) => ({
          id: d.id,
          canSetConcurrencyCaps: d.canSetConcurrencyCaps
        }),
        Cell: (props: any) => (
          <Switch
            size="xs"
            checked={props.value.canSetConcurrencyCaps}
            onChange={
              (checked) => {
                void updateBuyerCanSetConcurrencyCaps({
                  variables: {
                    id: props.value.id,
                    canSetConcurrencyCaps: checked
                  }
                }
              )}
            }
          />
        ),
      },
      {
        Header: 'Can Dispute Conversions',
        accessor: (d: any) => ({
          id: d.id,
          canDisputeConversions: d.canDisputeConversions
        }),
        Cell: (props: any) => (
          <Switch
            size="xs"
            checked={props.value.canDisputeConversions}
            onChange={
              (checked) => {
                void updateBuyerCanDisputeConversions({
                  variables: {
                    id: props.value.id,
                    canDisputeConversions: checked
                  }
                }
              )}
            }
          />
        ),
      },
      {
        Header: 'Hour',
        accessor: 'hour',
        Cell: 0,
      },
      {
        Header: 'Day',
        accessor: 'day',
        Cell: 0,
      },
      {
        Header: 'Month',
        accessor: 'month',
        Cell: 0,
      },
      {
        Header: 'Total',
        accessor: 'routes',
      },
      {
        Header: 'Status',
        accessor: 'enabled',
        Cell: (props: any) =>
          props.value ? (
            <Tooltip
              title="Open"
              position="right"
              arrow={true}
              duration={0}
              hideDuration={0}
            >
              <CircularBadge size="xs" color="green">
                {' '}
              </CircularBadge>
            </Tooltip>
          ) : (
            <Tooltip
              title="Disabled"
              position="right"
              arrow={true}
              duration={0}
              hideDuration={0}
            >
              <CircularBadge size="xs" color="gray">
                {' '}
              </CircularBadge>
            </Tooltip>
          ),
      },
      {
        Header: 'Actions',
        accessor: (row: any) => ({
          id: row.id,
        }),
        Cell: (cell: any) => (
          <div className="flex">
            <Button flat icon leftIcon="Edit" className="mx-1" tooltip="Edit Buyer" onClick={() => {
              setExpandRow({
                index: cell.row.index % cell.state.pageSize,
                content: (
                  <EditBuyer
                    id={cell.value.id}
                    requestClose={() => {
                      void refetch();
                      setExpandRow(false);
                    }}
                  />
                )
              });
            }}/>
            <Button
              flat
              icon
              leftIcon="XCircle"
              className="mx-1"
              tooltip="Delete Buyer"
              onClick={() => handleConfirmDelete(cell.value.id)}
            />
          </div>
        ),
      },
    ],
    []
  );
  const { loading, data, refetch } = useQuery(VIEW_OWNERS);

  console.log('-----', data);

  if(loading) return <></>;

  return (
    <Layout>
      <Widget title="Manage Buyers">
        <Datatable
          columns={columns}
          data={data.buyers}
          searchable
          noPagination
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
                    <AddBuyer requestClose={() => {
                      void refetch();
                      setExpandRow(false);
                    }} />
                  )
                });
              }}
            >
              CREATE BUYER
            </Button>
          }
          expandRow={expandRow}
        />
      </Widget>
    </Layout>
  );
};

const AddBuyer: React.FunctionComponent<any> = (props) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      subId: '',
      canDisputeConversions: false,
      canPauseTargets: false,
      canSetConcurrencyCaps: false,
      enabled: false
    },
    validationSchema: yup.object().shape({
      name: yup.string().required(),
      subId: yup.string().required()
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      void createBuyer({ variables: values });
    }
  });

  const [ createBuyer ] = useMutation(
    INSERT_OWNER,
    {
      onCompleted: () => {
        NotificationManager.success('Buyer has been added');
        props.requestClose();
      },
    }
  );

  return (
    <div className="py-8">
      <InlineTextInput
        label={'Company'}
        value={formik.values.name}
        onChange={(value) => formik.setFieldValue('name', value)}
        placeholder={'MGL'}
        className={'mb-8'}
        mdLabel="3"
        mdInput="9"
        error={formik.errors.name}
      />
      <InlineTextInput
        label={'Sub ID'}
        value={formik.values.subId}
        onChange={(value) => formik.setFieldValue('subId', value)}
        className={'mb-8'}
        mdLabel="3"
        mdInput="9"
        error={formik.errors.subId}
      />
      <InlineSwitch
        label={'Allow Buyer To Pause Targets'}
        checked={formik.values.canPauseTargets}
        onChange={(checked) => formik.setFieldValue('canPauseTargets', checked)}
        className={'mb-8'}
        mdLabel="3"
        mdInput="9"
        error={''}
      />
      <InlineSwitch
        label={'Allow Buyer To Set Target Concurrency'}
        checked={formik.values.canSetConcurrencyCaps}
        onChange={(checked) => formik.setFieldValue('canSetConcurrencyCaps', checked)}
        className={'mb-8'}
        mdLabel="3"
        mdInput="9"
        error={''}
      />
      <InlineSwitch
        label={'Allow Buyer To Dispute Call Conversions'}
        checked={formik.values.canDisputeConversions}
        onChange={(checked) => formik.setFieldValue('canDisputeConversions', checked)}
        className={'mb-8'}
        mdLabel="3"
        mdInput="9"
        error={''}
      />
      <div className="row mt-12">
        <div className="col-md-3"></div>
        <div className="col-md-9">
        <Button className="w-32 mr-4" onClick={() => formik.handleSubmit()}>CREATE</Button>
        <Button outlined onClick={() => props.requestClose()}>CANCEL</Button>
        </div>
      </div>
    </div>
  );
};

const EditBuyer: React.FunctionComponent<any> = (props) => {
  const { loading, error, data } = useQuery(GET_OWNER, {
    variables: { id: props.id },
  });

  if(loading) return <></>;
  if(error) return <>{error}</>;

  return <EditBuyerContent buyer={{ ...data.buyer, id: data.buyer.id }} requestClose={() => props.requestClose()} />;
};

const EditBuyerContent: React.FunctionComponent<any> = (props) => {
  const buyer = props.buyer;

  const formik = useFormik({
    initialValues: {
      id: buyer.id,
      name: buyer.name,
      subId: buyer.subId,
      canDisputeConversions: buyer.canDisputeConversions,
      canPauseTargets: buyer.canPauseTargets,
      canSetConcurrencyCaps: buyer.canSetConcurrencyCaps,
      enabled: false
    },
    validationSchema: yup.object().shape({
      name: yup.string().required(),
      subId: yup.string().required()
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      void updateBuyer({ variables: values });
    }
  });

  const [ updateBuyer ] = useMutation(
    UPDATE_OWNER,
    {
      onCompleted: () => {
        NotificationManager.success('Buyer has been updated');
        props.requestClose();
      },
    }
  );

  return(
    <div className="py-8">
    <InlineTextInput
      label={'Company'}
      value={formik.values.name}
      onChange={(value) => formik.setFieldValue('name', value)}
      placeholder={'MGL'}
      className={'mb-8'}
      mdLabel="3"
      mdInput="9"
      error={formik.errors.name}
    />
    <InlineTextInput
      label={'Sub ID'}
      value={formik.values.subId}
      onChange={(value) => formik.setFieldValue('subId', value)}
      className={'mb-8'}
      mdLabel="3"
      mdInput="9"
      error={formik.errors.subId}
    />
    <InlineSwitch
      label={'Allow Buyer To Pause Targets'}
      checked={formik.values.canPauseTargets}
      onChange={(checked) => formik.setFieldValue('canPauseTargets', checked)}
      className={'mb-8'}
      mdLabel="3"
      mdInput="9"
      error={''}
    />
    <InlineSwitch
      label={'Allow Buyer To Set Target Concurrency'}
      checked={formik.values.canSetConcurrencyCaps}
      onChange={(checked) => formik.setFieldValue('canSetConcurrencyCaps', checked)}
      className={'mb-8'}
      mdLabel="3"
      mdInput="9"
      error={''}
    />
    <InlineSwitch
      label={'Allow Buyer To Dispute Call Conversions'}
      checked={formik.values.canDisputeConversions}
      onChange={(checked) => formik.setFieldValue('canDisputeConversions', checked)}
      className={'mb-8'}
      mdLabel="3"
      mdInput="9"
      error={''}
    />
      <div className="row mt-12">
        <div className="col-md-3"></div>
        <div className="col-md-9">
        <Button className="w-32 mr-4" onClick={() => formik.handleSubmit()}>UPDATE</Button>
        <Button outlined onClick={() => props.requestClose()}>CANCEL</Button>
        </div>
      </div>
    </div>
  );
}

export default Index;
