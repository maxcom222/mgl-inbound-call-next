import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import Link from 'next/link';

const backgrounds = [
  {
    title: 'Light',
    url: '/demos/demo-7',
    img: '/screenshots/7.png',
  },
  {
    title: 'Dark',
    url: '/demos/demo-8',
    img: '/screenshots/8.png',
  },
  {
    title: 'Blue',
    url: '/demos/demo-9',
    img: '/screenshots/9.png',
  },
];
const items = [
  {
    title: 'Default sidebar',
    url: '/demos/demo-1',
    img: '/screenshots/1.png',
  },
  {
    title: 'Dark sidebar',
    url: '/demos/demo-2',
    img: '/screenshots/2.png',
  },
  {
    title: 'Small sidebar',
    url: '/demos/demo-3',
    img: '/screenshots/3.png',
  },
  {
    title: 'Dark navbar',
    url: '/demos/demo-4',
    img: '/screenshots/4.png',
  },
  {
    title: 'Top navigation',
    url: '/demos/demo-5',
    img: '/screenshots/5.png',
  },
  {
    title: 'Sidebar over',
    url: '/demos/demo-6',
    img: '/screenshots/6.png',
  },
];

const Screenshots: React.FunctionComponent<any> = () => {
  const { direction } = useSelector(
    (state: any) => ({
      direction: state.global.direction,
    }),
    shallowEqual
  );

  return (
    <>
      <div className="flex flex-col items-center mb-4">
        <div className="text-sm leading-6 text-indigo-700 font-semibold tracking-wide uppercase mb-4">
          Available backgrounds
        </div>

        <div className="flex flex-row flex-wrap items-center justify-center mb-4">
          {backgrounds.map((item, i) => (
            <div className="w-full lg:w-1/3 p-8 lg:p-2 text-center" key={i}>
              <div className="flex flex-col mb-2 lg:mb-4">
                <Link href={item.url}>
                  <a className="text-sm text-secondary mb-2">{item.title}</a>
                </Link>

                <div className="flex flex-row items-center justify-center btn-group mb-2">
                  <Link href={item.url}>
                    <a className="btn btn-default btn-outlined btn-outlined-indigo">
                      LTR
                    </a>
                  </Link>

                  <Link href={`${item.url}-rtl`}>
                    <a className="btn btn-default btn-outlined btn-outlined-indigo">
                      RTL
                    </a>
                  </Link>
                </div>

                <div className="overflow-hidden w-full h-64 shadow-lg rounded">
                  <Link href={item.url}>
                    <a>
                      <img
                        src={
                          direction === 'ltr'
                            ? item.img
                            : item.img.replace('.png', '-rtl.png')
                        }
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

      <div className="flex flex-col items-center mb-4">
        <div className="text-sm leading-6 text-indigo-700 font-semibold tracking-wide uppercase mb-4">
          Available layouts
        </div>

        <div className="flex flex-row flex-wrap items-center justify-center mb-4">
          {items.map((item, i) => (
            <div className="w-full lg:w-1/3 p-8 lg:p-2 text-center" key={i}>
              <div className="flex flex-col mb-2 lg:mb-4">
                <Link href={item.url}>
                  <a className="text-sm text-secondary mb-2">{item.title}</a>
                </Link>

                <div className="flex flex-row items-center justify-center btn-group mb-2">
                  <Link href={item.url}>
                    <a className="btn btn-default btn-outlined btn-outlined-indigo">
                      LTR
                    </a>
                  </Link>

                  <Link href={`${item.url}-rtl`}>
                    <a className="btn btn-default btn-outlined btn-outlined-indigo">
                      RTL
                    </a>
                  </Link>
                </div>

                <div className="overflow-hidden w-full h-64 shadow-lg rounded">
                  <Link href={item.url}>
                    <a>
                      <img
                        src={
                          direction === 'ltr'
                            ? item.img
                            : item.img.replace('.png', '-rtl.png')
                        }
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
    </>
  );
};

export default Screenshots;
