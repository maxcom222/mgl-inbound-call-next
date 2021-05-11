import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import AccountLinks from './account-links';

const Widget1: React.FunctionComponent<any> = () => {
  const { user } = useSelector(
    (state: any) => ({
      user: state.global.user,
    }),
    shallowEqual
  );

  return (
    <>
      <div className="w-full p-4 pb-0">
        <div className="flex items-center justify-start">
          <div className="flex-shrink-0 w-12">
            <img
              src={`/assets/faces/${user.img}`}
              alt={user.name}
              className="shadow rounded-full h-12 w-12 border-2"
            />
          </div>

          <div className="ltr:ml-2 rtl:mr-2 py-2">
            <p className={'text-sm font-bold whitespace-no-wrap'}>
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

export default Widget1;
