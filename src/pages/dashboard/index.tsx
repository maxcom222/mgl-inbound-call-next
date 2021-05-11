import React, { useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
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
} from 'recharts';

import Datatable from 'components/datatable';
import { BoxTabs } from 'components/tabs';
import Layout from 'layouts';
import Widget from 'components/widget';
import { Button } from 'components/buttons';

const Index: React.FunctionComponent<any> = () => {
  const { loading, error, data } = useQuery(gql`
    query AffiliateTargetCampaign {
      contactcenter_affiliates(limit: 3) {
        id
        name
        subId
        accessToRecordings
        blockCallsIfCapped
        createNumbers
        enabled
        isSelf
        userIds
        accountId
      }
      contactcenter_targets(limit: 3, order_by: {}) {
        callInstructionsId
        conversionTimerOffset
        criteria {
          id
          tagRoutableRule {
            id
            tagCriteria {
              comparisonType
              id
              isNegativeMatch
              isNumber
              tagId
              tagIds
              value
              tagRoutableRuleId
            }
          }
          targetId
        }
        enabled
        id
        instructions {
          callType
          connectionTimeOut
          id
          number
          sendDigits
        }
        isHighRateTarget
        name
        ownerId
        schedule {
          allTimeCap
          allTimeSumCap
          concurrencyCap
          dailyCap
          dailySumCap
          hourlyCap
          hourlySumCap
          hoursOfOperation {
            breaks {
              id
              lengthInMin
              openSettingsId
              startTimeId
            }
            closeTime {
              hour
              minute
            }
            closeTimeId
            id
            inverted
            isClosed
            isoWeekday
            openTime {
              hour
              minute
            }
            openTimeId
            scheduleId
          }
          id
          monthlyCap
          monthlySumCap
          timeZoneId
        }
        scheduleId
        subId
        targetCallIncrement
        targetGroupId
      }
      campaigns: contactcenter_campaigns(limit: 3) {
        completed
        countryCode
        deDupeSettingsId
        defaultNumberId
        defaultTargetId
        dialSettingsId
        distributionSetting
        duplicateSettingsId
        enabled
        evalAnonymDuplication
        filterCallsThroughTCPAShield
        id
        name
        numberDisplayFormat
        offerDraftId
        offerId
        payoutDupesGlobal
        poolId
        # queueSid
        recordSettingId
        spamDetectionSettingsId
        userCampaignId
        workflowSid
      }
    }
  `);

  if(loading) return <></>;
  if(error) return <></>;

  return (
    <Layout>
      <div className="row">
        <div className="col-md-8 col-xs-12">
          <Widget title="Performance Summary">
            <PerformanceSummary />
          </Widget>
          <Widget title="Top Performancers">
            <TopPerformancers
              publishers={data.contactcenter_affiliates}
              targets={data.contactcenter_targets}
              campaigns={data.campaigns}
            />
          </Widget>
        </div>
        <div className="col-md-4 col-xs-12">
          <Widget title="Messages">
            <Messages messages={[]} />
          </Widget>
        </div>
      </div>
    </Layout>
  );
};

