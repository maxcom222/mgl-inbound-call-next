import React from 'react';

import Link from 'next/link';

import navigation from '../../navigation';

const Button: React.FunctionComponent<any> = ({ menu }: any) => {
  if (menu.items.length === 0) {
    return (
      <Link href={menu.url}>
        <a className="l1 w-full inline-flex items-center justify-between px-3 h-16 whitespace-no-wrap children-x-2">
          <div className="font-bold text-base">{menu.icon}</div>

          <span className="ltr:mr-auto rtl:ml-auto">{menu.title}</span>
        </a>
      </Link>
    );
  }

  return (
    <button className="l1 w-full inline-flex items-center justify-between px-3 h-16 whitespace-no-wrap children-x-2">
      <div className="font-bold text-base">{menu.icon}</div>

      <span className="ltr:mr-auto rtl:ml-auto">{menu.title}</span>
    </button>
  );
};

const TopNavigation: React.FunctionComponent<any> = () => {
  const n = [].concat(...navigation.map((menu: any) => menu.items));

  return (
    <div className="top-navigation top-navigation-1">
      {n.map((menu: any, i: any) => (
        <ul key={i} className="list-none h-16 z-10">
          <li className="relative" key={i}>
            <Button menu={menu} />

            {menu.items.length > 0 && (
              <ul
                className={`list-none absolute flex z-10 shadow ${
                  menu.items.length > 8 ? 'flex-row flex-wrap w-96' : 'flex-col'
                }`}
                style={{ position: 'absolute', top: 'calc(100%)', left: 0 }}
              >
                {menu.items.map((items: any, j: any) => (
                  <li className="relative w-48" key={j}>
                    <Link href={items.url}>
                      <a className="w-full flex items-center justify-between h-12 whitespace-no-wrap px-3">
                        <span>{items.title}</span>
                      </a>
                    </Link>

                    <ul
                      className="list-none absolute flex flex-col z-10 w-48 shadow"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 'calc(100%)',
                      }}
                    >
                      {items.items.map((item: any, k: any) => (
                        <li key={k}>
                          <Link href={item.url}>
                            <a className="h-12 w-full inline-flex items-center whitespace-no-wrap">
                              {item.title}
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      ))}
    </div>
  );
};

export default TopNavigation;
