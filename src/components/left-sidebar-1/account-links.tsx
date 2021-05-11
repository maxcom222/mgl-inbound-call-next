import React from 'react';
import Link from 'next/link';
import { useSelector, shallowEqual } from 'react-redux';
import * as Icon from 'react-feather';
import { CircularBadge } from '../badges';
import Title from './title';

const AccountLinks: React.FunctionComponent<any> = () => {
  const items = [
    {
      url: '/',
      icon: <Icon.Mail size={20} />,
      name: 'Inbox',

      badge: true,

      badgeNumber: 2,

      badgeColor: 'red',
    },
    {
      url: '/',

      icon: <Icon.Star size={20} />,

      iconColor: 'default',

      name: 'Messages',

      badge: true,

      badgeNumber: 3,

      badgeColor: 'indigo',
    },
    {
      url: '/extras/user-profile',

      icon: <Icon.User size={20} />,

      name: 'Profile',

      badge: false,
    },
    {
      url: '/logout',

      icon: <Icon.LogIn size={20} />,

      name: 'Logout',

      badge: false,
    },
  ];

  const { leftSidebar } = useSelector(
    (state: any) => ({
      leftSidebar: state.global.leftSidebar,
    }),
    shallowEqual
  );
  const { showAccountLinks }: any = { ...leftSidebar };
  if (!showAccountLinks) return null;

  return (
    <div className="flex flex-col w-full">
      <Title>My account</Title>

      <ul className="list-none px-4">
        {items.map((item: any, i: any) => (
          <li className="relative" key={i}>
            <Link href={item.url}>
              <a className="list-item children-x-2">
                {item.icon}

                <span>{item.name}</span>

                {item.badge && (
                  <CircularBadge size="sm" color={item.badgeColor}>
                    {item.badgeNumber}
                  </CircularBadge>
                )}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountLinks;