const PerformanceSummary: React.FunctionComponent<any> = () => {
  const chartData = [
    {
      name: '14. Sep',
    },
    {
      name: '3:00 am',
    },
    {
      name: '4:00 am',
    },
    {
      name: '5:00 am',
    },
    {
      name: '6:00 am',
    },
    {
      name: '7:00 am',
      Incoming: 380,
      Connected: 360,
      Revenue: 1400,
      Payout: 590,
    },
    {
      name: '8:00 am',
      Incoming: 590,
      Connected: 470,
      Revenue: 1506,
      Payout: 868,
    },
    {
      name: '9:00 am',
      Incoming: 350,
      Connected: 320,
      Revenue: 989,
      Payout: 1397,
    },
    {
      name: '10:00 am',
      Incoming: 480,
      Connected: 390,
      Revenue: 1228,
      Payout: 1480,
    },
    {
      name: '11:00 am',
      Incoming: 460,
      Connected: 430,
      Revenue: 1100,
      Payout: 1520,
    },
    {
      name: '12:00 am',
      Incoming: 380,
      Connected: 410,
      Revenue: 1700,
      Payout: 1400,
    },
    {
      name: '1:00 pm',
    },
    {
      name: '2:00 pm',
    },
    {
      name: '3:00 pm',
    },
    {
      name: '4:00 pm',
    },
    {
      name: '5:00 pm',
    },
    {
      name: '6:00 pm',
    },
  ];

  return(
    <>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <ComposedChart
            width={500}
            height={400}
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 0" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis
              yAxisId="left"
              axisLine={false}
              label={{
                value: 'Call Counts',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <YAxis
              yAxisId="right"
              unit="$"
              axisLine={false}
              orientation={'right'}
              label={{
                value: 'Amount',
                angle: 90,
                position: 'insideRight',
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              strokeWidth={2}
              dataKey="Incoming"
              stroke="#ff7300"
            />
            <Line
              yAxisId="left"
              type="monotone"
              strokeWidth={2}
              dataKey="Connected"
              stroke="#48bb78"
            />
            <Bar
              yAxisId="right"
              dataKey="Revenue"
              barSize={10}
              fill="#48bb78"
            />
            <Bar
              yAxisId="right"
              dataKey="Payout"
              barSize={10}
              fill="#413ea0"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>
              <div>9/18</div>
              <div>Friday</div>
            </th>
            <th>
              <div>9/17</div>
              <div>Thursday</div>
            </th>
            <th>
              <div>9/16</div>
              <div>Wednesday</div>
            </th>
            <th>
              <div>9/15</div>
              <div>Tuesday</div>
            </th>
            <th>
              <div>9/14</div>
              <div>Monday</div>
            </th>
            <th>
              <div>9/13</div>
              <div>Sunday</div>
            </th>
            <th>
              <div>9/12</div>
              <div>Saturday</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Impressions</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Imcoming</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Connected</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Completed</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Converted</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Avg Call Length</td>
            <td>00:00:00</td>
            <td>00:00:00</td>
            <td>00:00:00</td>
            <td>00:00:00</td>
            <td>00:00:00</td>
            <td>00:00:00</td>
            <td>00:00:00</td>
          </tr>
          <tr>
            <td>Revenue</td>
            <td>$0</td>
            <td>$0</td>
            <td>$0</td>
            <td>$0</td>
            <td>$0</td>
            <td>$0</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>Payout</td>
            <td>$0</td>
            <td>$0</td>
            <td>$0</td>
            <td>$0</td>
            <td>$0</td>
            <td>$0</td>
            <td>$0</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

const TopPerformancers: React.FunctionComponent<any> = (props) => {
  const publishers = props.publishers;
  const targets = props.targets;
  const campaignes = props.campaigns;
  const publishersColumns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Live',
        accessor: 'live',
        Cell: 0,
      },
      {
        Header: 'Hour',
        accessor: 'hour',
        Cell: 0,
      },
      {
        Header: 'Impressions',
        accessor: 'impressions',
        Cell: 0,
      },
      {
        Header: 'Calls',
        accessor: 'calls',
        Cell: 0,
      },
      {
        Header: 'Conv.',
        accessor: 'conv',
        Cell: 0,
      },
      {
        Header: 'Revenue',
        accessor: 'revenue',
        Cell: '$0'
      },
      {
        Header: 'Payout',
        accessor: 'payout',
        Cell: '$0'
      },
      {
        Header: 'Profit',
        accessor: 'profit',
        Cell: '$0'
      },
      {
        Header: 'Actions',
        accessor: (d: any) => ({
          id: d.id,
        }),
        Cell: () => (
          <div className="flex">
            <Button flat icon leftIcon="Edit" tooltip="Edit Publisher" className="mx-1" />
            <Button flat icon leftIcon="PieChart" tooltip="View Report" className="mx-1" />
          </div>
        ),
      },
    ],
    []
  );
  const targetsColumns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Live',
        accessor: 'live',
        Cell: 0
      },
      {
        Header: 'Hour',
        accessor: 'hour',
        Cell: 0,
      },
      {
        Header: 'Calls',
        accessor: 'calls',
        Cell: 0,
      },
      {
        Header: 'Conv.',
        accessor: 'conv',
        Cell: '$0'
      },
      {
        Header: 'Revenue',
        accessor: 'revenue',
        Cell: '$0'
      },
      {
        Header: 'Actions',
        accessor: (d: any) => ({
          id: d.id,
        }),
        Cell: () => (
          <div className="flex">
            <Button flat icon leftIcon="Edit" tooltip="Edit Target" className="mx-1" />
            <Button flat icon leftIcon="PieChart" tooltip="View Report" className="mx-1" />
          </div>
        ),
      },
    ],
    []
  );
  const campaignsColumns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Live',
        accessor: 'live',
      },
      {
        Header: 'Hour',
        accessor: 'hour',
        Cell: 0,
      },
      {
        Header: 'Impressions',
        accessor: 'impressions',
        Cell: 0,
      },
      {
        Header: 'Calls',
        accessor: 'calls',
        Cell: 0,
      },
      {
        Header: 'Conv.',
        accessor: 'conv',
        Cell: 0
      },
      {
        Header: 'Revenue',
        accessor: 'revenue',
        Cell: '$0'
      },
      {
        Header: 'Payout',
        accessor: 'payout',
        Cell: '$0'
      },
      {
        Header: 'Profit',
        accessor: 'profit',
        Cell: '$0'
      },
      {
        Header: 'Actions',
        accessor: (d: any) => ({
          id: d.id,
        }),
        Cell: () => (
          <div className="flex">
            <Button flat icon leftIcon="Edit" tooltip="Edit Campaign" className="mx-1" />
            <Button flat icon leftIcon="PieChart" tooltip="View Report" className="mx-1" />
          </div>
        ),
      },
    ],
    []
  );

  const TabPublishers = (
    <Datatable
      columns={publishersColumns}
      data={publishers}
      noPagination
      noSearch
      noColumnFilter
    />
  );

  const TabTargets = (
    <Datatable
      columns={targetsColumns}
      data={targets}
      noPagination
      noSearch
      noColumnFilter
    />
  );

  const TabCampaigns = (
    <Datatable
      columns={campaignsColumns}
      data={campaignes}
      noPagination
      noSearch
      noColumnFilter
    />
  );

  return(
    <div className="flex flex-wrap">
      <div className="w-full">
        <BoxTabs
          tabs={
            [
              { index: 0, title: 'Publishers', active: true, content: TabPublishers },
              { index: 1, title: 'Targets', active: false, content: TabTargets },
              { index: 2, title: 'Campaigns', active: false, content: TabCampaigns },
            ]
          }
          noContentPadding
        />
      </div>
    </div>
  );
}

const Messages: React.FunctionComponent<any> = () => {
  const TabUnreadMessage = (
    <p>...</p>
  );

  const TabAllMessage = (
    <p>...</p>
  );

  return(
    <BoxTabs
      tabs={
        [
          { index: 0, title: 'Unread', active: true, content: TabUnreadMessage },
          { index: 1, title: 'All', active: false, content: TabAllMessage },
        ]
      }
      // noContentPadding
    />
  );
}

export default Index;
