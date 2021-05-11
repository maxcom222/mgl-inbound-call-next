import React from 'react';
import { ToggleLeft } from 'react-feather';

import { useSelector, shallowEqual } from 'react-redux';
import Link from 'next/link';

const Logo: React.FunctionComponent<any> = () => {
  const { name } = useSelector(
    (state: any) => ({
      name: state.global.name,
    }),
    shallowEqual
  );

  return (
    <div className="logo flex flex-row items-center uppercase font-bold text-lg tracking-wider justify-center mb-4">
      <Link href="/">
        <a className="flex flex-row items-center justify-start children-x-1">
          <ToggleLeft size={26} />

          <span>{name}</span>
        </a>
      </Link>
    </div>
  );
};

export default Logo;
