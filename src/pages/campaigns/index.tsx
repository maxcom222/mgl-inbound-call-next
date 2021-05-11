import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { confirmAlert } from 'react-confirm-alert';
import { NotificationManager } from 'react-notifications';
import { useMutation } from '@apollo/react-hooks';
import {Tooltip} from 'react-tippy';

import { VIEW_CAMPAIGNS, DELETE_CAMPAIGN } from 'shared/queries/campaigns';
import Layout from 'layouts';
import Widget from 'components/widget';
import Datatable from 'components/datatable';
import { Badge } from 'components/badges';
import Flag from 'components/flag';
import api from 'shared/utils/api';
import {Button} from 'components/buttons';

const Index: React.FunctionComponent<any> = () => {
  const columns = useMemo(
    () => [
      {
        Header: 'Status',
        accessor: (row) => ({
          enabled: row.enabled,
          completed: row.completed
        }),
        Cell: (cell: any) => {
          if(cell.value.completed){
            return cell.value.enabled === true ? (
              <Tooltip
                title="Accepting calls"
                position="right"
                arrow={true}
                duration={0}
                hideDuration={0}
              >
                <Badge size="sm" color="green">&nbsp;&nbsp;Live&nbsp;&nbsp;</Badge>
              </Tooltip>
            ) : (
              <Tooltip
                title="Not accepting calls"
                position="right"
                arrow={true}
                duration={0}
                hideDuration={0}
              >
                <Badge size="sm" color="yellow">Paused</Badge>
              </Tooltip>
            );
          }

          return(
            <Tooltip
              title="Finish Campaign setup to accept calls"
              position="right"
              arrow={true}
              duration={0}
              hideDuration={0}
            >
              <Badge size="sm" color="red">Setup</Badge>
            </Tooltip>
          )
        }
      },
      {
        Header: 'Name',
        accessor: (row: any) => ({
          id: row.id,
          name: row.name,
          completed: row.completed
        }),
        Cell: (cell: any) => (
          <Link
            href={cell.value.completed ? `/campaigns/${cell.value.id}` : `/campaigns/wizard/${cell.value.id}/1`}
          >
            {cell.value.name}
          </Link>
        ),
      },
      {
        Header: 'Offer Name',
        accessor: 'offerName',
      },
      {
        Header: 'Country',
        accessor: 'countryCode',
        Cell: (cell: any) => (
          <Tooltip
            title={cell.value}
            position="right"
            arrow={true}
            duration={0}
            hideDuration={0}
          >
            <Flag size={'sm'} code={cell.value.toLowerCase()} />
          </Tooltip>
        ),
      },
      {
        Header: 'Recording',
        accessor: 'recordSetting',
        Cell:
          (cell: any) =>
            cell.value !== null
              ? (
                  cell.value.record
                    ? (
                      <Tooltip
                        title="Recording Enabled"
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
                        title="Recording Disabled"
                        position="right"
                        arrow={true}
                        duration={0}
                        hideDuration={0}
                      >
                        No
                      </Tooltip>
                    )
                  )
              : '',
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
        Cell: (cell: any) => cell.value.length,
      },
      {
        Header: 'Actions',
        accessor: (row) => ({
          id: row.id,
          completed: row.completed,
          workflowSid: row.workflowSid
        }),
        Cell: (cell: any) => (
          <div style={{ display: 'flex' }}>
            <Link href={cell.value.completed ? `/campaigns/${cell.value.id}` : `/campaigns/wizard/${cell.value.id}/1`}>
              <>
                <Button flat icon leftIcon="Edit" tooltip="Edit Campaign" className="mx-1" />
              </>
            </Link>
            <Button
              flat
              icon
              leftIcon="XCircle"
              tooltip="Delete Campaign"
              className="mx-1"
              onClick={() => {
                if(cell.value.completed){
                  handleCampaignDelete(cell.value.workflowSid);
                }else{
                  handleDraftDelete(cell.value.id);
                }
              }}
            />
          </div>
        ),
      },
    ],
    []
  );
  const { loading, data, refetch } = useQuery(VIEW_CAMPAIGNS, {
    fetchPolicy: 'network-only'
  });
  const handleCampaignDelete = (workflowSid: number):void => {
    confirmAlert({
      title: 'Confirm Delete Campaign',
      message: 'Are you sure to delete this campaign?',
      buttons: [
        {
          label: 'Yes, delete it!',
          onClick: () => {
            void api.post('campaign/delete', {
              workflowSid
            }).then(() => {
              NotificationManager.success('Campaign has been deleted');
              void refetch();
            });
          }
        },
        {
          label: 'No',
          onClick: () => ''
        }
      ]
    });
  }
  const handleDraftDelete = (id: number):void => {
    confirmAlert({
      title: 'Confirm Delete Campaign Draft',
      message: 'Are you sure to delete this campaign draft?',
      buttons: [
        {
          label: 'Yes, delete it!',
          onClick: () => {
            deleteCampaign({
              variables: {
                id
              }
            });
          }
        },
        {
          label: 'No',
          onClick: () => ''
        }
      ]
    });
  }

  const [deleteCampaign] = useMutation(DELETE_CAMPAIGN, {
    onCompleted: () => {
      NotificationManager.success('Campaign draft has been deleted');
      void refetch();
    }
  });

  console.log('-----', data);

  if(loading) return <></>;

  return (
    <Layout>
      <Widget title="Manage Campaigns">
        <Datatable
          columns={columns}
          data={data.campaigns}
          searchable
          customColumnable
          noPagination
        />
      </Widget>
    </Layout>
  );
};

export default Index;
