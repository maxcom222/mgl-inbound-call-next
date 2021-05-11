import React from 'react';
import { formatPercent } from 'functions/numbers';

const Item: React.FunctionComponent<any> = ({
  amount,
  title,
  percent,
}: any) => (
  <div className="w-1/2 lg:w-1/4">
    <div className="flex flex-col items-start justify-start">
      <div className={'text-2xl font-bold'}>{amount}</div>

      <div className="flex flex-row items-center justify-start">
        <div className={'text-xs font-light children-x-1'}>
          <span>{title}</span>

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
      title: 'Users',
      amount: '4,234',
      percent: 4.6,
    },
    {
      title: 'Profit',
      amount: '$9,332',
      percent: 22.5,
    },
    {
      title: 'Orders',
      amount: '543',
      percent: -1.54,
    },
    {
      title: 'Sales',
      amount: '$650',
      percent: 5.2,
    },
  ];

  return (
    <>
      {items.map((widget: any, i: any) => (
        <Item key={i} {...widget} />
      ))}
    </>
  );
};
export default TextWidget;
