import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { confirmAlert } from 'react-confirm-alert';
import { NotificationManager } from 'react-notifications';
import {Tooltip} from 'react-tippy';
import * as Icon from 'react-feather';

import { VIEW_TARGETS } from 'shared/queries/targets';
import Layout from 'layouts';
import Widget from 'components/widget';
import Datatable from 'components/datatable';
import { CircularBadge } from 'components/badges';
import api from 'shared/utils/api';
import { Button } from 'components/buttons';

const Index: React.FunctionComponent<any> = () => {
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: '_name'
      },
      {
        Header: 'Simuldial',
        accessor: '_simuldial',
        Cell: (cell) => cell.value
          ? <Icon.Check size={14} strokeWidth={3} className="text-green-600" />
          : <Icon.X size={14} strokeWidth={3} className="text-red-500" />
      },
      {
        Header: 'Schedule Override',
        accessor: '_scheduleOverride'
      },
      {
        Header: 'Capacity Override',
        accessor: '_capacityOverride'
      },
      {
        Header: 'Concurrency Override',
        accessor: '_concurrencyOverride'
      },
      {
        Header: 'Live',
        accessor: 'live',
        Cell: 0
      },
      {
        Header: 'Targets',
        accessor: '_targets'
      },
      {
        Header: 'Hour',
        accessor: 'hour',
        Cell: 0
      },
      {
        Header: 'Day',
        accessor: 'day',
        Cell: 0
      },
      {
        Header: 'Month',
        accessor: 'month',
        Cell: 0
      },
      {
        Header: 'Total',
        accessor: 'routes',
        // Cell: (cell: any) => cell.value.length
      },
      {
        Header: 'Status',
        accessor: 'enabled',
        Cell: (cell: any) =>
          cell.value ? (
            <Tooltip
              title="Open"
              position="right"
              arrow={true}
              duration={0}
              hideDuration={0}
            >
              <CircularBadge size="xs" color="green">
                {' '}
              </CircularBadge>
            </Tooltip>
          ) : (
            <Tooltip
              title="Disabled"
              position="right"
              arrow={true}
              duration={0}
              hideDuration={0}
            >
              <CircularBadge size="xs" color="gray">
                {' '}
              </CircularBadge>
            </Tooltip>
          )
      },
      {
        Header: 'Actions',
        accessor: (row: any) => ({
          id: row.id,
          workerSid: row.workerSid
        }),
        Cell: (cell: any) => (
          <div className="flex">
            <Link href={`/targets/${cell.value.id}`}>
              <>
                <Button flat icon leftIcon="Edit" tooltip="Edit" className="mx-1" />
              </>
            </Link>
            <Button flat icon leftIcon="PauseCircle" disabled tooltip="Disable Group" className="mx-1" />
            <Button flat icon leftIcon="StopCircle" disabled tooltip="Disable Group Targets" className="mx-1" />
            <Button flat icon leftIcon="Repeat" disabled tooltip="Reset Caps" className="mx-1" />
            <Button
              flat
              icon
              leftIcon="XCircle"
              tooltip="Delete Target Group"
              className="mx-1"
              onClick={() => handleConfirmDelete(cell.value.workerSid)}
            />
          </div>
        )
      }
    ],
    []
  );

  const { loading, data, refetch } = useQuery(VIEW_TARGETS, {
    fetchPolicy: 'network-only'
  });

  const handleConfirmDelete = (workerSid: number):void => {
    confirmAlert({
      title: 'Confirm Delete Target Group',
      message: 'Are you sure to delete this target group?',
      buttons: [
        {
          label: 'Yes, delete it!',
          onClick: () => {
            void api.post('group/delete', {
              workerSid
            }).then(() => {
              NotificationManager.success('Target group has been deleted');
              void refetch();
            });
          }
        },
        {
          label: 'No',
          onClick: () => false
        }
      ]
    });
  }

  console.log('-----', data);

  if(loading) return <></>;

  return (
    <Layout>
      <Widget title="Manage Groups" paddingTop={0}>
        <Datatable
          columns={columns}
          data={[]}
          customColumnable
          noPagination
        />
      </Widget>
    </Layout>
  );
};

export default Index;
