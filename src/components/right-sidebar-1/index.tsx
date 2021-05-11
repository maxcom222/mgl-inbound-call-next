import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import Colors from './colors';
import UserCard from './user-card';
import Toggle from './toggle';

const layouts = [
  { name: 'layout-1', title: 'Default sidebar' },
  { name: 'layout-2', title: 'Sidebar over' },
  { name: 'layout-3', title: 'Small sidebar' },
  { name: 'layout-4', title: 'Top navigation' },
  // {name: 'layout-4', title: 'Small sidebar with text'},
];

const palettes = [
  { bg: 'bg-white', text: 'text-white', name: 'white' },
  { bg: 'bg-gray-100', text: 'text-gray-100', name: 'bg-gray-100' },
  { bg: 'bg-gray-900', text: 'text-gray-900', name: 'bg-gray-900' },
  { bg: 'bg-gray-800', text: 'text-gray-900', name: 'bg-gray-800' },
  { bg: 'bg-indigo-700', text: 'text-white', name: 'bg-indigo-700' },
  { bg: 'bg-indigo-800', text: 'text-white', name: 'bg-indigo-800' },
];

const items = [
  { title: 'Background', key: 'background' },
  { title: 'Left sidebar', key: 'leftSidebar' },
  { title: 'Navbar', key: 'navbar' },
  { title: 'Logo', key: 'logo' },
  { title: 'Top navigation', key: 'topNavigation' },
];

const Sidebar: React.FunctionComponent<any> = () => {
  const { leftSidebar, toggleRightSidebar } = useSelector(
    (state: any) => ({
      leftSidebar: state.global.leftSidebar,
      toggleRightSidebar: state.global.toggleRightSidebar,
    }),
    shallowEqual
  );
  const {
    showSectionTitle,
    showCard,
    showLogo,
  }: // showAccountLinks,
  // card,
  any = {
    ...leftSidebar,
  };
  const dispatch = useDispatch();

  return (
    <div
      className={`right-sidebar right-sidebar-1 ${
        toggleRightSidebar ? 'open' : ''
      }`}
    >
      <div>
        <div>
          <div className="flex flex-col">
            <div
              className={'px-4 h-16 flex flex-row items-center justify-between'}
            >
              <div className={'uppercase font-bold tracking-wider'}>
                Settings
              </div>

              <Toggle />
            </div>
          </div>

          <div className="flex flex-col p-4">
            {/* section*/}

            <div className="mb-4">
              <div
                className={
                  'uppercase text-sm font-bold font-poppins tracking-wider'
                }
              >
                Direction
              </div>

              <div className="flex flex-row children-x-2">
                {['ltr', 'rtl'].map((direction, i) => (
                  <button
                    key={i}
                    className={
                      'h-10 rounded-full bg-white text-default uppercase'
                    }
                    onClick={() => {
                      dispatch({
                        type: 'SET_CONFIG',
                        payload: {
                          config: {
                            key: 'direction',
                            value: direction,
                          },
                        },
                      });
                    }}
                  >
                    {direction}
                  </button>
                ))}
              </div>
            </div>

            {/* section*/}

            <div className="mb-4">
              <div
                className={
                  'uppercase text-sm font-bold font-poppins tracking-wider'
                }
              >
                Layout
              </div>

              <div className="flex flex-col">
                {layouts.map((layout, i) => (
                  <button
                    key={i}
                    className={'flex h-8 w-full'}
                    onClick={() => {
                      dispatch({
                        type: 'SET_LAYOUT',
                        payload: {
                          layout: layout.name,
                        },
                      });
                    }}
                  >
                    {layout.title}
                  </button>
                ))}
              </div>
            </div>

            {/* section*/}

            <div className="mb-4">
              <div
                className={
                  'uppercase text-sm font-bold font-poppins tracking-wider'
                }
              >
                Left sidebar
              </div>

              <button
                className={'flex h-8 w-full'}
                onClick={() =>
                  dispatch({
                    type: 'SET_LEFT_SIDEBAR_CONFIG',
                    payload: {
                      key: 'showLogo',
                      value: !showLogo,
                    },
                  })
                }
              >
                {showLogo ? 'Hide ' : 'Show '} logo
              </button>

              <button
                className={'flex h-8 w-full'}
                onClick={() =>
                  dispatch({
                    type: 'SET_LEFT_SIDEBAR_CONFIG',
                    payload: {
                      key: 'showSectionTitle',
                      value: !showSectionTitle,
                    },
                  })
                }
              >
                {showSectionTitle ? 'Hide ' : 'Show '} section title
              </button>

              <button
                className={'flex h-8 w-full'}
                onClick={() =>
                  dispatch({
                    type: 'SET_LEFT_SIDEBAR_CONFIG',
                    payload: {
                      key: 'showCard',
                      value: !showCard,
                    },
                  })
                }
              >
                {showCard ? 'Hide ' : 'Show '} user card
              </button>

              {/*
              <button
                className={`flex h-8 w-full`}
                onClick={() =>
                  dispatch({
                    type: 'SET_LEFT_SIDEBAR_CONFIG',
                    payload: {
                    key: 'showAccountLinks',
                    value: !showAccountLinks
                    }
                  })
                }>
                {showAccountLinks ? 'Hide ' : 'Show '} account links
              </button>
              */}
            </div>
            {/* end section*/}

            {/* section*/}

            {showCard && <UserCard />}
            {/* end section*/}

            {/* section*/}

            <div className="mb-2">
              <div
                className={
                  'uppercase text-sm font-bold font-poppins tracking-wider mb-2'
                }
              >
                Colors
              </div>
            </div>

            {items.map((item) => (
              <Colors
                key={item.key}
                title={item.title}
                palettes={palettes}
                name={item.key}
              />
            ))}

            {/* end section*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
