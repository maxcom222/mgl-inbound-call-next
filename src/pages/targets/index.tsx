import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { confirmAlert } from 'react-confirm-alert';
import { NotificationManager } from 'react-notifications';
import {Tooltip} from 'react-tippy';

import { VIEW_TARGETS } from 'shared/queries/targets';
import Layout from 'layouts';
import Widget from 'components/widget';
import Datatable from 'components/datatable';
import { CircularBadge } from 'components/badges';
import Icon from 'components/icon';
import api from 'shared/utils/api';
import { Button } from 'components/buttons';

const Index: React.FunctionComponent<any> = () => {
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: (row: any) => ({
          id: row.id,
          name: row.name,
          isSelf: row.isSelf,
        }),
        Cell: (cell: any) =>
          cell.value.isSelf ? (
            'You'
          ) : (
            <Link href={`/targets/${cell.value.id}`}>
              {cell.value.name}
            </Link>
          ),
      },
      {
        Header: 'Buyer',
        accessor: 'owner',
        Cell: (cell: any) => (cell.value === null ? '' : cell.value.name),
      },
      {
        Header: 'Type',
        accessor: 'instructions',
        Cell: (cell: any) => {
          if (cell.value.callType === 'number') {
            return (
              <Tooltip
                title={`${cell.value.callType.charAt(0).toUpperCase()} ${cell.value.callType.slice(1)}`}
                position="right"
                arrow={true}
                duration={0}
                hideDuration={0}
              >
                <Icon icon="icon-phone" classNames={`text-base`} />
              </Tooltip>
            );
          }else if(cell.value.callType === 'sip'){
            return (
              <Tooltip
                title={cell.value.callType.toUpperCase()}
                position="right"
                arrow={true}
                duration={0}
                hideDuration={0}
              >
                <Icon icon="icon-organization " classNames={`text-base`} />
              </Tooltip>
            );
          }

          return <></>;
        },
      },
      {
        Header: 'Destination',
        accessor: (row: any) => row.instructions.number,
        Cell: (cell: any) => cell.value,
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
          ),
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
                <Button flat icon leftIcon="Edit" tooltip="Edit Target" className="mx-1" />
              </>
            </Link>
            <Button flat icon leftIcon="PauseCircle" tooltip="Pause Target" className="mx-1" />
            <Button flat icon leftIcon="Copy" tooltip="Duplicate Target" className="mx-1" />
            <Button flat icon leftIcon="PieChart" tooltip="View Reports" className="mx-1" />
            <Button
              flat
              icon
              leftIcon="XCircle"
              tooltip="Delete Target"
              className="mx-1"
              onClick={() => handleConfirmDelete(cell.value.workerSid)}
            />
          </div>
        ),
      },
    ],
    []
  );

  const { loading, data, refetch } = useQuery(VIEW_TARGETS, {
    fetchPolicy: 'network-only'
  });

  const handleConfirmDelete = (workerSid: number):void => {
    confirmAlert({
      title: 'Confirm Delete Target',
      message: 'Are you sure to delete this target?',
      buttons: [
        {
          label: 'Yes, delete it!',
          onClick: () => {
            void api.post('target/delete', {
              workerSid
            }).then(() => {
              NotificationManager.success('Target has been deleted');
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
      <Widget title="Manage Targets">
        <Datatable
          columns={columns}
          data={data.targets}
          searchable
          customColumnable
          noPagination
          filterOptions={[
            {
              label: 'Open',
              option: (v) => v.enabled
            },
            {
              label: 'Concurrency Hit',
              option: () => false
            },
            {
              label: 'Group Concurrency Hit',
              option: () => false
            },
            {
              label: 'Capped',
              option: () => false
            },
            {
              label: 'Group Capped',
              option: () => false
            },
            {
              label: 'Closed',
              option: () => false
            },
            {
              label: 'Group Closed',
              option: () => false
            },
            {
              label: 'Disabled',
              option: () => false
            },
            {
              label: 'Group Disabled',
              option: () => false
            },
          ]}
        />
      </Widget>
    </Layout>
  );
};

export default Index;
