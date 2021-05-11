/* eslint-disable id-blacklist */
import React from 'react';
import * as Icon from 'react-feather';
import { getColor } from 'functions/colors';

const Item: React.FunctionComponent<any> = ({
  icon,
  color,
  text,
  number,
}: any) => (
  <div className="w-1/2 mb-4 lg:w-1/4">
    <div
      className={'flex flex-row flex-nowrap w-full items-center justify-start'}
    >
      <div
        className={`border-2 border-${color}-500 rounded-full flex items-center justify-center w-12 h-12`}
      >
        {icon}
      </div>

      <div className={'flex flex-col p-2 items-start uppercase'}>
        <div className={'text-xs font-light whitespace-no-wrap'}>{text}</div>

        <div className={'text-xl font-bold'}>{number}</div>
      </div>
    </div>
  </div>
);

const IconWidget: React.FunctionComponent<any> = () => {
  const items = [
    {
      icon: <Icon.DollarSign size={28} color={getColor('text-indigo-500')} />,

      color: 'indigo',

      text: 'Profit',

      number: '$47,982',
    },
    {
      icon: <Icon.Activity size={28} color={getColor('text-indigo-500')} />,

      color: 'indigo',

      text: 'Sessions',

      number: '1,222',
    },
    {
      icon: <Icon.User size={28} color={getColor('text-indigo-500')} />,

      color: 'indigo',

      text: 'Users',

      number: '449',
    },
    {
      icon: <Icon.BarChart2 size={28} color={getColor('text-indigo-500')} />,

      color: 'indigo',

      text: 'Income',

      number: '21%',
    },
  ];

  return (
    <>
      {items.map((widget, i) => (
        <Item key={i} {...widget} />
      ))}
    </>
  );
};

export default IconWidget;
