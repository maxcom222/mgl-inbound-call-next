import React, {useState, useMemo} from 'react';
import * as yup from 'yup';
import {useFormik} from 'formik';

import Layout from 'layouts';
import Widget from 'components/widget';
import {
  InlineReactSelect,
  InlineSwitch,
  InlineText,
  InlineTextInput,
  InlineNumberInput,
  InlineMYSelect
} from 'components/forms/inline-inputs';
import { Button } from 'components/buttons';
import DataTable from 'components/datatable';
import countriesData from 'json/countries.json';
import Help from 'components/help';

const countries = countriesData.map((el) => ({
    label: el.name,
    value: el.alpha2Code
  }));

const Index: React.FunctionComponent<any> = () => (
  <Layout>
    <Plan />
    <AccountBalance />
    <RechargeSettings />
    <CreditCards />
    <TransactionHistory />
  </Layout>
  )

// widgets

const Plan: React.FunctionComponent<any> = () => {
  const plan = 'STANDARD';
  const [editing, setEditing] = useState(false);

  return (
    <Widget title="MGL Plan">
      {!editing
        ? (
          <PreviewPlan
            onEdit={() => setEditing(true)}
          />
        )
        : (
          <EditPlan
            value={plan}
            onClose={() => setEditing(false)}
          />
        )
      }
    </Widget>
  );
};

const AccountBalance: React.FunctionComponent<any> = () => {
  const [editing, setEditing] = useState(false);

  return (
    <Widget title="Account Balance">
      {!editing
        ? (
          <PreviewAccountBalance
            onEdit={() => setEditing(true)}
          />
        )
        : (
          <EditAccountBalance
            onClose={() => setEditing(false)}
          />
        )
      }
    </Widget>
  );
}

const RechargeSettings: React.FunctionComponent<any> = () => {
  const belows = [
    {
      label: '$5,000',
      value: '5000'
    },
    {
      label: '$2,500',
      value: '2500'
    },
    {
      label: '$1,000',
      value: '1000'
    },
    {
      label: '$500',
      value: '500'
    },
    {
      label: '$250',
      value: '250'
    },
    {
      label: '$100',
      value: '100'
    },
    {
      label: '$50',
      value: '50'
    },
    {
      label: '$25',
      value: '25'
    },
    {
      label: '$10',
      value: '10'
    }
  ];
  const amounts = [
    {
      label: '$10,000',
      value: '10000'
    },
    {
      label: '$5,000',
      value: '5000'
    },
    {
      label: '$2,500',
      value: '2500'
    },
    {
      label: '$1,000',
      value: '1000'
    },
    {
      label: '$500',
      value: '500'
    },
    {
      label: '$250',
      value: '250'
    },
    {
      label: '$100',
      value: '100'
    },
    {
      label: '$50',
      value: '50'
    },
    {
      label: '$25',
      value: '25'
    }
  ];

  const formik = useFormik({
    initialValues: {
      _autoRecharge: '',
      _rechargeBelow: '',
      _rechargeAmount: '',

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
    <Widget title="Recharge Settings">
      <InlineSwitch
        label="Auto Recharge"
        checked={formik.values._autoRecharge}
        onChange={(checked) => formik.setFieldValue('_autoRecharge', checked)}
        error={formik.errors._autoRecharge}
        tooltip="
          When your balance falls below the selected balance,
          we'll automatically refil your account to prevent any service interruption.
        "
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineReactSelect
        label="Recharge Below"
        placeholder="Select amount"
        options={belows}
        value={formik.values._rechargeBelow}
        onChange={(value) => formik.setFieldValue('_rechargeBelow', value)}
        error={formik.errors._rechargeBelow}
        tooltip="Once your balance falls below this amount, we will recharge your account."
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineReactSelect
        label="Recharge Amount"
        placeholder="Select amount"
        options={amounts}
        value={formik.values._rechargeAmount}
        onChange={(value) => formik.setFieldValue('_rechargeAmount', value)}
        error={formik.errors._rechargeAmount}
        tooltip="
          The amount you would like us to automatically recharge your account with when it falls below the limit.
        "
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <div className="row mt-12">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button
            className="w-32"
            loading={formik.values.submitting}
            onClick={() => formik.handleSubmit()}
          >
            UPDATE
          </Button>
        </div>
      </div>
    </Widget>
  );
}

const CreditCards: React.FunctionComponent<any> = () => {
  const columns = useMemo(
    () => [
      {
        Header: 'Default',
        accessor: '_default'
      },
      {
        Header: 'Card Nickname',
        accessor: '_cardNickname'
      },
      {
        Header: 'Type',
        accessor: '_type'
      },
      {
        Header: 'Card Number',
        accessor: '_cardNumber'
      },
      {
        Header: 'Expiration',
        accessor: '_expiration'
      },
      {
        Header: 'Country',
        accessor: '_country'
      },
      {
        Header: 'Status',
        accessor: '_status'
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
            tooltip="Delete URL Param"
            onClick={() => false}
          />
        )
      }
    ],
    []
  );

  const [expandRow, setExpandRow] = useState<any>(false);

  return (
    <Widget title="Credit Cards">
      <DataTable
        columns={columns}
        data={[]}
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
                  <AddCard
                    requestClose={() => {
                      // void refetch();
                      setExpandRow(false);
                    }}
                  />
                )
              });
            }}
          >
            ADD CARD
          </Button>
        }
        expandRow={expandRow}
      />
    </Widget>
  );
}

