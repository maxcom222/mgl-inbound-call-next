import React from 'react';
import Link from 'next/link';

const Screenshots: React.FunctionComponent<any> = () => {
  const items = [
    {
      title: 'Default sidebar',
      url: '/demos/demo-1',
      img: '/screenshots/layout-1-dark-sidebar.png',
    },
    {
      title: 'Small sidebar',
      url: '/demos/demo-2',
      img: '/screenshots/2.png',
    },
    {
      title: 'Small sidebar with text',
      url: '/demos/demo-3',
      img: '/screenshots/3.png',
    },
    {
      title: 'Top navigation',
      url: '/demos/demo-4',
      img: '/screenshots/5.png',
    },
    {
      title: 'Sidebar over',
      url: '/demos/demo-5',
      img: '/screenshots/4.png',
    },
    {
      title: 'Fixed navbar',
      url: '/demos/demo-6',
      img: '/screenshots/layout-1-indigo-navbar.png',
    },
  ];

  const sidebars = [
    {
      title: 'Layout 1',
      url: '/layouts/layout-1',
      img: '/screenshots/layout-1-user-1.png',
    },
    {
      title: 'Layout 1',
      url: '/layouts/layout-1',
      img: '/screenshots/layout-1-user-2.png',
    },
    {
      title: 'Layout 1',
      url: '/layouts/layout-1',
      img: '/screenshots/layout-1-user-3.png',
    },
    {
      title: 'Layout 1',
      url: '/layouts/layout-1',
      img: '/screenshots/layout-1-user-4.png',
    },
    {
      title: 'Layout 1',
      url: '/layouts/layout-1',
      img: '/screenshots/layout-1-user-5.png',
    },
    {
      title: 'Layout 1',
      url: '/layouts/layout-1',
      img: '/screenshots/layout-1-user-6.png',
    },
  ];

  return (
    <>
      <div
        className={
          'container mx-auto max-w-screen-xl bg-white text-default py-4'
        }
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex flex-wrap items-center justify-center mb-8">
            {items.map((item, i) => (
              <div className="w-1/4 p-4 text-center" key={i}>
                <div className="flex flex-col">
                  <Link href={item.url}>
                    <a className="text-sm text-secondary mb-2">{item.title}</a>
                  </Link>

                  <div className="screenshot shadow-lg rounded h-16">
                    <Link href={item.url}>
                      <a>
                        <img
                          src={item.img}
                          alt={item.title}
                          className="h-auto w-full"
                        />
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden">
            <div className="flex items-center justify-center mb-2">
              <div className="text-indigo-700 uppercase text-sm font-bold">
                Sidebar alternatives
              </div>
            </div>

            <div className="flex flex-wrap mb-8">
              {sidebars.map((item, i) => (
                <div className="flex-1 text-center" key={i}>
                  <div className="flex flex-col">
                    <Link href={item.url}>
                      <a className="text-sm text-secondary mb-2">
                        {item.title}
                      </a>
                    </Link>

                    <div className="sidebar-screenshot shadow-lg rounded h-16">
                      <Link href={item.url}>
                        <a>
                          <img
                            src={item.img}
                            alt={item.title}
                            className="h-auto w-full"
                          />
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .screenshot {
          height: 12rem;
          overflow: hidden;
        }
        .sidebar-screenshot {
          height: 12rem;
          overflow: hidden;
          clip-path: polygon(0 0, 50px 0, 50px 16rem, 0 16rem);
        }
      `}</style>
    </>
  );
};

export default Screenshots;
