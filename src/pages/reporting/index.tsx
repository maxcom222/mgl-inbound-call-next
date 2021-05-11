import React, { useMemo, useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import moment from 'moment';
import * as yup from 'yup';
import { useFormik } from 'formik';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea
} from 'recharts';
import groupBy from 'json-groupby';

import Datatable from 'components/datatable';
import { BoxTabs } from 'components/tabs';
import { Select, CheckSelect, BoxSelect, ReactSelect } from 'components/forms/selects';
import {InlineTextInput, InlineNumberInput} from 'components/forms/inline-inputs';
import Layout from 'layouts';
import Widget from 'components/widget';
import { VIEW_AFFILIATES } from 'shared/queries/publishers';
import { VIEW_CALL_LOGS } from 'shared/queries/call_logs';
import timezoneOptions from 'json/timezones.json';
import DateRangePicker from 'components/forms/date-range-picker';
import { Button } from 'components/buttons';

const timezones = timezoneOptions.map((el) => ({
  label: el.text,
  value: el.value
}));

const Index: React.FunctionComponent<any> = () => {
  const {loading: loadingPublishers, data: publishersData} = useQuery(VIEW_AFFILIATES);
  const {loading: loadingCallLogs, data: callLogsData} = useSubscription(VIEW_CALL_LOGS);

  if(loadingPublishers || loadingCallLogs) return <></>;

  console.log(publishersData);

  return (
    <Layout>
      <Header publishers={publishersData.affiliates} />
      <DynamicChartGeneration />
      <ViewCalls callLogs={callLogsData.call_logs} />
      <ViewCallDetails callLogs={callLogsData.call_logs} />
    </Layout>
  );
}

const getRndInteger = (min:number, max:number):number => Math.floor(Math.random() * (max - min + 1)) + min;

const dumyData = [ ...Array(30) ].map((_, key) => {
  const randomCallsData = getRndInteger(1, 30);

  return {
    name: key + 1,
    label: `Sep ${key + 1}`,
    Calls: randomCallsData,
    Connected: getRndInteger(1, randomCallsData),
    Converted: getRndInteger(1, randomCallsData),
    Qualified: getRndInteger(1, randomCallsData),
    Completed: getRndInteger(1, randomCallsData),
    "No Answer": getRndInteger(1, randomCallsData),
    Blocked: getRndInteger(1, randomCallsData),
    "No Connect": getRndInteger(1, randomCallsData),
    Error: getRndInteger(1, randomCallsData)
  };
});

// widgets

const Header: React.FunctionComponent<any> = (props) => {
  const publishers = props.publishers.map((el) => ({
    label: el.name,
    value: el.id
  }));

  return (
    <Widget
      title="Today"
      headerRight={
        <div className="flex">
          <Select
            options={publishers}
            value=""
            placeholder="View Report As"
            onChange={(value) => console.log(value)}
            className="ml-2"
            size="sm"
          />
          <ReactSelect
            options={timezones}
            value=""
            placeholder="Search Timezone"
            className="w-84 ml-2"
            size="sm"
          />
          <DateRangePicker
            value="today"
            className="ml-2"
            size="sm"
          />
        </div>
      }
    >
    </Widget>
  );
}