const TransactionHistory: React.FunctionComponent<any> = () => {
  const columns = useMemo(
    () => [
      {
        Header: 'Date',
        accessor: '_date'
      },
      {
        Header: 'Description',
        accessor: '_description'
      },
      {
        Header: 'Amount',
        accessor: '_amount'
      },
      {
        Header: 'Type',
        accessor: '_type'
      },
      {
        Header: '_cardNumber',
        accessor: 'Card Number'
      }
    ],
    []
  );

  return (
    <Widget title="Transaction History">
      <DataTable
        columns={columns}
        data={[]}
      />
    </Widget>
  );
}

// widget contents

const PreviewPlan: React.FunctionComponent<any> = (props) => (
    <>
      <InlineText
        label="Current Plan"
        value={'Basic'}
        tooltip="Your MGL billing plan"
        className="mb-4"
        mdLabel="3"
        mdInput="9"
      />
      <InlineText
        label="Platform Fee"
        value={'$0 / Monthly'}
        tooltip="The fee charged for access to MGL"
        className="mb-4"
        mdLabel="3"
        mdInput="9"
      />
      <InlineText
        label="Local Minutes"
        value={'$0.065 / Minute'}
        tooltip="The rate billed for calls to local numbers. Please note calls to exotic locations incur surcharges."
        className="mb-4"
        mdLabel="3"
        mdInput="9"
      />
      <InlineText
        label="Toll Free Minutes"
        value={'$0.075 / Minute'}
        tooltip="
          The rate billed for calls to toll free numbers. Please note calls to exotic locations incur surcharges.
        "
        className="mb-4"
        mdLabel="3"
        mdInput="9"
      />
      <InlineText
        label="Local Numbers"
        value={'$3 / Month'}
        tooltip="The monthly rate for each toll free number in your account"
        className="mb-4"
        mdLabel="3"
        mdInput="9"
      />
      <InlineText
        label="Toll Free Numbers"
        value={'$4 / Month'}
        tooltip="The rate per minute for recording your calls"
        className="mb-4"
        mdLabel="3"
        mdInput="9"
      />
      <InlineText
        label="Recordings"
        value={'$0.01 / Minute'}
        tooltip="Your"
        className="mb-4"
        mdLabel="3"
        mdInput="9"
      />
      <div className="row mt-12">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button
            className="w-32"
            onClick={() => props.onEdit()}
          >
            CHANGE PLAN
          </Button>
        </div>
      </div>
    </>
  )

