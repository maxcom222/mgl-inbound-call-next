import React from 'react';
import { Badge } from '../../badges';

const Line: React.FunctionComponent<any> = ({
  color,
  badge,
  text,
  timestamp,
}: any) => (
  <div className="flex items-center justify-start px-2">
    <div className="flex-shrink-0 w-12">
      <Badge color={color} alt size="sm" rounded>
        {badge}
      </Badge>
    </div>

    <div className="py-2">
      <p className="text-default text-sm">{text}</p>

      <p className="text-secondary text-sm">{timestamp}</p>
    </div>
  </div>
);

const List1: React.FunctionComponent<any> = () => {
  const items = [
    {
      color: 'green',
      badge: 'buy',
      text: 'Someone in Australia bought BTC 50',
      timestamp: '2 minutes ago',
    },
    {
      color: 'red',
      badge: 'sell',
      text: 'Tom Hanks sold $3.000 in ETH',
      timestamp: '5 minutes ago',
    },
    {
      color: 'red',
      badge: 'sell',
      text: 'Michael from Canada sold $200.000 in AAPL stock',
      timestamp: '12 minutes ago',
    },
    {
      color: 'green',
      badge: 'buy',
      text: 'Someone in Mexico bought $980 in bitcoin',
      timestamp: '16 minutes ago',
    },
  ];

  return (
    <>
      {items.map((item: any, i: any) => (
        <Line key={i} {...item} />
      ))}
    </>
  );
};

export default List1;
