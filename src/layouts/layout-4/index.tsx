import React from 'react';
import LeftSidebar1 from 'components/left-sidebar-1';
import RightSidebar1 from 'components/right-sidebar-1';
import Navbar1 from 'components/navbar-1';
import TopNavigation1 from 'components/top-navigation-1';

const Layout4: React.FunctionComponent<any> = ({ children }: any) => (
  <>
    <Navbar1 />

    <TopNavigation1 />

    <LeftSidebar1 />

    <RightSidebar1 />

    <div className="main w-full max-w-screen-xl">
      <div className="py-20 px-4 min-h-screen">{children}</div>
    </div>
  </>
);

export default Layout4;