const DynamicChartGeneration: React.FunctionComponent<any> = () => {
  const [ chartBy, setChartBy ] = useState('By Day');
  const [ chartEvents, setChartEvents ] = useState([
    'converted',
    'qualified',
    'no answer',
    'no connect',
    'error'
  ]);
  const initialState = {
    isZoom: false,
    tickCount: 20,
    data: dumyData,
    left: 'dataMin',
    right: 'dataMax',
    refAreaLeft: '',
    refAreaRight: '',
    top: 'dataMax+1',
    bottom: 'dataMin-1',
    animation: true,
  };

  const [ state, setState ] = useState(initialState);

  const getAxisYDomainTickCount = (from:number, to:number, offset:number):any => {
    const refData = dumyData.slice(from - 1, to);
    let topValue = 0;
    const bottomValue = 0;
    let tickCount = 0;
    const refLength = refData.length;
    if(refLength <= 20){
      tickCount = refLength;
    }else{
      tickCount = refLength - 1;
    }
    refData.forEach((d) => {
      const max = Math.max(
        d.Calls,
        d.Blocked,
        d.Completed,
        d.Connected,
        d.Converted,
        d.Error,
        d['No Answer'],
        d['No Connect'],
        d.Qualified
      );
      topValue = Math.max(topValue, max);
    });

    return [bottomValue, topValue + offset, tickCount];
  };

  const zoom = ():void => {
    const _data = state.data;
    let _refAreaLeft = state.refAreaLeft;
    let _refAreaRight = state.refAreaRight;

    if (_refAreaLeft === _refAreaRight || _refAreaRight === '') {
      setState({
        ...state,
        isZoom: true,
        refAreaLeft: '',
        refAreaRight: '',
      });

      return;
    }

    if (_refAreaLeft > _refAreaRight)
      [_refAreaLeft, _refAreaRight] = [_refAreaRight, _refAreaLeft];

    const [_bottom, _top, _tickCount] = getAxisYDomainTickCount(Number(_refAreaLeft), Number(_refAreaRight), 1);

    setState({
      ...state,
      isZoom: true,
      tickCount: _tickCount,
      refAreaLeft: '',
      refAreaRight: '',
      data: _data.slice(),
      left: refAreaLeft,
      right: refAreaRight,
      bottom: _bottom,
      top: _top,
    });
  }

  const zoomOut = ():void => {
    const { data: _data } = state;
    setState({
      ...state,
      isZoom: false,
      tickCount: initialState.tickCount,
      data: _data.slice(),
      refAreaLeft: '',
      refAreaRight: '',
      left: 'dataMin',
      right: 'dataMax',
      top: 'dataMax+1',
      bottom: 'dataMin',
    });
  }

  const renderDateTick = (tickProps):any => {
    const x:number = tickProps.x;
    const y:number = tickProps.y;
    const payload:any = tickProps.payload;
    const value:number = payload.value;

    if(Number.isInteger(value)){
      return <text x={x} y={y + 10} textAnchor="middle">{data[value - 1].label}</text>;
    }

    return null;
  };

  const {
    data, left, right, refAreaLeft, refAreaRight, top, bottom
  } = state;

  return(
    <Widget
      title="Dynamic Chart Generation"
      headerRight={
        <div className="flex">
          <BoxSelect
            options={[
              {
                label: 'By Hour',
                value: 'By Hour'
              },
              {
                label: 'By Day',
                value: 'By Day'
              },
              {
                label: 'By Month',
                value: 'By Month'
              },
            ]}
            value={chartBy}
            onChange={(value) => setChartBy(value)}
            className="mr-2"
          />
          <CheckSelect
            options={[
              {
                label: 'Connected',
                value: 'connected',
              },
              {
                label: 'Converted',
                value: 'converted'
              },
              {
                label: 'Qualified',
                value: 'qualified'
              },
              {
                label: 'Completed',
                value: 'completed'
              },
              {
                label: 'No Answer',
                value: 'no answer'
              },
              {
                label: 'Blocked',
                value: 'blocked'
              },
              {
                label: 'No Connect',
                value: 'no connect'
              },
              {
                label: 'Error',
                value: 'error'
              }
            ]}
            value={chartEvents}
            onChange={(value) => setChartEvents(value)}
            placeholder="Events"
          />
        </div>
      }
    >
      <div style={{ width: '100%', height: 400, userSelect: 'none' }}>
        <div className="flex justify-end">
          <Button
            flat
            icon
            leftIcon="ZoomOut"
            className={`update w-6 h-6 mr-4 ${state.isZoom ? 'visible' : 'invisible'}`}
            onClick={() => zoomOut()}
          />
        </div>
        <ResponsiveContainer>
          <ComposedChart
            width={500}
            height={400}
            data={data}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
            onMouseDown={(e) => {
              if(e !== null && typeof e !== 'undefined'){
                if(typeof e.activeLabel !== 'undefined'){
                  setState({ ...state, refAreaLeft: e.activeLabel });
                }
              }
            }}
            onMouseMove={(e) => {
              if(e !== null && typeof e !== 'undefined'){
                if(typeof e.activeLabel !== 'undefined'){
                  state.refAreaLeft && setState({ ...state, refAreaRight: e.activeLabel });
                }
              }
            }}
            onMouseUp={() => zoom()}
          >
            <CartesianGrid strokeDasharray="3 0" vertical={false} />
            <XAxis
              allowDataOverflow
              dataKey="name"
              domain={[left, right]}
              type="number"
              tick={renderDateTick}
              tickCount={state.tickCount}
            />
            <YAxis
              axisLine={false}
              label={{
                value: 'Counts',
                angle: -90,
                position: 'insideLeft',
              }}
              allowDataOverflow
              domain={[bottom, top]}
              type="number"
            />
            <Tooltip labelFormatter={(i) => data[i - 1].label} />
            <Legend />

            <Bar
              dataKey="Calls"
              barSize={500}
              fill="#FFC435"
              animationDuration={300}
            />

            { chartEvents.indexOf('connected') !== -1 &&
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="Connected"
                stroke="#3182BD"
                animationDuration={300}
              />
            }

            { chartEvents.indexOf('converted') !== -1 &&
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="Converted"
                stroke="#413ea0"
                animationDuration={300}
              />
            }

            { chartEvents.indexOf('qualified') !== -1 &&
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="Qualified"
                stroke="#48bb78"
                animationDuration={300}
              />
            }

            { chartEvents.indexOf('completed') !== -1 &&
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="Completed"
                stroke="#55C03B"
                animationDuration={300}
              />
            }

            { chartEvents.indexOf('no answer') !== -1 &&
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="No Answer"
                stroke="#7798BF"
                animationDuration={300}
              />
            }

            { chartEvents.indexOf('blocked') !== -1 &&
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="Blocked"
                stroke="#DF5353"
                animationDuration={300}
              />
            }

            { chartEvents.indexOf('no connect') !== -1 &&
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="No Connect"
                stroke="#E0005A"
                animationDuration={300}
              />
            }

            { chartEvents.indexOf('error') !== -1 &&
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="Error"
                stroke="#EEAAEE"
                animationDuration={300}
              />
            }

            {
              (refAreaLeft && refAreaRight) ? (
                <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />) : null
            }

          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Widget>
  );
}

