import React from 'react';
import { useMutation } from '@apollo/client';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { NotificationManager } from 'react-notifications';
import Router from 'next/router';

import { CREATE_DRAFT_CAMPAIGN } from 'shared/queries/campaigns';
import Layout from 'layouts';
import Widget from 'components/widget';
import WizardForm from 'components/wizard-form';
import countryOptions from 'json/countries.json';
import { InlineTextInput, InlineReactSelect } from 'components/forms/inline-inputs';
import { Alert } from 'components/alerts';
import { Button } from 'components/buttons';

const countries = countryOptions.map((el) => ({
  label: el.name,
  value: el.alpha2Code
}));

const Index: React.FunctionComponent<any> = () => {
  const [ createDraftCampaign ] = useMutation(
    CREATE_DRAFT_CAMPAIGN,
    {
      onCompleted: (res) => {
        NotificationManager.success('Campaign has been drafted');
        Router.push(`/campaigns/wizard/${res.campaign.id}/2`);
      },
    }
  );
  const setupFormik = useFormik({
    initialValues: {
      name: '',
      countryCode: ''
    },
    validationSchema: yup.object().shape({
      name: yup.string().required(),
      countryCode: yup.string().required(),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      void createDraftCampaign({
        variables: values
      });
    }
  });

  return(
    <Layout>
      <Widget title="Setup Your Campaign">
        <WizardForm
          steps={[
            {
              title: 'Setup Your Campaign',
              subTitle: 'Name your Campaign and choose your country.',
              component: (
                <>
                  <div className="mb-16">
                    <div className="mb-16">
                      <Alert type="info">
                        Please name your Campaign and select the country
                        where you would like to accept phone calls.
                      </Alert>
                    </div>
                    <InlineTextInput
                      label="Campaign Name"
                      placeholder="e.g. Facebook France Insurance"
                      value={setupFormik.values.name}
                      onChange={(value) => setupFormik.setFieldValue('name', value)}
                      error={setupFormik.errors.name}
                      tooltip="
                        Your campaign name will be used to display information around the MGL portal.
                        Short campaign names work best.
                      "
                      borderUnderline
                      className="mb-8"
                      mdLabel="4"
                      mdInput="8"
                    />
                    <InlineReactSelect
                      instanceId="react-select-country"
                      label="Country"
                      placeholder="Select Country"
                      options={countries}
                      value={setupFormik.values.countryCode}
                      onChange={(value) => setupFormik.setFieldValue('countryCode', value)}
                      error={setupFormik.errors.countryCode}
                      tooltip="Select the country you would like to purchase a phone number in."
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
                      <Button onClick={() => setupFormik.handleSubmit()}>
                        SAVE AND CONTINUE
                      </Button>
                    </div>
                  </div>
                </>
              ),
            },
            {
              title: 'Get a Tracking Number',
              subTitle:
                'Get a unique Tracking Number where you or your partners can send calls or use for advertising.'
            },
            {
              title: 'Add a Target',
              subTitle:
                "Forward your calls to buyers, call centers, or anywhere you'd like them to go."
            },
            {
              title: 'Set it Live!',
              subTitle:
                'Test your Tracking Number to see Ringba operate in real-time.'
            }
          ]}
          step={0}
        />
      </Widget>
    </Layout>
  );
}

export default Index;
