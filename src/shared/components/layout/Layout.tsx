import Head from 'next/head';
import React from 'react';
import Footer from './Footer';
import Headers from './Header';

type Props = {
  readonly title?: string;
};

const layoutClassName = 'min-h-screen flex flex-col justify-between';

export const Layout: React.FunctionComponent<Props> = ({
  children,
  title = 'This is the default title',
}) => (
  <div className={layoutClassName}>
    <Head>
      <title>{title}</title>
    </Head>
    <Headers />
    {children}
    <Footer />
  </div>
);
