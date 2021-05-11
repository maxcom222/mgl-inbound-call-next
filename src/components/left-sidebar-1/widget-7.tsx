import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Button } from '../buttons';
import AccountLinks from './account-links';

const Widget7: React.FunctionComponent<any> = () => {
  const { user } = useSelector(
    (state: any) => ({
      user: state.global.user,
    }),
    shallowEqual
  );

  return (
    <>
      <div className="w-full px-4 pt-6 pb-2">
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

            <p className={'text-sm whitespace-no-wrap'}>{user.company}</p>

            <div className={'text-sm whitespace-no-wrap'}>
              <div className="flex flex-row items-center justify-center children-x-2">
                <i className="icon-globe"></i>

                <span>{user.location}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-center">
            <div className="p-1">
              <Button flat raised rounded color="blue">
                Settings
              </Button>
            </div>

            <div className="p-1">
              <Button flat raised rounded>
                Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AccountLinks />

      <style jsx>{`
        .text-facebook {
          color: #365397;
        }
        .text-twitter {
          color: #00a9f1;
        }
        .text-google-plus {
          color: #e0452c;
        }
      `}</style>
    </>
  );
};

export default Widget7;
