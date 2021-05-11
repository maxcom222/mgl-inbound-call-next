/* eslint-disable react/jsx-key */
import React from 'react';

import SectionTitle from '../section-title';
import { Badge } from '../badges';

const items = [
  {
    date: 'May 8, 2020',
    tag: (
      <Badge color="blue" alt rounded>
        update
      </Badge>
    ),
    items: [<span>Added RTL version</span>],
  },

  {
    date: 'May 3, 2020',
    tag: (
      <Badge color="blue" alt rounded>
        update
      </Badge>
    ),
    items: [<span>Added dark and coloured backgrounds</span>],
  },

  {
    date: 'May 1, 2020',
    tag: (
      <Badge color="green" alt rounded>
        Release
      </Badge>
    ),
    items: [
      <span>Initial release</span>,
      <>
        Published template at{' '}
        <a
          href="https://concavo.mobifica.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          this demo url
        </a>
      </>,
    ],
  },
];
export const ChangeLog: React.FunctionComponent<any> = () => (
  <>
    <SectionTitle title="Change log" subtitle="Latest updates" />

    <div className="flex flex-col">
      {items.map((item: any, i: any) => (
        <div className="w-full mb-2" key={i}>
          <div className="text-base font-poppins font-bold mb-2">
            {item.date}
          </div>

          <p className="mb-2">{item.tag}</p>

          <ol className="list-disc pl-6">
            {item.items.map((list: any, j: any) => (
              <li className="mb-2" key={j}>
                {list}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  </>
);
