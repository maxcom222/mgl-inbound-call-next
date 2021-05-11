import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { NotificationManager } from 'react-notifications';

import { VIEW_TARGETS } from 'shared/queries/targets';
import { Button } from 'components/buttons';
import api from '../../../../shared/utils/api';
import { GET_CAMPAIGN, UPDATE_DRAFT_CAMPAIGN, DELETE_CAMPAIGN } from '../../../../shared/queries/campaigns';
import { VIEW_AFFILIATES } from '../../../../shared/queries/publishers';
import { GET_NUMBERS_BY_PUBLISHER, GET_NUMBER } from '../../../../shared/queries/numbers';
import Layout from '../../../../layouts';
import Widget from '../../../../components/widget';
import WizardForm from '../../../../components/wizard-form';
import countryOptions from '../../../../json/countries.json';
import LoadingWidget from '../../../../components/loading/widget';
import {
  InlineTextInput,
  InlinePhoneInput,
  InlineBoxSelect,
  InlineReactSelect,
  InlineSwitch,
  InlineNumberInput
} from '../../../../components/forms/inline-inputs';
import { Alert } from '../../../../components/alerts';
import timezoneOptions from '../../../../json/timezones.json';

const countries = countryOptions.map((el) => ({
  label: el.name,
  value: el.alpha2Code
}));
const timezones = timezoneOptions.map((el) => ({
  label: el.text,
  value: el.value
}));

const Index: React.FunctionComponent<any> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { loading: campaignLoading, data: campaignData } = useQuery(GET_CAMPAIGN, {
    variables: {
      id
    }
  });
  const { loading: affiliatesLoading, data: affiliatesData } = useQuery(VIEW_AFFILIATES);

  if(campaignLoading || affiliatesLoading) return <LoadingWidget />;

  return <PageContent campaignDrafted={campaignData.campaign} affiliates={affiliatesData.affiliates} />
};

