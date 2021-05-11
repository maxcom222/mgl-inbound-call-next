import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import AccountLinks from './account-links';

const Widget6: React.FunctionComponent<any> = () => {
  const { user } = useSelector(
    (state: any) => ({
      user: state.global.user,
    }),
    shallowEqual
  );

  return (
    <>
      <div className="w-full px-4 pt-6 pb-0">
        <div className="flex flex-col w-full items-center justify-start">
          <img
            src={`/assets/faces/${user.img}`}
            alt={user.name}
            className="shadow rounded-full h-20 w-20 border-2 mb-2"
          />

          <div className="flex flex-row items-center justify-center w-full">
            <div className="flex flex-col">
              <div className="flex flex-col p-2 items-center justify-center uppercase">
                <div className={' text-base font-bold'}>321</div>

                <i className={' text-xl icon-social-twitter m-2'}></i>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-col p-2 items-center justify-center uppercase">
                <div className={' text-base font-bold'}>888</div>

                <i className={' text-xl icon-social-facebook m-2'}></i>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-col p-2 items-center justify-center uppercase">
                <div className={' text-base font-bold'}>654</div>

                <i className={' text-xl icon-social-instagram m-2'}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AccountLinks />
    </>
  );
};

export default Widget6;