const ViewCalls: React.FunctionComponent<any> = (props) => {
  const callLogs = props.callLogs.map((el) => ({
    ...el,
    campaignName: el.campaignName !== null ? el.campaignName : '-',
    affiliateName: el.affiliateName !== null ? el.affiliateName : '-',
    numberPoolName: el.numberPoolName !== null ? el.numberPoolName : '-',
    number: el.number !== null ? el.number : '-',
    targetName: el.targetName !== null ? el.targetName : '-',
    duplicate: '-',
    date: moment(el.created_at).format('MMM DD')
  }));

  const firstColumns = [
    {
      Header: 'Campaign',
      accessor: 'campaignName'
    },
    {
      Header: 'Publisher',
      accessor: 'affiliateName'
    },
    {
      Header: 'Pool',
      accessor: 'numberPoolName'
    },
    {
      Header: 'Dialed',
      accessor: 'number'
    },
    {
      Header: 'Duplicate',
      accessor: 'duplicate'
    },
    {
      Header: 'Target',
      accessor: 'targetName'
    },
    {
      Header: 'Date',
      accessor: 'date',
    },
  ];
  const columnsArray = firstColumns.map((firstColumn) => ([
    firstColumn,
    {
      Header: 'Incoming',
      accessor: 'incoming'
    },
    {
      Header: 'Connected',
      accessor: 'connected'
    },
    {
      Header: 'Qualified',
      accessor: 'qualified'
    },
    {
      Header: 'Converted',
      accessor: 'converted'
    },
    {
      Header: 'Completed',
      accessor: 'completed'
    },
    {
      Header: 'No Target',
      accessor: 'noTarget'
    },
    {
      Header: 'Error',
      accessor: 'error'
    },
    {
      Header: 'No Answer',
      accessor: 'noAnswer'
    },
    {
      Header: 'No Connect',
      accessor: 'noConnect'
    },
    {
      Header: 'Blocked',
      accessor: 'blocked'
    },
    {
      Header: 'Payout',
      accessor: 'payout'
    },
    {
      Header: 'Revenue',
      accessor: 'revenue'
    },
    {
      Header: 'Profit',
      accessor: 'profit'
    },
    {
      Header: 'CR%',
      accessor: 'cr'
    },
    {
      Header: 'RPC',
      accessor: 'rpc'
    },
    {
      Header: 'ACL',
      accessor: 'acl'
    },
    {
      Header: 'TCL',
      accessor: 'tcl'
    },
    {
      Header: 'Cost',
      accessor: 'cost'
    },
  ]));

  const adaptCallLogs = (index):any => {
    const groupName = firstColumns[index].accessor;
    const dataGrouped = groupBy(callLogs, [groupName]);
    const dataAdapted = Object.keys(dataGrouped).map((key) => ({
      [groupName]: key,
      incoming: 0,
      connected: 0,
      qualified: 0,
      converted: 0,
      completed: 0,
      noTarget: 0,
      error: 0,
      noAnswer: 0,
      noConnect: 0,
      blocked: 0,
      payout: 0,
      revenue: 0,
      profit: 0,
      cr: 0,
      rpc: 0,
      acl: 0,
      tcl: 0,
      cost: 0,
    }));

    return dataAdapted;
  }

  const [callLogsGrouped, setCallLogsGrouped] = useState(adaptCallLogs(0));

  return(
    <Widget title="Calls">
      <div className="flex flex-wrap">
        <div className="w-full">
          <BoxTabs
            tabs={
              [
                {
                  index: 0,
                  title: 'Campaign',
                  active: true,
                  content: <AllTabsCalls columns={columnsArray[0]} callLogs={callLogsGrouped} />
                },
                {
                  index: 1,
                  title: 'Publisher',
                  active: false,
                  content: <AllTabsCalls columns={columnsArray[1]} callLogs={callLogsGrouped} />
                },
                {
                  index: 2,
                  title: 'Pool',
                  active: false,
                  content: <AllTabsCalls columns={columnsArray[2]} callLogs={callLogsGrouped} />
                },
                {
                  index: 3,
                  title: 'Dialed#',
                  active: false,
                  content: <AllTabsCalls columns={columnsArray[3]} callLogs={callLogsGrouped} />
                },
                {
                  index: 4,
                  title: 'Duplicate',
                  active: false,
                  content: <AllTabsCalls columns={columnsArray[4]} callLogs={callLogsGrouped} />
                },
                {
                  index: 5,
                  title: 'Target',
                  active: false,
                  content: <AllTabsCalls columns={columnsArray[5]} callLogs={callLogsGrouped} />
                },
                {
                  index: 6,
                  title: 'Date',
                  active: false,
                  content: <AllTabsCalls columns={columnsArray[6]} callLogs={callLogsGrouped} />
                },
              ]
            }
            noContentPadding
            fixTabWidth
            onChange={(index) => setCallLogsGrouped(adaptCallLogs(index))}
          />
        </div>
      </div>
    </Widget>
  );
}

