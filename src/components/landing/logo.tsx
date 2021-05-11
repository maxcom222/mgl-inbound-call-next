import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import Link from 'next/link';
import { ToggleLeft } from 'react-feather';
import { getColor } from 'functions/colors';

const Logo: React.FunctionComponent<any> = () => {
  const { name } = useSelector(
    (state: any) => ({
      name: state.global.name,
    }),
    shallowEqual
  );

  return (
    <div className="flex items-center justify-center">
      <Link href="/">
        <a
          className={
            'flex flex-row items-center justify-start uppercase font-bold tracking-wider children-x-2'
          }
        >
          <ToggleLeft size={28} color={getColor('text-indigo-700')} />

          <span className="text-xl">{name}</span>
        </a>
      </Link>
    </div>
  );
};

export default Logo;
