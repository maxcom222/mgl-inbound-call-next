import React from 'react';

import { ProgressBar } from '../../progress-bars';

const Item: React.FunctionComponent<any> = ({
  title,
  subtitle,
  amount,
  percent,
  bar,
  color,
}: any) => (
  <div className="flex flex-col mb-2">
    <div className="flex flex-row items-center justify-between">
      <div className={'text-sm font-bold'}>{title}</div>

      <div className={'text-base font-bold'}>{amount}</div>
    </div>

    <div className="flex flex-row items-center justify-between mb-2">
      <div className={'text-xs font-light'}>{subtitle}</div>

      <div className="text-green-500 text-xs font-light">({percent}%)</div>
    </div>

    <ProgressBar width={bar} color={color} />
  </div>
);

const ProgressBarWidget: React.FunctionComponent<any> = () => {
  const items = [
    {
      title: 'Energy',
      subtitle: '3:59 PM',
      amount: '$25,842',
      percent: 4.4,
      bar: 50,
      color: 'teal',
    },
    {
      title: 'Industrials',
      subtitle: '12:00 AM',
      amount: '$10,250',
      percent: -2.5,
      bar: 60,
      color: 'red',
    },
    {
      title: 'Commodities',
      subtitle: '1:30 PM',
      amount: '$145,983',
      percent: 10.9,
      bar: 75,
      color: 'blue',
    },
    {
      title: 'Technology',
      subtitle: '3:30 PM',
      amount: '$1.46',
      percent: -0.15,
      bar: 33,
      color: 'yellow',
    },
  ];

  return (
    <>
      {items.map((widget: any, i: any) => (
        <Item {...widget} key={i} />
      ))}
    </>
  );
};
export default ProgressBarWidget;