const PageContent: React.FunctionComponent<any> = (props) => {
  const router = useRouter();
  const initialStep = Number(router.query.step) - 1;
  const campaignDrafted = props.campaignDrafted;
  const affiliates = props.affiliates.filter((el) => el.isSelf === false);
  const selfAffiliateId = props.affiliates.find((el) => el.isSelf === true).id;

  const [ campaign, setCampaign ] = useState<any>({
    name: campaignDrafted.name,
    affiliates: [
      {
        phoneNumber: {},
        affiliateId: ''
      }
    ],
    targetIds: [],
    countryCode: campaignDrafted.countryCode,
    accountId: 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0'
  });
  const [ step, setStep ] = useState(initialStep);
  const [ isAddTargetSubmitting, setIsAddTargetSubmitting ] = useState(false);
  const [ isSetItLiveSubmitting , setIsSetItLiveSubmitting ] = useState(false);
  const [ newCampaignId, setNewCampaignId ] = useState();

  const setupFormik = useFormik({
    initialValues: {
      id: campaignDrafted.id,
      name: campaignDrafted.name,
      countryCode: campaignDrafted.countryCode
    },
    validationSchema: yup.object().shape({
      name: yup.string().required(),
      countryCode: yup.string().required(),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      void updateDraftCampaign({
        variables: values
      });
    }
  });
  const getTrackingNumberFormik = useFormik<any>({
    initialValues: {
      numberFor: 'me',
      publisher: selfAffiliateId,
      createNew: false,
      numberId: '',

      numbers: [],
      resource_type: '',
      area_code: '',
      phoneNumber: '',
      searched: false,
      submitting: false
    },
    validationSchema: yup.object().shape({
      numberFor: yup.string().required(),
      publisher: yup.string().when('numberFor', {
        is: 'publisher',
        then: yup.string().required()
      }),
      resource_type: yup.string().when('createNew', {
        is: (createNew) => createNew,
        then: yup.string().required()
      }),
      numberId: yup.string().when('createNew', {
        is: (createNew) => !createNew,
        then: yup.string().required()
      }),
      phoneNumber: yup.string().nullable().when('searched', {
        is: true,
        then: yup.string().required()
      }),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      if(values.createNew){
        getTrackingNumberFormik.setFieldValue('submitting', true);

        if(getTrackingNumberFormik.values.searched){
          void api.post('numbers/buy', {
            phoneNumber: values.phoneNumber,
            affiliateId : values.publisher,
            accountId: "e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0"
          })
          .then((res) => {
            console.log('created number..........', res);
            setCampaign({
              ...campaign,
              affiliates: [
                {
                  phoneNumber: getTrackingNumberFormik.values.phoneNumber,
                  affiliateId: values.publisher
                }
              ]
            });
            getTrackingNumberFormik.setFieldValue('submitting', false);
            NotificationManager.success('Number has been successfully created');
            setStep(2);
          });
        }else{
          void api.get('numbers/search', {
            params: {
              resource_type: values.resource_type,
              area_code: values.area_code
            }
          })
          .then((res) => {
            if(res.data.length === 0){
              NotificationManager.warning(`
                There is no available number.
                Try again after change parameters
              `);
            }else{
              getTrackingNumberFormik.setFieldValue('searched', true);
            }
            getTrackingNumberFormik.setFieldValue('numbers', res.data);
            getTrackingNumberFormik.setFieldValue('submitting', false);
          });
        }
      }else{
        getNumber({
          variables: {
            id: getTrackingNumberFormik.values.numberId
          }
        });
        setStep(2);
      }
    }
  });
  const addTargetFormik = useFormik({
    initialValues: {
      targetIds: [],
      createNew: false,
      name: '',
      type: 'number',
      number: '',
      sipAddress: '',
      sipUsername: '',
      sipPassword: '',
      timeZoneId: '',
      trackRevenue: false,

      subId: '',
      ownerId: '521002f2-c96a-41f1-9c00-576977ce9ec7',
      connectionTimeOut: 15,
      allTimeCap: -1,
      monthlyCap: -1,
      dailyCap: -1,
      hourlyCap: -1,
      concurrencyCap: -1,
      enabled: false
    },
    validationSchema: yup.object().shape({
      targetIds: yup.array().when('createNew', {
        is: false,
        then: yup.array().required()
      }),
      name: yup.string().when('createNew', {
        is: true,
        then: yup.string().required()
      }),
      type: yup.string().when('createNew', {
        is: true,
        then: yup.string().required()
      }),
      number: yup.string().when('createNew', {
        is: true,
        then: yup.string().required()
      }),
      sipAddress: yup.string().when('type', {
        is: 'sip',
        then: yup.string().required()
      }),
      timeZoneId: yup.string().when('createNew', {
        is: true,
        then: yup.string().required()
      })
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      if(values.createNew){
        const target = {
          targetGroupId: '',
          name: values.name,
          instructions: {
            data: {
              connectionTimeOut: 15,
              callType: values.type,
              number: values.number
            }
          },
          isHighRateTarget: false,
          subId: '',
          targetCallIncrement: 'onConvert',
          conversionTimerOffset: 0,
          schedule: {
            data: {
              concurrencyCap: values.concurrencyCap,
              hoursOfOperation: {
                data:[]
              },
              timeZoneId: values.timeZoneId,
              allTimeSumCap: -1,
              monthlySumCap: -1,
              dailySumCap: -1,
              hourlySumCap: -1,
              allTimeCap: values.allTimeCap,
              monthlyCap: values.monthlyCap,
              dailyCap: values.dailyCap,
              hourlyCap: values.hourlyCap
            }
          },
          criteria: {
            data: {
              tagRoutableRule: {
                data: {
                  tagCriteria: {
                    data: []
                  }
                }
              }
            }
          },
          accountId: 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0',
          ownerId: '521002f2-c96a-41f1-9c00-576977ce9ec7',
          enabled: true
        };
        console.log('target working', JSON.stringify(target));
        setIsAddTargetSubmitting(true);
        void api.post(`target/create`, target).then((res) => {
          setCampaign({
            ...campaign,
            targetIds: [ res.data.id ]
          });
          setIsAddTargetSubmitting(false);
          NotificationManager.success('Target has been successfully created');
          setStep(3);
        }).catch(() => {
          setIsAddTargetSubmitting(false);
          NotificationManager.error('Operation faild');
        });
      }else{
        setCampaign({
          ...campaign,
          targetIds: values.targetIds
        });
        setIsAddTargetSubmitting(false);
        setStep(3);
      }
    }
  });

  const initNumbers = ():void => {
    getTrackingNumberFormik.setFieldValue('phoneNumber', '');
    getTrackingNumberFormik.setFieldValue('searched', false);
    getTrackingNumberFormik.setFieldValue('numbers', []);
  }
  const handleProductivate = ():void => {
    setIsSetItLiveSubmitting(true);
    void api.post(`campaign/create`, campaign).then((res) => {
      setNewCampaignId(res.data.id);
      void deleteDraftCampaign({
        variables: {
          id: campaignDrafted.id
        }
      });
    }).catch(() => {
      setIsSetItLiveSubmitting(false);
      NotificationManager.error('Operation faild');
    });
  }

  const { data: publisherNumbersData } = useQuery(GET_NUMBERS_BY_PUBLISHER, {
    variables: {
      id: getTrackingNumberFormik.values.publisher
    }
  });
  const { data: targetsData } = useQuery(VIEW_TARGETS);
  const [ getNumber ] = useLazyQuery(
    GET_NUMBER, {
      onCompleted: (res) => {
        console.log('numberData', res);
        setCampaign({
          ...campaign,
          affiliates: [
            {
              phoneNumber: {
                friendlyName: res.number.friendlyName,
                phoneNumber: res.number.phoneNumber,
                lata: res.number.lata,
                locality: res.number.locality,
                rateCenter: res.number.rateCenter,
                latitude: res.number.latitude,
                longitude: res.number.longitude,
                region: res.number.region,
                postalCode: res.number.postalCode,
                isoCountry: res.number.isoCountry,
                addressRequirements: res.number.addressRequirements,
                beta: res.number.beta,
                capabilities: res.number.capabilities,
                isTollFree: res.number.isTollFree
              },
              affiliateId: res.number.affiliateId
            }
          ]
        });
      }
    }
  );

  const [ updateDraftCampaign ] = useMutation(
    UPDATE_DRAFT_CAMPAIGN,
    {
      onCompleted: (res) => {
        setCampaign({
          ...campaign,
          name: res.campaign.name,
          countryCode: res.campaign.countryCode
        });
        NotificationManager.success('Draft campaign has been updated');
        setStep(1);
      },
    }
  );
  const [ deleteDraftCampaign ] = useMutation(
    DELETE_CAMPAIGN,
    {
      onCompleted: () => {
        setIsSetItLiveSubmitting(false);
        NotificationManager.success('Campaign has been successfully published');
        void router.push(`/campaigns/${newCampaignId}`);
      }
    }
  );

  useEffect(() => {
    if(publisherNumbersData){
      if(publisherNumbersData.numbers.length > 0){
        console.log('publisherNumbersData A', publisherNumbersData);
        getTrackingNumberFormik.setFieldValue('createNew', false);
      }else{
        console.log('publisherNumbersData B', publisherNumbersData);
        getTrackingNumberFormik.setFieldValue('createNew', true);
      }
    }else{
      getTrackingNumberFormik.setFieldValue('createNew', false);
    }
  }, [ publisherNumbersData ]);

  console.log('campaign========', campaign);

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
                'Get a unique Tracking Number where you or your partners can send calls or use for advertising.',
              component: (
                <>
                  <div className="mb-16">
                    <div className="mb-16">
                      <Alert type="info">
                        Purchase or select an existing number to track
                        this Campaign&apos;s calls on the Ringba platform. If
                        you will be purchasing calls from a publisher,
                        then assign this number to a publisher,
                        otherwise, assign the number to yourself.
                      </Alert>
                    </div>
                    <InlineBoxSelect
                      label="This number is for"
                      value={getTrackingNumberFormik.values.numberFor}
                      options={[
                        {
                          label: 'Me',
                          value: 'me',
                        },
                        {
                          label: 'Publisher',
                          value: 'publisher',
                        }
                      ]}
                      onChange={(value) => {
                        if(value === 'me'){
                          getTrackingNumberFormik.setFieldValue('publisher', selfAffiliateId);
                        }else{
                          getTrackingNumberFormik.setFieldValue('publisher', '');
                        }
                        getTrackingNumberFormik.setFieldValue('numberFor', value);
                        initNumbers();
                      }}
                      error={getTrackingNumberFormik.errors.numberFor}
                      tooltip="Would you like to use this number, or associate it with a Publisher?"
                      className="mb-8"
                      fixWidth
                      mdLabel="4"
                      mdInput="8"
                    />
                    {
                      getTrackingNumberFormik.values.numberFor === 'publisher' &&
                        <div className="mb-4">
                          <InlineReactSelect
                            label="Publisher"
                            placeholder="Select Publisher"
                            value={getTrackingNumberFormik.values.publisher}
                            options={affiliates.map(
                              (el) => ({
                                label: el.name,
                                value: el.id,
                              })
                            )}
                            onChange={(value) => getTrackingNumberFormik.setFieldValue('publisher', value)}
                            error={getTrackingNumberFormik.errors.publisher}
                            tooltip="A Publisher is a partner or affiliate that generates inbound phone calls."
                            className="mb-8"
                            mdLabel="4"
                            mdInput="8"
                          />
                        </div>
                    }
                    { (publisherNumbersData && publisherNumbersData.numbers.length)
                      ? (
                        <InlineBoxSelect
                          label="Choose Option"
                          value={getTrackingNumberFormik.values.createNew}
                          options={[
                            {
                              label: 'Select Existing',
                              value: false,
                            },
                            {
                              label: 'Create New',
                              value: true,
                            }
                          ]}
                          onChange={(value) => {
                            getTrackingNumberFormik.setFieldValue('createNew', value);
                            initNumbers();
                          }}
                          error={getTrackingNumberFormik.errors.createNew}
                          tooltip="Choose to purchase new number or select one from existing available numbers."
                          className="mb-8"
                          fixWidth
                          mdLabel="4"
                          mdInput="8"
                        />
                      )
                      : ''
                    }
                    {getTrackingNumberFormik.values.createNew
                      ?
                        <>
                          <InlineBoxSelect
                            label="Number Type"
                            value={getTrackingNumberFormik.values.resource_type}
                            options={[
                              {
                                label: 'Toll Free',
                                value: 'tollfree',
                              },
                              {
                                label: 'Local',
                                value: 'local',
                              }
                            ]}
                            onChange={(value) => {
                              getTrackingNumberFormik.setFieldValue('resource_type', value);
                              initNumbers();
                            }}
                            error={getTrackingNumberFormik.errors.resource_type}
                            tooltip={`
                              Choose the number type
                              <br>
                              <br>
                              TollFree: Only use Toll Free numbers. 
                              <br>
                              Notice that Toll Free numbers have higher per-minute charges than local phone numbers
                              <br>
                              <br>
                              Local: Only use Local numbers.
                            `}
                            className="mb-8"
                            mdLabel="4"
                            mdInput="8"
                          />
                          <InlineNumberInput
                            label="Prefix"
                            value={getTrackingNumberFormik.values.area_code}
                            placeholder="Optional"
                            onChange={(value) => {
                              getTrackingNumberFormik.setFieldValue('area_code', value);
                              initNumbers();
                            }}
                            error={getTrackingNumberFormik.errors.area_code}
                            tooltip="Entering '212' will make MGL only select phone numbers with the prefix '212'."
                            integer
                            min={0}
                            width="sm"
                            className="mb-8"
                            mdLabel="4"
                            mdInput="8"
                          />
                          {getTrackingNumberFormik.values.numbers.length > 0 &&
                            <InlineReactSelect
                              label="Phone Number"
                              placeholder="Select Number"
                              value={getTrackingNumberFormik.values.phoneNumber}
                              options={getTrackingNumberFormik.values.numbers.map((el, key) => ({
                                label: el.phoneNumber,
                                value: key
                              }))}
                              onChange={(value) =>
                                getTrackingNumberFormik.setFieldValue(
                                  'phoneNumber', getTrackingNumberFormik.values.numbers[value]
                                )
                              }
                              error={getTrackingNumberFormik.errors.phoneNumber}
                              tooltip="Pick one among searched numbers."
                              className="mb-8"
                              mdLabel="4"
                              mdInput="8"
                            />
                          }
                        </>
                      :
                        <>
                          {
                            (publisherNumbersData && publisherNumbersData.numbers) &&
                              <InlineReactSelect
                                label="Select Existing Number"
                                placeholder="Select"
                                options={publisherNumbersData.numbers.map((el) => ({
                                  label: el.phoneNumber,
                                  value: el.id
                                }))}
                                value={getTrackingNumberFormik.values.numberId}
                                onChange={(value) => getTrackingNumberFormik.setFieldValue('numberId', value)}
                                error={getTrackingNumberFormik.errors.numberId}
                                tooltip="
                                  Select an existing number to be used as a default Publisher number
                                  for this Campaign.
                                "
                                className="mb-8"
                                mdLabel="4"
                                mdInput="8"
                              />
                          }
                        </>
                    }
                  </div>
                  <div className="row">
                    <div className="flex justify-between col-md-6 col-md-offset-3">
                      <Button flat className="mr-4" onClick={() => setStep(0)}>
                        Back
                      </Button>
                      <Button
                        className="w-48"
                        loading={getTrackingNumberFormik.values.submitting}
                        onClick={() => getTrackingNumberFormik.handleSubmit()}
                      >
                        {(() => {
                          let textBtn = '';

                          if(getTrackingNumberFormik.values.createNew){
                            if(getTrackingNumberFormik.values.searched){
                              textBtn = 'GET MY NUMBER';
                            }else{
                              textBtn = 'SEARCH NUMBERS';
                            }
                          }else{
                            textBtn = 'ACTIVATE NUMBER';
                          }

                          return textBtn;
                        })()}
                      </Button>
                    </div>
                  </div>
                </>
              ),
            },
            {
              title: 'Add a Target',
              subTitle:
                "Forward your calls to buyers, call centers, or anywhere you'd like them to go.",
              component: (
                <>
                  <div className="mb-16">
                    <div className="mb-16">
                      <Alert type="info">
                        Targets are the receiving party of any calls routed with MGL.
                        The call flow starts with a call to a number generated by you or a publisher,
                        and ends with a target accepting and answering the call.
                        A target is defined by an inbound phone number or SIP address.
                      </Alert>
                    </div>
                    <InlineBoxSelect
                      label="Choose Option"
                      value={addTargetFormik.values.createNew}
                      options={[
                        {
                          label: 'Select Existing',
                          value: false,
                        },
                        {
                          label: 'Create New',
                          value: true,
                        }
                      ]}
                      onChange={(value) => addTargetFormik.setFieldValue('createNew', value)}
                      error={addTargetFormik.errors.createNew}
                      tooltip="Choose to route calls to an existing Target or create a new one."
                      className="mb-8"
                      fixWidth
                      mdLabel="4"
                      mdInput="8"
                    />
                    {
                      addTargetFormik.values.createNew
                        ? (
                          <>
                            <InlineTextInput
                              label="Target Name"
                              placeholder="e.g. Manila Call Center"
                              value={addTargetFormik.values.name}
                              onChange={(value) => addTargetFormik.setFieldValue('name', value)}
                              error={addTargetFormik.errors.name}
                              tooltip="
                                Choose a name for your new Target.
                                Shorter names are better as this name will be used around MGL for reporting.
                              "
                              borderUnderline
                              className="mb-8"
                              mdLabel="4"
                              mdInput="8"
                            />
                            <InlineBoxSelect
                              label="Target Type"
                              value={addTargetFormik.values.type}
                              options={[
                                {
                                  label: 'Phone Number',
                                  value: 'number',
                                },
                                {
                                  label: 'SIP',
                                  value: 'sip',
                                }
                              ]}
                              onChange={(value) => addTargetFormik.setFieldValue('type', value)}
                              error={addTargetFormik.errors.type}
                              tooltip="
                                Would you like to route your calls to this target using SIP or a phone number?
                              "
                              className="mb-8"
                              fixWidth
                              mdLabel="4"
                              mdInput="8"
                            />
                            {
                              addTargetFormik.values.type === 'number'
                                ? (
                                  <InlinePhoneInput
                                    label="Phone Number"
                                    value={addTargetFormik.values.number}
                                    onChange={(value) => addTargetFormik.setFieldValue('number', value)}
                                    error={addTargetFormik.errors.number}
                                    tooltip="
                                      Enter your Target's phone number with local area code.
                                      No spaced, hyphens or other punctuation.
                                    "
                                    className="mb-8"
                                    mdLabel="4"
                                    mdInput="8"
                                  />
                                )
                                : (
                                  <>
                                    <InlineTextInput
                                      label="SIP Address"
                                      placeholder="e.g. 87.65.135.142 or sip.address.com"
                                      value={addTargetFormik.values.sipAddress}
                                      onChange={(value) => addTargetFormik.setFieldValue('sipAddress', value)}
                                      error={addTargetFormik.errors.sipAddress}
                                      tooltip="The SIP address of your Target's server"
                                      className="mb-8"
                                      mdLabel="4"
                                      mdInput="8"
                                    />
                                    <InlineTextInput
                                      label="SIP Address"
                                      placeholder="Username"
                                      value={addTargetFormik.values.sipUsername}
                                      onChange={(value) => addTargetFormik.setFieldValue('sipUsername', value)}
                                      error={addTargetFormik.errors.sipUsername}
                                      tooltip="Your SIP server username"
                                      className="mb-8"
                                      mdLabel="4"
                                      mdInput="8"
                                    />
                                    <InlineTextInput
                                      label="SIP Address"
                                      placeholder="Password"
                                      value={addTargetFormik.values.sipPassword}
                                      onChange={(value) => addTargetFormik.setFieldValue('sipPassword', value)}
                                      error={addTargetFormik.errors.sipPassword}
                                      tooltip="Your SIP server password"
                                      className="mb-8"
                                      mdLabel="4"
                                      mdInput="8"
                                    />
                                  </>
                                )
                            }
                            <InlineReactSelect
                              label="TimeZone"
                              placeholder="Select TimeZone"
                              options={timezones}
                              value={addTargetFormik.values.timeZoneId}
                              onChange={(value) => addTargetFormik.setFieldValue('timeZoneId', value)}
                              error={addTargetFormik.errors.timeZoneId}
                              tooltip="The time zone setting for this publishers hours of operation limitations"
                              className="mb-8"
                              mdLabel="4"
                              mdInput="8"
                            />
                          </>
                        )
                        : (
                          <InlineReactSelect
                            label="Select Target"
                            placeholder="Select"
                            options={targetsData && targetsData.targets ? targetsData.targets.map((el) => ({
                              label: el.name,
                              value: el.id
                            })) : []}
                            value={addTargetFormik.values.targetIds}
                            onChange={(value) => addTargetFormik.setFieldValue('targetIds', value)}
                            error={addTargetFormik.errors.targetIds}
                            tooltip="Choose which Target you would like calls routed to."
                            isMulti
                            className="mb-8"
                            mdLabel="4"
                            mdInput="8"
                          />
                        )
                    }
                    <InlineSwitch
                      label="Track Revenue"
                      checked={addTargetFormik.values.trackRevenue}
                      onChange={(checked) => addTargetFormik.setFieldValue('trackRevenue', checked)}
                      tooltip="Specify call conversion revenue to enable real-time revenue reporting."
                      className="mb-8"
                      mdLabel="4"
                      mdInput="8"
                    />
                  </div>
                  <div className="row">
                    <div className="flex justify-between col-md-6 col-md-offset-3">
                      <Button flat className="mr-4" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button
                        loading={isAddTargetSubmitting}
                        onClick={() => addTargetFormik.handleSubmit()}
                      >
                        FORWARD CALLS TO TARGET
                      </Button>
                    </div>
                  </div>
                </>
              ),
            },
            {
              title: 'Set it Live!',
              subTitle:
                'Test your Tracking Number to see Ringba operate in real-time.',
              component: (
                <>
                  <div className="mb-16">
                    <div className="mb-16">
                      <Alert type="info">
                        Congratulations on creating your Campaign!<br />
                        Call the publisher number you created and verify that it is routed to your target correctly.
                      </Alert>
                    </div>
                  </div>
                  <div className="row">
                    <div className="flex justify-between col-md-6 col-md-offset-3">
                      <Button
                        flat
                        className="mr-4 invisible111"
                        onClick={() => setStep(2)}
                      >
                        Back
                      </Button>
                      <Button
                        loading={isSetItLiveSubmitting}
                        onClick={() => handleProductivate()}
                      >
                        SKIP TESTING, STRAIGHT TO PRODUCTION!
                      </Button>
                    </div>
                  </div>
                </>
              )
            },
          ]}
          step={step}
        />
      </Widget>
    </Layout>
  );
}

export default Index;

