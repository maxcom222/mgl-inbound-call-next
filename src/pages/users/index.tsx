import React, {useMemo, useState} from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

import Layout from 'layouts';
import Widget from 'components/widget';
import Datatable from 'components/datatable';
import {InlineBoxSelect, InlineTextInput} from 'components/forms/inline-inputs';
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
        Header: 'Email',
        accessor: '_email',
      },
      {
        Header: 'Role',
        accessor: '_role',
      },
      {
        Header: 'Invitation',
        accessor: '_invitation',
      },
      {
        Header: 'Can Export Reports',
        accessor: '_canExportReports',
      },
      {
        Header: 'Actions',
        accessor: 'id',
        Cell: () => (
          <Button
            flat
            icon
            leftIcon="XCircle"
            className="mx-1"
            tooltip="Remove User"
            onClick={() => false}
          />
        ),
      },
    ],
    []
  );

  return (
    <Layout>
      <Widget title="Manage Users">
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
                  <InviteUser
                    requestClose={() => {
                      // void refetch();
                      setExpandRow(false);
                    }}
                  />
                )
              });
            }}>
              INVITE USER
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

const InviteUser: React.FunctionComponent<any> = (props) => {
  const validateEmail = (s, t):boolean => {
    if(s === t){
      return true;
    }

    formik.setFieldError('_emailConfirm', 'Emails don\'t match');

    return false;
  }

  const formik = useFormik<any>({
    initialValues: {
      _firstName: '',
      _lastName: '',
      _email: '',
      _emailConfirm: '',
      _role: 'ADMIN',

      submitting: false
    },
    validationSchema: yup.object().shape({
      _firstName: yup.string().required(),
      _lastName: yup.string().required(),
      _email: yup.string().email().required(),
      _emailConfirm: yup.string().email().required(),
      _role: yup.string().required(),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      if(validateEmail(values._email, values._emailConfirm)){
        formik.setFieldValue('submitting', true);
      }
    }
  });

  console.log(formik.values);

  return (
    <div className="py-8">
      <InlineTextInput
        label="First Name"
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
        value={formik.values._lastName}
        onChange={(value) => formik.setFieldValue('_lastName', value)}
        error={formik.errors._lastName}
        tooltip="Enter user's last name."
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="Email Address"
        value={formik.values._email}
        onChange={(value) => formik.setFieldValue('_email', value)}
        error={formik.errors._email}
        tooltip="Enter user's email address to be used to login MGL."
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="Confirm Email"
        value={formik.values._emailConfirm}
        onChange={(value) => formik.setFieldValue('_emailConfirm', value)}
        error={formik.errors._emailConfirm}
        tooltip="Confirm user's email address."
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineBoxSelect
        label="Role"
        options={[
          {
            label: 'Admin',
            value: 'ADMIN'
          },
          {
            label: 'Report Access',
            value: 'REPORT_ACCESS'
          }
        ]}
        value={formik.values._role}
        onChange={(value) => formik.setFieldValue('_role', value)}
        error={formik.errors._role}
        tooltip="THis will set the access level of the user."
        className="mb-8"
        mdLabel="3"
        mdInput="9"
        fixWidth
      />
      <div className="row mt-12">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button
            className="w-32 mr-2"
            onClick={() => formik.handleSubmit()}
            loading={formik.values.submitting}
          >
            INVITE
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

export default Index;