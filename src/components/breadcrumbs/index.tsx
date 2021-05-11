import React from 'react';
import Link from 'next/link';

const Breadcrumb: React.FunctionComponent<any> = ({ items }: any) => (
  <nav className="breadcrumbs">
    <ol>
      {items.map((item: any, i: any) => (
        <li className="children-x-2" key={i}>
          <Link href={item.url}>
            <a className={`${item.last ? 'text-secondary' : 'text-default'}`}>
              {item.title}
            </a>
          </Link>

          {!item.last && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={
                'breadcrumb-arrow text-default stroke-current inline-block h-3 w-3'
              }
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumb;
