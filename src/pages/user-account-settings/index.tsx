import React from 'react';
import * as yup from 'yup';
import {useFormik} from 'formik';

import Layout from 'layouts';
import Widget from 'components/widget';
import {InlineSwitch} from 'components/forms/inline-inputs';
import { Button } from 'components/buttons';

const Index: React.FunctionComponent<any> = () => <PageContent />

const PageContent: React.FunctionComponent<any> = () => {
  const formik = useFormik<any>({
    initialValues: {
      _publisherAccessToRecordings: '',
      _blockCallsAfterPayoutCapIsReached: '',
      _reportingUserCanViewAs: '',

      submitting: false
    },
    validationSchema: yup.object().shape({
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      formik.setFieldValue('submitting', true);
    }
  });

  return (
    <Layout>
      <Widget title="Manage Account Settings">
        <InlineSwitch
          label="Publisher Access to Recordings"
          checked={formik.values._publisherAccessToRecordings}
          onChange={(checked) => formik.setFieldValue('_publisherAccessToRecordings', checked)}
          error={formik.errors._publisherAccessToRecordings}
          tooltip="When enabled, publishers will have the ability to see call recordings."
          className="mb-8"
          mdLabel="3"
          mdInput="9"
        />
        <InlineSwitch
          label="Block Calls After Payout Cap Is Reached"
          checked={formik.values._blockCallsAfterPayoutCapIsReached}
          onChange={(checked) => formik.setFieldValue('_blockCallsAfterPayoutCapIsReached', checked)}
          error={formik.errors._blockCallsAfterPayoutCapIsReached}
          tooltip="When enabled, blocks calls after Publisher Cap is reached."
          className="mb-8"
          mdLabel="3"
          mdInput="9"
        />
        <InlineSwitch
          label="Reporting User Can View As"
          checked={formik.values._reportingUserCanViewAs}
          onChange={(checked) => formik.setFieldValue('_reportingUserCanViewAs', checked)}
          error={formik.errors._reportingUserCanViewAs}
          tooltip="Toggle Switch to Enable or Disable this setting"
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
      </Widget>

    </Layout>
  );
};

export default Index;
