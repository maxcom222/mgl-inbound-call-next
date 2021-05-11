import React from 'react';
import { X } from 'react-feather';

import { useSelector, useDispatch, shallowEqual } from 'react-redux';

const Toggle: React.FunctionComponent<any> = () => {
  const { toggleRightSidebar } = useSelector(
    (state: any) => ({
      toggleRightSidebar: state.global.toggleRightSidebar,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();

  return (
    <button
      onClick={() =>
        dispatch({
          type: 'SET_CONFIG',
          payload: {
            config: {
              key: 'toggleRightSidebar',
              value: !toggleRightSidebar,
            },
          },
        })
      }
      className="btn btn-transparent btn-circle"
    >
      <X />
    </button>
  );
};

export default Toggle;
