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
  <div className="flex flex-col w-full mb-4 lg:w-1/4">
    <div className="flex flex-row items-center justify-between pr-4">
      <div className={'text-sm font-bold'}>{title}</div>

      <div className={'text-base font-bold'}>{amount}</div>
    </div>

    <div className="flex flex-row items-center justify-between mb-2 pr-4">
      <div className={'text-xs font-light'}>{subtitle}</div>

      <div className="text-green-500 text-xs font-light">({percent}%)</div>
    </div>
    {/* @ts-expect-error */}
    <ProgressBar width={bar} bg={color} />
  </div>
);

const ProgressBarWidget: React.FunctionComponent<any> = () => {
  const items = [
    {
      title: 'Income',
      subtitle: 'Last year',
      amount: '$25,842',
      percent: 4.4,
      bar: 50,
      color: 'bg-teal-500',
    },
    {
      title: 'Profit',
      subtitle: 'This week',
      amount: '$10,250',
      percent: -2.5,
      bar: 60,
      color: 'bg-red-500',
    },
    {
      title: 'Sales',
      subtitle: 'This year',
      amount: '$145,983',
      percent: 10.9,
      bar: 75,
      color: 'bg-indigo-700',
    },
    {
      title: 'CPC',
      subtitle: 'Last month',
      amount: '$1.46',
      percent: -0.15,
      bar: 33,
      color: 'bg-yellow-500',
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