const EditPlan: React.FunctionComponent<any> = (props) => {
  const [value, setValue] = useState(props.value);
  const [submitting, setSubmitting] = useState(false);

  return (
    <>
      <div className="row">
        <div className="col-md-3">
          <div className="p-8 mb-6">&nbsp;</div>
          <label className="flex md:justify-end items-center pb-2 md:pb-0 mb-6">
            <span className="text-sm text-default whitespace-no-wrap mr-1">Platform Fee</span>
            <Help>The fee charged for access to Ringba.</Help>
          </label>
          <label className="flex md:justify-end items-center pb-2 md:pb-0 mb-6">
            <span className="text-sm text-default whitespace-no-wrap mr-1">Local Minutes</span>
            <Help>
              The rate billed for calls to local numbers. Please note calls to exotic locations incur surcharges.
            </Help>
          </label>
          <label className="flex md:justify-end items-center pb-2 md:pb-0 mb-6">
            <span className="text-sm text-default whitespace-no-wrap mr-1">Toll Free Minutes</span>
            <Help>
              The rate billed for calls to toll free numbers. Please note calls to exotic locations incur surcharges.
            </Help>
          </label>
          <label className="flex md:justify-end items-center pb-2 md:pb-0 mb-6">
            <span className="text-sm text-default whitespace-no-wrap mr-1">Local Numbers</span>
            <Help>The monthly rate for each local number in your account.</Help>
          </label>
          <label className="flex md:justify-end items-center pb-2 md:pb-0 mb-6">
            <span className="text-sm text-default whitespace-no-wrap mr-1">Toll Free Numbers</span>
            <Help>The monthly rate for each toll free number in your account.</Help>
          </label>
          <label className="flex md:justify-end items-center pb-2 md:pb-0 mb-6">
            <span className="text-sm text-default whitespace-no-wrap mr-1">Recordings</span>
            <Help>The rate per minute for recording your calls.</Help>
          </label>
        </div>
        <div className="col-md-9">
          <div className="flex">
            <div className={`w-48 mr-2 ${value === 'STANDARD' ? 'bg-gray-200' : ''}`}>
              <Button
                flat
                className={`w-full mb-6 ${value === 'STANDARD' ? 'clicked' : ''}`}
                disabled={submitting}
                onClick={() => setValue('STANDARD')}
              >
                <span className="p-6 text-sm">
                  Standard
                </span>
              </Button>
              <p className="text-sm mb-6 text-center">$999 / Year</p>
              <p className="text-sm mb-6 text-center">$0.045 / Min</p>
              <p className="text-sm mb-6 text-center">$0.055 / Min</p>
              <p className="text-sm mb-6 text-center">$1 / Month</p>
              <p className="text-sm mb-6 text-center">$2 / Month</p>
              <p className="text-sm mb-6 text-center">$0.0025 / Min</p>
            </div>
            <div className={`w-48 mr-2 ${value === 'PREMIUM' ? 'bg-gray-200' : ''}`}>
              <Button
                flat
                className={`w-full mb-6 ${value === 'PREMIUM' ? 'clicked' : ''}`}
                disabled={submitting}
                onClick={() => setValue('PREMIUM')}
              >
                <span className="p-6 text-sm">
                  Premium
                </span>
              </Button>
              <p className="text-sm mb-6 text-center">$99 / Year</p>
              <p className="text-sm mb-6 text-center">$0.045 / Min</p>
              <p className="text-sm mb-6 text-center">$0.055 / Min</p>
              <p className="text-sm mb-6 text-center">$2 / Month</p>
              <p className="text-sm mb-6 text-center">$3 / Month</p>
              <p className="text-sm mb-6 text-center">$0.005 / Min</p>
            </div>
            <div className={`w-48 mr-2 ${value === 'BASIC' ? 'bg-gray-200' : ''}`}>
              <Button
                flat
                className={`w-full mb-6 ${value === 'BASIC' ? 'clicked' : ''}`}
                disabled={submitting}
                onClick={() => setValue('BASIC')}
              >
                <span className="p-6 text-sm">
                  Basic
                </span>
              </Button>
              <p className="text-sm mb-6 text-center">$0 / Year</p>
              <p className="text-sm mb-6 text-center">$0.065 / Min</p>
              <p className="text-sm mb-6 text-center">$0.075 / Min</p>
              <p className="text-sm mb-6 text-center">$3 / Month</p>
              <p className="text-sm mb-6 text-center">$4 / Month</p>
              <p className="text-sm mb-6 text-center">$0.01 / Min</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-12">
        <div className="col-md-9 col-md-offset-3">
          <Button
            className="w-32"
            loading={submitting}
            onClick={() => setSubmitting(true)}
          >
            UPDATE PLAN
          </Button>
        </div>
      </div>
    </>
  );
}

