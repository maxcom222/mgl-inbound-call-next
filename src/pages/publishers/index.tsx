import React, { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import * as yup from 'yup';
import { useFormik } from 'formik';

import {
  GET_AFFILIATE,
  VIEW_AFFILIATES,
  INSERT_AFFILIATE,
  UPDATE_AFFILIATE,
  DELETE_AFFILIATE
} from 'shared/queries/publishers';
import Layout from 'layouts';
import Widget from 'components/widget';
import Datatable from 'components/datatable';
import { Badge, CircularBadge } from 'components/badges';
import { confirmAlert } from 'react-confirm-alert';
import { InlineTextInput, InlineSwitch, InlineBoxSelect } from 'components/forms/inline-inputs';
import { NotificationManager } from 'react-notifications';
import { Button } from 'components/buttons';
import WidgetPannel from 'components/widget-pannel';
import { Tooltip } from 'react-tippy';

const Index: React.FunctionComponent<any> = () => {
  const [ expandRow, setExpandRow ] = useState<any>(false);

  const { loading, data, refetch } = useQuery(VIEW_AFFILIATES);
  const [ deletePublisher ] = useMutation(
    DELETE_AFFILIATE,
    {
      onCompleted: () => {
        NotificationManager.success('Publisher has been deleted');
        void refetch();
      }
    }
  );

  const handleConfirmDelete = (id: number):void => {
    confirmAlert({
      title: 'Confirm Delete Publisher',
      message: 'Are you sure to delete this publisher?',
      buttons: [
        {
          label: 'Yes, delete it!',
          onClick: () => {
            void deletePublisher({
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
        Header: 'Name',
        accessor: (d: any) => ({
          id: d.id,
          name: d.name,
          isSelf: d.isSelf
        }),
        Cell: (props: any) =>
          props.value.isSelf ? (
            'You'
          ) : (
            props.value.name
          ),
      },
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Live',
        accessor: 'live',
        Cell: 0,
      },
      {
        Header: 'Create Numbers',
        accessor: 'createNumbers',
        Cell: (cell: any) => (
          cell.value
            ? (
              <Tooltip
                title="Publisher can create their own numbers billed to your account."
                position="right"
                arrow={true}
                duration={0}
                hideDuration={0}
              >
                Yes
              </Tooltip>
            )
            : (
              <Tooltip
                title="Publisher can't create their own numbers billed to your account."
                position="right"
                arrow={true}
                duration={0}
                hideDuration={0}
              >
                No
              </Tooltip>
            )
        )
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
        // Cell: (props: any) => props.value.length
      },
      {
        Header: 'Status',
        accessor: 'enabled',
        Cell: (props: any) =>
          props.value ? (
            <Tooltip
              title="Enabled"
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
          <div style={{ display: 'flex' }}>
            <Button
              flat
              icon
              leftIcon="Edit"
              tooltip="Edit Publisher"
              className="mx-1"
              onClick={() => {
                setExpandRow({
                  index: cell.row.index % cell.state.pageSize,
                  content: (
                    <EditPublisher
                      id={cell.value.id}
                      requestClose={() => {
                        void refetch();
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
              leftIcon="UserPlus"
              tooltip="Manage Invites"
              className="mx-1"
              onClick={() => {
                setExpandRow({
                  index: cell.row.index % cell.state.pageSize,
                  content: (
                    <Invites
                      id={cell.value.id}
                      requestClose={() => {
                        void refetch();
                        setExpandRow(false);
                      }}
                    />
                  )
                });
              }}
            />
            <Button flat icon leftIcon="PieChart" tooltip="View Reports" className="mx-1" />
            <Button flat icon leftIcon="PauseCircle" tooltip="Pause Publisher" className="mx-1" />
            <Button
              flat
              icon
              leftIcon="XCircle"
              tooltip="Delete Publisher"
              className="mx-1"
              onClick={() => handleConfirmDelete(cell.value.id)}
            />
          </div>
        ),
      },
    ],
    []
  );

  if(loading) return <></>;

  return (
    <Layout>
      <Widget title="Manage Publishers">
        <Datatable
          columns={columns}
          data={data.affiliates}
          searchable
          customColumnable
          noPagination
          headerLeft={
            <Button outlined size="sm" leftIcon="Plus" color="green" onClick={() => {
              setExpandRow({
                index: -1,
                content: (
                  <AddPublisher requestClose={() => {
                    void refetch();
                    setExpandRow(false);
                  }} />
                )
              });
            }}>
              ADD PUBLISHER
            </Button>
          }
          expandRow={expandRow}
        />
      </Widget>
    </Layout>
  );
};

// expand rows

const AddPublisher: React.FunctionComponent<any> = (props) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      subId: '',
      createNumbers: false,
      blockCallsIfCapped: true,
      accessToRecordings: true
    },
    validationSchema: yup.object().shape({
      name: yup.string().required(),
      subId: yup.string().required(),
      createNumbers: yup.boolean().required(),
      blockCallsIfCapped: yup.boolean().required(),
      accessToRecordings: yup.boolean().required()
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      void createPublisher({ variables: values });
    }
  });

  const [ createPublisher ] = useMutation(
    INSERT_AFFILIATE,
    {
      onCompleted: () => {
        NotificationManager.success('Publisher has been added');
        props.requestClose();
      },
    }
  );

  return (
    <div className="py-8">
      <InlineTextInput
        label="Name"
        value={formik.values.name}
        onChange={(value) => formik.setFieldValue('name', value)}
        error={formik.errors.name}
        tooltip="Enter your Publisher's company name."
        borderUnderline
        placeholder="MGL"
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="Sub ID"
        value={formik.values.subId}
        onChange={(value) => formik.setFieldValue('subId', value)}
        error={formik.errors.subId}
        tooltip="Enter your Publisher's tracking subid."
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineSwitch
        label="Number Creation"
        checked={formik.values.createNumbers}
        onChange={(checked) => formik.setFieldValue('createNumbers', checked)}
        error=""
        tooltip="When enabled, your publisher can create their own numbers."
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineBoxSelect
        label="Block Incoming Calls After Cap Is Reached"
        options={[
          {
            label: 'Allow',
            value: true
          },
          {
            label: 'Block',
            value: false
          },
        ]}
        value={formik.values.blockCallsIfCapped}
        onChange={(value) => formik.setFieldValue('blockCallsIfCapped', value)}
        tooltip="Use Global Setting, Enable or Disable the ability to block calls after the cap is reached."
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineBoxSelect
        label="Access To Recordings"
        options={[
          {
            label: 'Enabled',
            value: true
          },
          {
            label: 'Disabled',
            value: false
          },
        ]}
        value={formik.values.accessToRecordings}
        onChange={(value) => formik.setFieldValue('accessToRecordings', value)}
        tooltip="Use Global Setting, Enable or Disable the publisher ability to see recordings in the report."
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <div className="row mt-12">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button className="w-32 mr-4" onClick={() => formik.handleSubmit()}>ADD</Button>
          <Button outlined onClick={() => props.requestClose()}>CANCEL</Button>
        </div>
      </div>
    </div>
  );
};

const EditPublisher: React.FunctionComponent<any> = (props) => {
  const { loading, error, data } = useQuery(GET_AFFILIATE, {
    variables: { id: props.id },
  });

  if(loading) return <></>;
  if(error) return <>{error}</>;

  return (
    <EditPublisherContent
      publisher={{...data.affiliate, id: props.id}}
      requestClose={() => props.requestClose()}
    />
  );
};

const EditPublisherContent: React.FunctionComponent<any> = (props) => {
  const publisher = props.publisher;
  const formik = useFormik({
    initialValues: {
      id: publisher.id,
      name: publisher.name,
      subId: publisher.subId,
      createNumbers: publisher.createNumbers,
      blockCallsIfCapped: publisher.blockCallsIfCapped,
      accessToRecordings: publisher.accessToRecordings
    },
    validationSchema: yup.object().shape({
      name: yup.string().required(),
      subId: yup.string().required()
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      void updatePublisher({ variables: values });
    }
  });

  const [ updatePublisher ] = useMutation(
    UPDATE_AFFILIATE,
    {
      onCompleted: () => {
        NotificationManager.success('Publisher has been updated');
        props.requestClose();
      },
    }
  );

  return (
    <div className="py-8">
      <InlineTextInput
        label="Name"
        value={formik.values.name}
        onChange={(value) => formik.setFieldValue('name', value)}
        error={formik.errors.name}
        tooltip="Enter your Publisher's company name."
        borderUnderline
        placeholder="MGL"
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="Sub ID"
        value={formik.values.subId}
        onChange={(value) => formik.setFieldValue('subId', value)}
        error={formik.errors.subId}
        tooltip="Enter your Publisher's tracking subid."
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineSwitch
        label="Number Creation"
        checked={formik.values.createNumbers}
        onChange={(checked) => formik.setFieldValue('createNumbers', checked)}
        error=""
        tooltip="When enabled, your publisher can create their own numbers."
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineBoxSelect
        label="Block Incoming Calls After Cap Is Reached"
        options={[
          {
            label: 'Allow',
            value: true
          },
          {
            label: 'Block',
            value: false
          },
        ]}
        value={formik.values.blockCallsIfCapped}
        onChange={(value) => formik.setFieldValue('blockCallsIfCapped', value)}
        tooltip="Use Global Setting, Enable or Disable the ability to block calls after the cap is reached."
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineBoxSelect
        label="Access To Recordings"
        options={[
          {
            label: 'Enabled',
            value: true
          },
          {
            label: 'Disabled',
            value: false
          },
        ]}
        value={formik.values.accessToRecordings}
        onChange={(value) => formik.setFieldValue('accessToRecordings', value)}
        tooltip="Use Global Setting, Enable or Disable the publisher ability to see recordings in the report."
        className="mb-8"
        mdLabel="3"
        mdInput="9"
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

const Invites: React.FunctionComponent<any> = (props) => {
  const invites = [1];

  const [adding, setAdding] = useState(false);

  return(
    <div className="px-5">
      <WidgetPannel
        title="Users"
        paddingTop={4}
        headerRight={
          <Button
            outlined
            leftIcon="X"
            size="xs"
            color="red"
            onClick={() => props.requestClose()}
          >
            CLOSE
          </Button>
        }
      >
        <div className="">
          <Button
            outlined
            size="sm"
            leftIcon="Send"
            color="green"
            onClick={() => setAdding(true)}
          >
            INVITE USER
          </Button>
        </div>
        <div>
          {adding &&
            <AddInvite
              requestClose={() => setAdding(false)}
            />
          }

          {
            invites.length > 0
              ? (
                invites.map((el, key) => (
                  <div key={key} className="p-3 border border-black mt-4">
                    <div className="row">
                      <div className="col-md-10">
                        <p className="text-base mb-1">Chris Clegg</p>
                        <p className="text-sm">chris@actionmarketingsolutions.com</p>
                      </div>
                      <div className="col-md-1 flex items-center">
                        <Badge size="sm" color="yellow">Pending</Badge>
                      </div>
                      <div className="col-md-1 flex justify-end items-center">
                        <Button
                          flat
                          icon
                          leftIcon="XCircle"
                          tooltip="Delete Invite"
                          className="mx-1"
                          onClick={() => false}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )
              : (
                <div className="mt-4 p-3">
                  You haven&apos;t invited any users.
                </div>
              )
          }

        </div>
      </WidgetPannel>
    </div>
  );
}

// contents in rows

const AddInvite: React.FunctionComponent<any> = (props) => {
  const validateEmail = (s, t):boolean => {
    if(s === t){
      return true;
    }

    formik.setFieldError('_emailConfirm', 'Emails don\'t match');

    return false;
  }

  const formik = useFormik({
    initialValues: {
      _firstName: '',
      _lastName: '',
      _email: '',
      _emailConfirm: '',

      submitting: false
    },
    validationSchema: yup.object().shape({
      _firstName: yup.string().required(),
      _lastName: yup.string().required(),
      _email: yup.string().email().required(),
      _emailConfirm: yup.string().email().required()
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      if(validateEmail(values._email, values._emailConfirm)){
        formik.setFieldValue('submitting', true);
      }
    }
  });

  return(
    <div className="p-4">
      <InlineTextInput
        label="Email Address"
        placeholder="support@mgl.com"
        value={formik.values._email}
        onChange={(value) => formik.setFieldValue('_email', value)}
        error={formik.errors._email}
        tooltip="This email will be used to send the invite and for further account correspondence."
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="Confirm Email"
        placeholder="support@mgl.com"
        value={formik.values._emailConfirm}
        onChange={(value) => formik.setFieldValue('_emailConfirm', value)}
        error={formik.errors._emailConfirm}
        tooltip="Confirm user's email address."
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="First Name"
        placeholder="John"
        value={formik.values._firstName}
        onChange={(value) => formik.setFieldValue('_firstName', value)}
        error={formik.errors._firstName}
        tooltip="Enter user's first name."
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="Last Name"
        placeholder="Smith"
        value={formik.values._lastName}
        onChange={(value) => formik.setFieldValue('_lastName', value)}
        error={formik.errors._lastName}
        tooltip="Enter user's last name."
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <div className="row mt-12">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button
            className="w-32 mr-4"
            loading={formik.values.submitting}
            onClick={() => formik.handleSubmit()}
          >
            INVITE
          </Button>
          <Button outlined onClick={() => props.requestClose()}>CANCEL</Button>
        </div>
      </div>
    </div>
  );
}

export default Index;
