import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import Head from 'next/head';

const Empty: React.FunctionComponent<any> = ({ children }: any) => {
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
      <div data-direction={direction}>{children}</div>
    </>
  );
};

export default Empty;
