import React from 'react';

import { useDispatch } from 'react-redux';

const UserCard: React.FunctionComponent<any> = () => {
  const dispatch = useDispatch();

  return (
    <div className="mb-4">
      <div
        className={'uppercase text-xs font-bold font-poppins tracking-wider'}
      >
        User card
      </div>

      <div className="flex flex-row children-x-3">
        {[1, 2, 3, 4, 5, 6, 7].map((card, i) => (
          <button
            key={i}
            className={'btn-transparent h-10 px-1 rounded-full'}
            onClick={() => {
              dispatch({
                type: 'SET_LEFT_SIDEBAR_CONFIG',
                payload: {
                  key: 'card',
                  value: card,
                },
              });
            }}
          >
            {card}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserCard;
