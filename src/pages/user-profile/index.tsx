import React from 'react';
import * as yup from 'yup';
import {useFormik} from 'formik';

import Layout from 'layouts';
import Widget from 'components/widget';
import WidgetPannel from 'components/widget-pannel';
import {InlineTextInput} from 'components/forms/inline-inputs';
import { Button } from 'components/buttons';

const Index: React.FunctionComponent<any> = () => (
  <Layout>
    <Widget title="Profile">
      <PersonalInfo />
      <ChangePassword />
    </Widget>
  </Layout>
)

const PersonalInfo: React.FunctionComponent<any> = () => {
  const formik = useFormik<any>({
    initialValues: {
      _firstName: '',
      _lastName: '',
      _mobileNumber: '',
      _skypeHandle: '',

      submitting: false
    },
    validationSchema: yup.object().shape({
      _firstName: yup.string().required(),
      _lastName: yup.string().required(),
      _mobileNumber: yup.string().required(),
      _skypeHandle: yup.string().required()
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      formik.setFieldValue('submitting', true);
    }
  });

  return (
    <div className="pb-10">
      <InlineTextInput
        label="First Name"
        value={formik.values._firstName}
        onChange={(value) => formik.setFieldValue('_firstName', value)}
        error={formik.errors._firstName}
        tooltip="Enter your first name."
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
        tooltip="Enter your last name."
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="Mobile Number"
        value={formik.values._mobileNumber}
        onChange={(value) => formik.setFieldValue('_mobileNumber', value)}
        error={formik.errors._mobileNumber}
        tooltip="Enter your mobile number."
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="Skype Handle"
        value={formik.values._skypeHandle}
        onChange={(value) => formik.setFieldValue('_skypeHandle', value)}
        error={formik.errors._skypeHandle}
        tooltip="MGL account executives are available on Skype. Update your information in case we need to reach you."
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <div className="row mt-12">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button
            className="w-32"
            onClick={() => formik.handleSubmit()}
            loading={formik.values.submitting}
          >
            UPDATE
          </Button>
        </div>
      </div>
    </div>
  );
};

const ChangePassword: React.FunctionComponent<any> = () => {
  const validateEmail = (s, t):boolean => {
    if(s === t){
      return true;
    }

    formik.setFieldError('_passwordConfirm', 'Passwords don\'t match');

    return false;
  }

  const formik = useFormik<any>({
    initialValues: {
      _currentPassword: '',
      _password: '',
      _passwordConfirm: '',

      submitting: false
    },
    validationSchema: yup.object().shape({
      _currentPassword: yup.string().required(),
      _password: yup.string().required(),
      _passwordConfirm: yup.string().required()
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      if(validateEmail(values._password, values._passwordConfirm)){
        formik.setFieldValue('submitting', true);
      }
    }
  });

  return (
    <WidgetPannel title="Change Password">
      <InlineTextInput
        label="Current Password"
        value={formik.values._currentPassword}
        onChange={(value) => formik.setFieldValue('_currentPassword', value)}
        error={formik.errors._currentPassword}
        tooltip="Enter your current password"
        type="password"
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="New Password"
        value={formik.values._password}
        onChange={(value) => formik.setFieldValue('_password', value)}
        error={formik.errors._password}
        tooltip="Enter your new password"
        type="password"
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="Confirm New Password"
        value={formik.values._passwordConfirm}
        onChange={(value) => formik.setFieldValue('_passwordConfirm', value)}
        error={formik.errors._passwordConfirm}
        tooltip="Re-Enter your new password"
        type="password"
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <div className="row mt-12">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button
            className="w-48"
            onClick={() => formik.handleSubmit()}
            loading={formik.values.submitting}
          >
            CHANGE PASSWORD
          </Button>
        </div>
      </div>
    </WidgetPannel>
  );
};

export default Index;
