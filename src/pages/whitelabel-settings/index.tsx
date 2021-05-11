import React from 'react';
import * as yup from 'yup';
import {useFormik} from 'formik';

import Layout from 'layouts';
import Widget from 'components/widget';
import WidgetPannel from 'components/widget-pannel';
import {InlineTextInput} from 'components/forms/inline-inputs';
import { Button } from 'components/buttons';
import Help from 'components/help';
import WizardForm from 'components/wizard-form';

const Index: React.FunctionComponent<any> = () => (
  <Layout>
    <Widget title="Profile">
      <MainInfo />
      <Theme />
      <CNameSetup />
    </Widget>
  </Layout>
)

const MainInfo: React.FunctionComponent<any> = () => {
  const formik = useFormik<any>({
    initialValues: {
      _friendlyName: '',

      submitting: false
    },
    validationSchema: yup.object().shape({
      _friendlyName: yup.string().required()
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
        label="Friendly Name"
        value={formik.values._friendlyName}
        onChange={(value) => formik.setFieldValue('_friendlyName', value)}
        error={formik.errors._friendlyName}
        tooltip="Enter a Friendly Name to access the white label site"
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
            SAVE
          </Button>
        </div>
      </div>
    </div>
  );
};

const Theme: React.FunctionComponent<any> = () => (
    <WidgetPannel title="Theme">
      <div className="row">
        <div className="col-md-3">
          <label className="flex md:justify-end items-center pb-2 md:pb-0">
            <span className="text-sm text-default whitespace-no-wrap mr-1">White Label Theme</span>
            <Help>
              Launch the Theme Editor to create a custom branded portal for your users.
              You can preview your changes in realtime throughtout the entire portal.
            </Help>
          </label>
        </div>
        <div className="col-md-9">
          <Button
            outlined
            color="green"
            size="sm"
            className="w-48"
            onClick={() => false}
          >
            LAUNCH THEME EDITOR
          </Button>
        </div>
      </div>
    </WidgetPannel>
  );

const CNameSetup: React.FunctionComponent<any> = () => (
    <WidgetPannel
      title="CNAME Setup"
      tooltip="Validate your domain again, last request to validate timed out."
    >
      <WizardForm
        steps={[
          {
            title: 'Submit Your CNAME',
            subTitle: 'Submit your request to assign a CNAME on a domain you own to the white label portal.',
            component: (
              <>
                <div className="my-16">
                  <InlineTextInput
                    label="CNAME"
                    placeholder="Enter a CNAME"
                    value={''}
                    onChange={() => false}
                    error={''}
                    tooltip="Assign a CNAME to the white label site."
                    borderUnderline
                    className="mb-8"
                    mdLabel="4"
                    mdInput="8"
                  />
                </div>
                <div className="row">
                  <div className="flex justify-between col-md-6 col-md-offset-3">
                    <Button flat className="mr-4 invisible">
                      Back
                    </Button>
                    <Button
                      className="w-32"
                      onClick={() => false}
                    >
                      SAVE
                    </Button>
                  </div>
                </div>
              </>
            ),
          },
          {
            title: 'Review & Verify',
            subTitle:
              'Your request is reviewed and ownership of domain is confirmed.'
          },
          {
            title: 'Provision HTTPS Certificate',
            subTitle:
              'HTTPS certificate is being issued and configured on your CDN.'
          },
          {
            title: 'Configure DNS',
            subTitle:
              'Point the CNAME to the CDN in your DNS and verify the white label portal is up and running.'
          }
        ]}
        step={0}
      />
    </WidgetPannel>
  )

export default Index;
