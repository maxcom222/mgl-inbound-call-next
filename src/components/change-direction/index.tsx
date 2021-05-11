import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

const ChangeDirection: React.FunctionComponent<any> = () => {
  const { direction } = useSelector(
    (state: any) => ({
      direction: state.global.direction,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();

  return (
    <button
      className="btn btn-default btn-transparent"
      onClick={() => {
        dispatch({
          type: 'SET_CONFIG',
          payload: {
            config: {
              key: 'direction',
              value: direction === 'ltr' ? 'rtl' : 'ltr',
            },
          },
        });
      }}
    >
      {direction === 'ltr' ? 'rtl' : 'ltr'}
    </button>
  );
};

export default ChangeDirection;
