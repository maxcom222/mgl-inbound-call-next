import React, { useState, useEffect, createRef } from 'react';
import * as Icon from 'react-feather';

import { useSelector, shallowEqual , useDispatch } from 'react-redux';
import Link from 'next/link';

import { authProvider } from 'shared/auth';
import Router from 'next/router';
import { CircularBadge } from '../../badges';
import { actionUnauthenticate } from '../../../store/global/actions';

const DropdownWidget5: React.FunctionComponent<any> = () => {
  const { direction } = useSelector(
    (state: any) => ({
      direction: state.global.direction,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();

  const [hidden, setHidden] = useState(true);
  const { user } = useSelector(
    (state: any) => ({
      user: state.global.user,
    }),
    shallowEqual
  );
  const buttonRef = createRef<HTMLButtonElement>();
  const dropdownRef = createRef<HTMLDivElement>();
  useEffect(() => {
    const handleClickOutside = (event: any): boolean => {
      if (
        hidden ||
        buttonRef?.current?.contains(event.target) ||
        dropdownRef?.current?.contains(event.target)
      ) {
        return false;
      }
      setHidden(!hidden);

      return true;
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef, buttonRef]);

  const items = [
    {
      url: '/settings',

      icon: <Icon.Settings size={16} />,
      iconColor: 'default',
      name: 'Settings',
      badge: false,
    },
    {
      url: '/extras/user-profile',

      icon: <Icon.User size={16} />,
      name: 'Profile',
      badge: false,
    },
  ];

  return (
    <div className="flex items-center justify-center h-16 w-8 mx-2">
      <div className="relative">
        <button
          ref={buttonRef}
          className="flex h-16 w-8 rounded-full ml-2 relative"
          onClick={() => setHidden(!hidden)}
        >
          <span className="absolute top-0 left-0 pt-4">
            <img
              className="h-8 w-8 rounded-full shadow"
              src={`/assets/faces/${user.img}`}
              alt={user.name}
            />
          </span>
        </button>

        <div
          ref={dropdownRef}
          className={`navbar-dropdown dropdown ${
            direction === 'ltr' ? 'dropdown-right' : 'dropdown-left'
          } w-48 ${hidden ? '' : 'open'}`}
        >
          <div className="w-48 dropdown-content">
            <div className="navbar-dropdown-title dropdown-title">
              My account
            </div>

            <div className="flex flex-col w-full">
              {items.map((item:any, i) => (
                <Link href={item.url} key={i}>
                  <a className="w-full flex items-center justify-start px-4 py-2 text-sm children-x-2">
                    {item.icon}

                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="ltr:ml-auto rtl:mr-auto">
                        <CircularBadge size="sm" color={item.badgeColor}>
                          {item.badgeNumber}
                        </CircularBadge>
                      </span>
                    )}
                  </a>
                </Link>
              ))}
              <a
                className="w-full flex items-center justify-start px-4 py-2 text-sm children-x-2"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  authProvider
                    .logout()
                    .then(() => dispatch(actionUnauthenticate));
                  void Router.push('/login');
                }}
              >
                <Icon.LogIn size={16} />
                <span>Logout</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownWidget5;
