import React, { useState, useEffect, createRef } from 'react';

import { useSelector, shallowEqual } from 'react-redux';
import Link from 'next/link';
import flags from 'json/navbar-flags.json';

const DropdownWidget2: React.FunctionComponent<any> = () => {
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
          <span className={'text-base flag-icon flag-icon-us'}></span>
        </button>

        <div
          ref={dropdownRef}
          className={`navbar-dropdown dropdown ${
            direction === 'ltr' ? 'dropdown-right' : 'dropdown-left'
          } w-64 ${hidden ? '' : 'open'}`}
        >
          <div className="w-64 dropdown-content">
            <div className="navbar-dropdown-title dropdown-title">
              Change country
            </div>

            <div className="flex flex-wrap">
              {flags.map((item: any, i: any) => (
                <Link href="/" key={i}>
                  <a className="w-1/2 flex items-center justify-start p-2 text-sm children-x-2">
                    <span
                      className={`text-base flag-icon flag-icon-${item.code}`}
                    ></span>

                    <span>{item.name}</span>
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
export default DropdownWidget2;