const PreviewAccountBalance: React.FunctionComponent<any> = (props) => (
    <>
      <InlineText
        label="Balance"
        value={'$13.455'}
        tooltip="The current amount of credit in your MGL account"
        className="mb-4"
        mdLabel="3"
        mdInput="9"
      />
      <div className="row mt-12">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button
            className="w-32"
            onClick={() => props.onEdit()}
          >
            ADD FUNDS
          </Button>
        </div>
      </div>
    </>
  )

const EditAccountBalance: React.FunctionComponent<any> = () => {
  const formik = useFormik({
    initialValues: {
      _balance: 13.455,
      _amount: '',
      _cardToBill: '',

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
    <>
      <InlineText
        label="Current Balance"
        value={`$${formik.values._balance}`}
        tooltip="The current account balance"
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineNumberInput
        label="Amount"
        value={formik.values._amount}
        onChange={(value) => formik.setFieldValue('_amount', value)}
        error={formik.errors._amount}
        tooltip="The amount of funds you'd like to add to your account"
        width="sm"
        min={0}
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineReactSelect
        label="Card to Bill"
        placeholder="Select Card"
        value={formik.values._cardToBill}
        onChange={(value) => formik.setFieldValue('_cardToBill', value)}
        options={[]}
        error={formik.errors._cardToBill}
        tooltip="Select which of your credit cards you would like to bill."
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <div className="row mt-12">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button
            className="w-32"
            loading={formik.values.submitting}
            onClick={() => formik.handleSubmit()}
          >
            ADD
          </Button>
        </div>
      </div>
    </>
  );
}

// table expand rows

const AddCard: React.FunctionComponent<any> = (props) => {
  const formik = useFormik<any>({
    initialValues: {
      _accountAddress: '',
      _newBillingAddress: false,
        _country: '',
        _billingAddress1: '',
        _billingAddress2: '',
        _city: '',
        _state: '',
        _zipcode: '',

      _cardNickname: '',
      _nameOnCard: '',
      _cardNumber: '',
      _expiration: {
        month: null,
        year: null
      },
      _cvv: '',

      submitting: false
    },
    validationSchema: yup.object().shape({
      _country: yup.string().when('_newBillingAddress', {
        is: true,
        then: yup.string().required()
      }),
      _bilingAddress1: yup.string().when('_newBillingAddress', {
        is: true,
        then: yup.string().required()
      }),
      _city: yup.string().when('_newBillingAddress', {
        is: true,
        then: yup.string().required()
      }),
      _state: yup.string().when('_newBillingAddress', {
        is: true,
        then: yup.string().required()
      }),
      _zipcode: yup.string().when('_newBillingAddress', {
        is: true,
        then: yup.string().required()
      }),
      _cardNickname: yup.string().required(),
      _nameOnCard: yup.string().required(),
      _cardNumber: yup.string().required(),
      _expiration: yup.object().test('required', '_expiration is a required field', function(value:any) {
        if(value.month !== null && value.year !== null) return true;

        return false;
      }),
      _cvv: yup.string().required()
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
      <InlineText
        label="Account Address"
        value={formik.values._accountAddress}
        error={formik.errors._accountAddress}
        tooltip="
          The current address on your account.
          If this is not your billing address, please update your billing address below."
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineSwitch
        label="New Billing Address"
        checked={formik.values._newBillingAddress}
        onChange={(checked) => formik.setFieldValue('_newBillingAddress', checked)}
        error={formik.errors._newBillingAddress}
        tooltip="Enter a new billing address for this card."
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      {formik.values._newBillingAddress &&
        <>
          <InlineReactSelect
            label="Country"
            value={formik.values._country}
            onChange={(value) => formik.setFieldValue('_country', value)}
            options={countries}
            error={formik.errors._country}
            tooltip="Select the country that your credit card was issued in."
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          <InlineTextInput
            label="Billing Address"
            value={formik.values._billingAddress1}
            onChange={(value) => formik.setFieldValue('_billingAddress1', value)}
            error={formik.errors._billingAddress1}
            tooltip="Enter a new billing address for this card."
            borderUnderline
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          <InlineTextInput
            value={formik.values._billingAddress2}
            onChange={(value) => formik.setFieldValue('_billingAddress2', value)}
            error={formik.errors._billingAddress2}
            borderUnderline
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          <InlineTextInput
            label="City"
            value={formik.values._city}
            onChange={(value) => formik.setFieldValue('_city', value)}
            error={formik.errors._city}
            tooltip="The city associated with your credit card billing address"
            borderUnderline
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          <InlineTextInput
            label="State/Region"
            value={formik.values._state}
            onChange={(value) => formik.setFieldValue('_state', value)}
            error={formik.errors._state}
            tooltip="The region associated with your credit card billing address"
            borderUnderline
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
          <InlineTextInput
            label="Zip/Postal Code"
            value={formik.values._zipcode}
            onChange={(value) => formik.setFieldValue('_zipcode', value)}
            error={formik.errors._zipcode}
            tooltip="The postal code associated with your credit card billing address"
            borderUnderline
            width="sm"
            className="mb-8"
            mdLabel="3"
            mdInput="9"
          />
        </>
      }
      <InlineTextInput
        label="Card Nickname"
        value={formik.values._cardNickname}
        onChange={(value) => formik.setFieldValue('_cardNickname', value)}
        error={formik.errors._cardNickname}
        tooltip="Enter a name as an identifier of this card."
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="Name on Card"
        value={formik.values._nameOnCard}
        onChange={(value) => formik.setFieldValue('_nameOnCard', value)}
        error={formik.errors._nameOnCard}
        tooltip="Enter customer name exactly as written on the card."
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineNumberInput
        label="Card Number"
        value={formik.values._cardNumber}
        onChange={(value) => formik.setFieldValue('_cardNumber', value)}
        error={formik.errors._cardNumber}
        tooltip="The full 16 digit number on the front of your credit card."
        borderUnderline
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineMYSelect
        label="Expiration"
        value={formik.values._expiration}
        onChange={(value) => formik.setFieldValue('_expiration', value)}
        error={formik.errors._expiration}
        tooltip="The expiration month and year of your credit card"
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineNumberInput
        label="CVV"
        value={formik.values._cvv}
        onChange={(value) => formik.setFieldValue('_cvv', value)}
        error={formik.errors._cvv}
        tooltip="The 3 digit code on the back of card signature line or for Amex the 4 digit code on the front."
        borderUnderline
        width="sm"
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <div className="row mt-12">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button
            className="w-32 mr-2"
            onClick={() => formik.handleSubmit()}
            loading={formik.values.submitting}
          >
            ADD CARD
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
