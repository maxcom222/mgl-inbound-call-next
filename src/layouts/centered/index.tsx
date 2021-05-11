import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import Head from 'next/head';
import Logo from './logo';

const Centered: React.FunctionComponent<any> = ({ children }: any) => {
  const { direction, name } = useSelector(
    (state: any) => ({
      direction: state.global.direction,
      name: state.global.name,
    }),
    shallowEqual
  );

  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>

      <div
        data-background="white"
        data-logo="white"
        data-direction={direction}
        className={
          'text-gray-900 centered w-full h-screen flex items-center justify-center bg-gray-100 text-sm'
        }
      >
        <div className="w-full m-2 p-4 lg:w-1/3 lg:m-0 lg:p-8 bg-white shadow-lg">
          <Logo />

          {children}
        </div>
      </div>
    </>
  );
};

export default Centered;
