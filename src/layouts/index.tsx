import React from 'react';
import Head from 'next/head';

import { useSelector, shallowEqual } from 'react-redux';
import Layout1 from './layout-1';
import Layout2 from './layout-2';
import Layout3 from './layout-3';
import Layout4 from './layout-4';

const Wrapper: React.FunctionComponent<any> = ({
  name,
  layout,
  direction,
  collapsed,
  background,
  navbar,
  logo,
  leftSidebar,
  rightSidebar,
  topNavigation,
  children,
}: any) => (
  <>
    <Head>
      <title>{name}</title>
    </Head>

    <div
      data-layout={layout}
      data-direction={direction}
      data-collapsed={collapsed}
      data-background={background}
      data-navbar={navbar}
      data-logo={logo}
      data-left-sidebar={leftSidebar}
      data-right-sidebar={rightSidebar}
      data-top-navigation={topNavigation}
    >
      {children}
    </div>
  </>
);

const Layout: React.FunctionComponent<any> = ({ children }: any) => {
  const { layout, direction, collapsed, name, palettes } = useSelector(
    (state: any) => ({
      layout: state.global.layout,
      direction: state.global.direction,
      collapsed: state.global.collapsed,
      name: state.global.name,
      palettes: state.global.palettes,
    }),
    shallowEqual
  );

  if (layout === 'layout-1') {
    return (
      <Wrapper
        name={name}
        direction={direction}
        layout={layout}
        collapsed={collapsed}
        {...palettes}
      >
        <Layout1>{children}</Layout1>
      </Wrapper>
    );
  }
  if (layout === 'layout-2') {
    return (
      <Wrapper
        name={name}
        direction={direction}
        layout={layout}
        collapsed={collapsed}
        {...palettes}
      >
        <Layout2>{children}</Layout2>
      </Wrapper>
    );
  }
  if (layout === 'layout-3') {
    return (
      <Wrapper
        name={name}
        direction={direction}
        layout={layout}
        collapsed={collapsed}
        {...palettes}
      >
        <Layout3>{children}</Layout3>
      </Wrapper>
    );
  }
  if (layout === 'layout-4') {
    return (
      <Wrapper
        name={name}
        direction={direction}
        layout={layout}
        collapsed={collapsed}
        {...palettes}
      >
        <Layout4>{children}</Layout4>
      </Wrapper>
    );
  }

  return (
    <Wrapper
      name={name}
      direction={direction}
      layout={layout}
      collapsed={collapsed}
      {...palettes}
    >
      <Layout1>{children}</Layout1>
    </Wrapper>
  );
};

export default Layout;
