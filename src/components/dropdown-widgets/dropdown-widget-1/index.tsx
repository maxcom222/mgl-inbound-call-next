import React, { useState, useEffect, createRef } from 'react';

import { useSelector, shallowEqual } from 'react-redux';
import { Box } from 'react-feather';

import Link from 'next/link';
import apps from 'json/apps.json';

const DropdownWidget1: React.FunctionComponent<any> = () => {
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
          <Box size={18} />
        </button>

        <div
          ref={dropdownRef}
          className={`navbar-dropdown dropdown ${
            direction === 'ltr' ? 'dropdown-right' : 'dropdown-left'
          } w-64 ${hidden ? '' : 'open'}`}
        >
          <div className="w-64 dropdown-content">
            <div className="navbar-dropdown-title dropdown-title">Apps</div>

            <div className="flex flex-wrap text-center">
              {apps.map((item: any, i: any) => (
                <Link href="/" key={i}>
                  <a className="w-1/3 flex flex-col items-center justify-center h-20">
                    <i className={`${item.icon} text-xl font-bold mb-1`} />

                    <span className="text-xs">{item.title}</span>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownWidget1;
