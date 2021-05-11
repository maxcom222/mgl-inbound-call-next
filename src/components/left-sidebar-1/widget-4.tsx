import React from 'react';

import { useSelector, shallowEqual } from 'react-redux';
import AccountLinks from './account-links';

const Widget4: React.FunctionComponent<any> = () => {
  const { user } = useSelector(
    (state: any) => ({
      user: state.global.user,
    }),
    shallowEqual
  );

  return (
    <>
      <div className="w-full p-4 pb-0">
        <div className="flex flex-col w-full items-center justify-center text-center">
          <img
            src={`/assets/faces/${user.img}`}
            alt={user.name}
            className="shadow rounded-full h-20 w-20 border-2 mb-2"
          />

          <div className="py-2">
            <p className={' text-sm font-bold whitespace-no-wrap'}>
              {user.name}
            </p>

            <p className={'text-sm whitespace-no-wrap'}>{user.email}</p>
          </div>
        </div>
      </div>

      <AccountLinks />
    </>
  );
};

export default Widget4;
