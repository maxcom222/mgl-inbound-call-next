import React from 'react';

import { formatNumber, formatPercent } from 'functions/numbers';

const Item: React.FunctionComponent<any> = ({
  amount,
  title,
  percent,
}: any) => (
  <div className="w-1/2 mb-4 lg:w-1/4">
    <div className="flex flex-col items-start justify-center">
      <div className={'text-xl font-bold'}>{title}</div>

      <div className="flex flex-row items-center justify-start">
        <div className={'text-xs font-light children-x-1'}>
          <span>{formatNumber(amount)}</span>

          <span
            className={`${percent < 0 ? 'text-red-500' : 'text-green-500'}`}
          >
            ({formatPercent(percent)})
          </span>
        </div>
      </div>
    </div>
  </div>
);

const TextWidget: React.FunctionComponent<any> = () => {
  const items = [
    {
      title: 'S&P 500',
      amount: '4,234',
      percent: 4.6,
    },
    {
      title: 'Dow 30',
      amount: '9,332',
      percent: 22.5,
    },
    {
      title: 'Nasdaq',
      amount: '543',
      percent: -1.54,
    },
    {
      title: 'Nikkei 225',
      amount: '650',
      percent: 5.2,
    },
    {
      title: 'EUR/USD',
      amount: '1.0875',
      percent: '0.0035',
    },
    {
      title: 'USD/JPY',
      amount: '107.5500',
      percent: '-0.3700',
    },
    {
      title: 'GBP/USD',
      amount: '1.2499',
      percent: '0.0042',
    },
    {
      title: 'AUD/USD',
      amount: '0.6366',
      percent: '0.0039',
    },
  ];

  return (
    <div className="flex flex-wrap w-full">
      {items.map((widget: any, i: any) => (
        <Item {...widget} key={i} />
      ))}
    </div>
  );
};
export default TextWidget;