const ViewCallDetails: React.FunctionComponent<any> = (props) => {
  const columns = useMemo(() => ([
    {
      Header: 'Call Date',
      accessor: 'created_at',
      Cell: (cell: any) => moment(cell.value).format('MMM DD hh:mm:ss A'),
    },
    {
      Header: 'Campaign',
      accessor: 'campaignName',
    },
    {
      Header: 'Publisher',
      accessor: 'affiliateName',
    },
    {
      Header: 'Pool',
      accessor: 'numberPoolName',
    },
    {
      Header: 'Caller ID',
      accessor: 'caller',
    },
    {
      Header: 'Dialed#',
      accessor: 'number',
    },
    {
      Header: 'TT Call',
      accessor: 'ttCall',
    },
    {
      Header: 'Dupe',
      accessor: 'dupe',
    },
    {
      Header: 'Conn. Duration',
      accessor: 'dialCallDuration',
    },
    {
      Header: 'Hangup',
      accessor: 'hangup',
    },
    {
      Header: 'TT Connection',
      accessor: 'ttConnection',
    },
    {
      Header: 'Target',
      accessor: 'target',
    },
    {
      Header: 'Revenue',
      accessor: 'profit',
    },
    {
      Header: 'Payout',
      accessor: 'payoutAmount',
    },
    {
      Header: 'Duration',
      accessor: 'duration',
    },
    {
      Header: 'Rec.',
      accessor: 'rec',
    },
    {
      Header: 'Actions',
      accessor: () => ({

      }),
      Cell: (cell) => (
        <div className="flex">
          <Button
            flat
            icon
            leftIcon="Slash"
            tooltip="Block Number"
            className="mx-1"
            disabled
          />
          <Button
            flat
            icon
            leftIcon="Edit2"
            tooltip="Add Tag Annotation"
            className="mx-1"
            onClick={() => {
              setExpandRow({
                index: cell.row.index % cell.state.pageSize,
                content: (
                  <AddTagAnnotation
                    id={null}
                    requestClose={() => {
                      // void refetch();
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
            leftIcon="DollarSign"
            tooltip="Adjust Call Payments"
            className="mx-1"
            onClick={() => {
              setExpandRow({
                index: cell.row.index % cell.state.pageSize,
                content: (
                  <AdjustCallPayments
                    id={null}
                    requestClose={() => {
                      // void refetch();
                      setExpandRow(false);
                    }}
                  />
                )
              });
            }}
          />
        </div>
      )
    },
  ]), []);
  const callLogs = props.callLogs;

  const [expandRow, setExpandRow] = useState<any>(false);

  console.log('-----', callLogs);

  return(
    <Widget title="Call Details">
      <Datatable
        columns={columns}
        data={callLogs}
        expandRow={expandRow}
      />
    </Widget>
  );
}

// tables

const AllTabsCalls: React.FunctionComponent<any> = (props) => {
  const callLogs = props.callLogs;

  return (
    <Datatable
      columns={props.columns}
      data={callLogs}
    />
  );
}

// table contents

const AddTagAnnotation: React.FunctionComponent<any> = (props) => {
  const formik = useFormik<any>({
    initialValues: {
      name: '',
      value: '',
      submitting: false
    },
    validationSchema: yup.object().shape({
      name: yup.string().required(),
      value: yup.string().required()
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      formik.setFieldValue('submitting', true);
    },
  });

  return (
    <div className="py-8">
      <InlineTextInput
        label="Name"
        placeholder="Enter Tag name"
        value={formik.values.name}
        onChange={(value) => formik.setFieldValue('name', value)}
        error={formik.errors.name}
        tooltip="The name of the tag"
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineTextInput
        label="Value"
        placeholder="Enter Value"
        value={formik.values.value}
        onChange={(value) => formik.setFieldValue('value', value)}
        error={formik.errors.value}
        tooltip="The value of the tag"
        className="mb-12"
        mdLabel="3"
        mdInput="9"
      />
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button className="w-32 mr-4" loading={formik.values.submitting} onClick={() => formik.handleSubmit()}>
            ANNOTATE
          </Button>
          <Button outlined onClick={() => props.requestClose()}>CANCEL</Button>
        </div>
      </div>
    </div>
  );
}

const AdjustCallPayments: React.FunctionComponent<any> = (props) => {
  const formik = useFormik<any>({
    initialValues: {
      revenue: 0,
      payout: 0,
      submitting: false
    },
    validationSchema: yup.object().shape({
      revenue: yup.number().min(0).required(),
      payout: yup.number().min(0).required()
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      formik.setFieldValue('submitting', true);
    },
  });

  return (
    <div className="py-8">
      <InlineNumberInput
        label="Revenue Adjustment ($)"
        value={formik.values.revenue}
        onChange={(value) => formik.setFieldValue('revenue', value)}
        error={formik.errors.revenue}
        tooltip="Provide the amount to adjust the revenue amount."
        min={0}
        className="mb-8"
        mdLabel="3"
        mdInput="9"
      />
      <InlineNumberInput
        label="Payout Adjustment ($)"
        value={formik.values.payout}
        onChange={(value) => formik.setFieldValue('payout', value)}
        error={formik.errors.payout}
        tooltip="Provide an optional amount to adjust the payout of this call."
        min={0}
        className="mb-12"
        mdLabel="3"
        mdInput="9"
      />
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Button className="mr-4" loading={formik.values.submitting} onClick={() => formik.handleSubmit()}>
            ADJUST PAYOUT/REVENUE
          </Button>
          <Button outlined onClick={() => props.requestClose()}>CANCEL</Button>
        </div>
      </div>
    </div>
  );
}

export default Index;