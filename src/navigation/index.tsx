import React from 'react';
import * as Icon from 'react-feather';

const navigation = [
  {
    title: 'Applications',
    items: [
      {
        icon: <Icon.Box size={16} />,
        url: '/dashboard',
        title: 'Dashboard',
        items: []
      },
      {
        icon: <Icon.Activity size={16} />,
        url: '/reporting',
        title: 'Reporting',
        items: []
      },
      {
        icon: <Icon.Zap size={16} />,
        title: 'Campaigns',
        items: [
          {
            url: '/campaigns/wizard',
            title: 'Create Campaign',
          },
          {
            url: '/campaigns',
            title: 'Manage Campaigns'
          }
        ]
      },
      {
        icon: <Icon.UserCheck size={16} />,
        title: 'Publishers',
        url: '/publishers',
        items: []
      },
      {
        icon: <Icon.Crosshair size={16} />,
        title: 'Targets',
        items: [
          {
            url: '/targets/create',
            title: 'Create Target'
          },
          {
            url: '/targets',
            title: 'Manage Targets'
          },
          {
            url: '/groups/create',
            title: 'Create Group'
          },
          {
            url: '/groups',
            title: 'Manage Groups'
          },
          {
            url: '/buyers',
            title: 'Buyers'
          }
        ]
      },
      {
        icon: <Icon.Phone size={16} />,
        title: 'Numbers',
        items: [
          {
            url: '/numbers/create',
            title: 'Create Number'
          },
          {
            url: '/numbers',
            title: 'Manage Numbers'
          },
          {
            url: '/number-pools',
            title: 'Manage Pools'
          },
          {
            url: '/blocked-numbers',
            title: 'Manage Blocking'
          }
        ]
      },
      // {
      //   icon: <Icon.Calendar size={16} />,
      //   title: 'Tasks',
      //   url: '#tasks',
      //   items: []
      // },
      {
        icon: <Icon.Grid size={16} />,
        title: 'Integrations',
        items: [
          {
            url: '/urlparams',
            title: 'URL Parameters'
          },
          {
            url: '/pixels',
            title: 'Pixels'
          },
          {
            url: '/webhooks',
            title: 'Webhooks'
          },
          {
            url: '/platforms',
            title: 'Platforms Beta'
          },
        ],
      },
      {
        icon: <Icon.Sliders size={16} />,
        title: 'Settings',
        items: [
          {
            url: '/user-account',
            title: 'Account Details'
          },
          {
            url: '/user-account-settings',
            title: 'Account Settings'
          },
          {
            url: '/user-addresses',
            title: 'Manage Addresses'
          },
          {
            url: '/users',
            title: 'Manage Users'
          },
          {
            url: '/user-billing',
            title: 'Billing Settings'
          },
          {
            url: '/user-profile',
            title: 'Profile'
          },
          {
            url: '/api-tokens',
            title: 'API Access Tokens'
          },
          {
            url: '/whitelabel-settings',
            title: 'White Label Settings'
          },
        ]
      }
    ]
  }
];
export default navigation;
