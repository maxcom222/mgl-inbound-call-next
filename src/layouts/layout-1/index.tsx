import React from 'react';
import LeftSidebar1 from 'components/left-sidebar-1';
import RightSidebar1 from 'components/right-sidebar-1';
import Navbar1 from 'components/navbar-1';

const Layout1: React.FunctionComponent<any> = ({ children }: any) => (
  <>
    <Navbar1 />

    <LeftSidebar1 />

    <RightSidebar1 />

    <div className="main w-full">
      <div className="py-22 px-6 min-h-screen">{children}</div>
    </div>
  </>
);

export default Layout1;
