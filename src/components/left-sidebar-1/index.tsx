import React, { useEffect, createRef } from 'react';

import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import navigation from '../../navigation';
import Logo from './logo';
import User from './user';

import Title from './title';

import List from './list';

const Sidebar: React.FunctionComponent<any> = () => {
  const { toggleRightSidebar, collapsed, layout } = useSelector(
    (state: any) => ({
      leftSidebar: state.global.leftSidebar,
      toggleRightSidebar: state.global.toggleRightSidebar,
      collapsed: state.global.collapsed,
      layout: state.global.layout,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  const leftSidebarRef: React.RefObject<any> = createRef();
  useEffect(() => {
    const handleClickOutside = (event: any): boolean => {
      if (toggleRightSidebar) return false;
      if (layout !== 3) return false;
      if (!collapsed || leftSidebarRef.current.contains(event.target)) {
        return false;
      }
      dispatch({
        type: 'SET_CONFIG',
        payload: {
          config: {
            key: 'collapsed',
            value: !collapsed,
          },
        },
      });

      return true;
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [leftSidebarRef]);

  return (
    <div ref={leftSidebarRef} className={'left-sidebar left-sidebar-1 text-sm'}>
      <div>
        <div>
          <div className={'flex flex-col'}>
            <Logo />

            <div className="user-card">
              <User />
            </div>
          </div>
          {navigation.map((menu: any, i: any) => (
            <div className="flex flex-col" key={i}>
              <Title>{menu.title}</Title>

              <div className="flex flex-col">
                {menu.items.map((items: any, j: any) => (
                  <List key={j} items={items} />
                ))}
              </div>
            </div>
          ))}

          {/* {showProjects && <Projects />}

          {showTags && <Tags />} */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
