import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import AccountLinks from './account-links';

const Widget3: React.FunctionComponent<any> = () => {
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
            <p className="text-sm font-bold whitespace-no-wrap">{user.name}</p>

            <p className="text-sm whitespace-no-wrap">{user.company}</p>

            <div className="text-sm whitespace-no-wrap">
              <div className="flex flex-row items-center justify-center children-x-2">
                <i className="icon-globe"></i>

                <span>{user.location}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-center">
            <div className="flex flex-col">
              <div className="flex flex-col p-2 items-center justify-center uppercase">
                <i className="text-xl text-twitter icon-social-twitter m-2"></i>

                <div className="text-sm">321</div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-col p-2 items-center justify-center uppercase">
                <i className="text-xl text-facebook icon-social-facebook m-2"></i>

                <div className="text-sm">888</div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-col p-2 items-center justify-center uppercase">
                <i className="text-xl text-google-plus icon-social-google m-2"></i>

                <div className="text-sm">654</div>
              </div>
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

export default Widget3;
