import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import AccountLinks from './account-links';

const Widget2: React.FunctionComponent<any> = () => {
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
          <div className="flex-shrink-0 w-16">
            <img
              src={`/assets/faces/${user.img}`}
              alt={user.name}
              className="shadow rounded-full h-16 w-16 border-2"
            />
          </div>

          <div className="ltr:ml-3 rtl:mr-3 py-2">
            <p className={' text-sm font-bold whitespace-no-wrap'}>
              {user.name}
            </p>

            <p className={'text-sm whitespace-no-wrap mb-1'}>{user.email}</p>

            <div className="flex flex-row items-center justify-start w-full children-x-2">
              <i className={'text-lg icon-social-twitter'}></i>

              <i className={'text-lg icon-social-facebook'}></i>

              <i className={'text-lg icon-social-instagram'}></i>
            </div>
          </div>
        </div>
      </div>

      <AccountLinks />
    </>
  );
};

export default Widget2;
