import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import AccountLinks from './account-links';

const Widget5: React.FunctionComponent<any> = () => {
  const { user } = useSelector(
    (state: any) => ({
      user: state.global.user,
    }),
    shallowEqual
  );

  return (
    <>
      <div className="w-full p-4 pb-0">
        <div className="flex flex-col w-full items-center justify-start">
          <img
            src={`/assets/faces/${user.img}`}
            alt={user.name}
            className="shadow rounded-full h-20 w-20 border-2 mb-2"
          />

          <div className="flex flex-row items-center justify-center w-full">
            <div className="flex flex-col">
              <div className="flex flex-col p-2 items-center justify-center uppercase">
                <div className={' text-lg font-bold'}>321</div>

                <div className={'text-xs font-light'}>Likes</div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-col p-2 items-center justify-center uppercase">
                <div className={' text-lg font-bold'}>888</div>

                <div className={'text-xs font-light'}>Stars</div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-col p-2 items-center justify-center uppercase">
                <div className={' text-lg font-bold'}>654</div>

                <div className={'text-xs font-light'}>Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AccountLinks />
    </>
  );
};

export default Widget5;
