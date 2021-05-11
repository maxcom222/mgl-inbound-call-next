/* eslint-disable max-len, id-blacklist */
import React, { useState, useEffect, createRef } from 'react';

import { useSelector, shallowEqual } from 'react-redux';
import { Bell } from 'react-feather';

const ListWidget1: React.FunctionComponent<any> = ({
  number,
  title,
  subtitle,
  bg,
  color,
}: any) => (
  <div className={'flex items-center justify-start px-2'}>
    <div className="flex-shrink-0 w-8">
      <span
        className={`h-8 w-8 ${bg} ${color} flex items-center justify-center rounded-full text-lg font-display font-bold`}
      >
        {number}
      </span>
    </div>

    <div className="ltr:ml-2 rtl:mr-2 py-2">
      <p className="text-sm font-bold">{title}</p>

      <p className="text-xs">{subtitle}</p>
    </div>
  </div>
);

const DropdownWidget3: React.FunctionComponent<any> = () => {
  const { direction } = useSelector(
    (state: any) => ({
      direction: state.global.direction,
    }),
    shallowEqual
  );

  const [hidden, setHidden] = useState(true);
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

  return (
    <div className="hidden lg:flex h-16 w-12">
      <div className="relative">
        <button
          ref={buttonRef}
          className="flex items-center justify-center h-16 w-12"
          onClick={() => setHidden(!hidden)}
        >
          <Bell size={18} />
        </button>

        <div
          ref={dropdownRef}
          className={`navbar-dropdown dropdown ${
            direction === 'ltr' ? 'dropdown-right' : 'dropdown-left'
          } w-64 ${hidden ? '' : 'open'}`}
        >
          <div className="w-64 dropdown-content">
            <div className="navbar-dropdown-title dropdown-title">Tasks</div>

            <ListWidget1
              number="01"
              title="Lorem ipsum dolor sit amet"
              subtitle="Sed ut perspiciatis unde omnis iste natus error"
              bg="bg-teal-500"
              color="text-white"
            />

            <ListWidget1
              number="02"
              title="Lorem ipsum dolor sit amet"
              subtitle="Sed ut perspiciatis unde omnis iste natus error"
              bg="bg-indigo-500"
              color="text-white"
            />

            <ListWidget1
              number="03"
              title="Lorem ipsum dolor sit amet"
              subtitle="Sed ut perspiciatis unde omnis iste natus error"
              bg="bg-pink-500"
              color="text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownWidget3;
