import React from 'react';
// import { Settings, Menu } from 'react-feather';
import { Menu } from 'react-feather';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import DropdownWidget1 from '../dropdown-widgets/dropdown-widget-1';
import DropdownWidget2 from '../dropdown-widgets/dropdown-widget-2';
import DropdownWidget3 from '../dropdown-widgets/dropdown-widget-3';
import DropdownWidget4 from '../dropdown-widgets/dropdown-widget-4';
import DropdownWidget5 from '../dropdown-widgets/dropdown-widget-5';
// import ChangeDirection from '../change-direction';
// import Search from './search';

const Navbar: React.FunctionComponent<any> = () => {
  // const { toggleRightSidebar, collapsed } = useSelector(
  const { collapsed } = useSelector(
    (state: any) => ({
      toggleRightSidebar: state.global.toggleRightSidebar,
      collapsed: state.global.collapsed,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();

  return (
    <div className="navbar navbar-1">
      <div className="navbar-inner w-full flex items-center justify-start">
        <button
          onClick={() =>
            dispatch({
              type: 'SET_CONFIG',
              payload: {
                config: {
                  key: 'collapsed',
                  value: !collapsed,
                },
              },
            })
          }
          className="mx-4"
        >
          <Menu size={20} />
        </button>
        {/* <Search /> */}
        <span className="ltr:ml-auto rtl:mr-auto"></span>
        <DropdownWidget1 />
        <DropdownWidget4 />
        <DropdownWidget3 />
        <DropdownWidget2 />
        <DropdownWidget5 />
        {/* <button
          className="btn-transparent flex items-center justify-center h-16 w-8 pl-2 lg:pl-0 ml-2"
          onClick={() =>
            dispatch({
              type: 'SET_CONFIG',
              payload: {
                config: {
                  key: 'toggleRightSidebar',
                  value: !toggleRightSidebar,
                },
              },
            })
          }
        >
          <Settings size={18} />
        </button>
        <ChangeDirection /> */}
      </div>
    </div>
  );
};

export default Navbar;
