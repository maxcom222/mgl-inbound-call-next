import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import Link from 'next/link';
import { ToggleLeft } from 'react-feather';
import Layout from 'layouts/empty';
import Router from 'next/router';
import { LoginForm } from 'shared/components/auth/LoginForm';
import { ROUTES } from 'shared/routes';
import { AppState } from '../store/types';

const Logo: React.FunctionComponent<any> = () => {
  const { name } = useSelector(
    (state: any) => ({
      name: state.global.name,
    }),
    shallowEqual
  );

  return (
    <div
      className="
        bg-transparent text-white flex flex-row items-center uppercase font-bold text-2xl tracking-wider
        justify-start z-10
      ">
      <Link href="/">
        <a className="flex flex-row items-center justify-start">
          <ToggleLeft size={28} />

          <span className="ltr:ml-1 rtl:mr-2 font-sans">{name}</span>
        </a>
      </Link>
    </div>
  );
};

const LoginPage: React.FunctionComponent<any> = () => {
  const isAuthenticated = useSelector(
    (state: AppState) => state.global.isAuthenticated
  );
  const { name } = useSelector(
    (state: any) => ({
      name: state.global.name,
    }),
    shallowEqual
  );

  if (isAuthenticated) {
    void Router.push(ROUTES.home.path);

    return null;
  }

  return (
    <Layout>
      <div
        className="w-full flex flex-row h-screen overflow-hidden"
        data-background="white"
      >
        <div
          className="
            hidden lg:flex lg:flex-col w-1/2 bg-purple-700 text-white p-8 items-start justify-between relative
          "
        >
          <img
            alt="bg"
            className="img1 absolute inset-0 z-0 object-contain h-auto w-full opacity-50"
            src="/bg-login-1.jpg"
          />
          <Logo />

          <div className="flex flex-col z-10">
            <p className="text-3xl font-bold font-poppins mb-4">
              Welcome to {name}!
            </p>

            <p className="text-sm font-thin">
              Pellentesque habitant morbi tristique senectus et netus et
              malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat
              vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit
              amet quam egestas semper. Aenean ultricies mi vitae est. Mauris
              placerat eleifend leo.
            </p>
          </div>

          <div className="flex flex-row items-center justify-between w-full text-xs z-10">
            <div className="text-white">&copy; {name} 2020</div>

            <div className="flex flex-row ml-auto">
              <div className="px-1">
                <Link href="/pages/privacy-policy">
                  <a>Privacy policy</a>
                </Link>
              </div>

              <div className="px-1">
                <Link href="/pages/terms-of-service">
                  <a>Terms of service</a>
                </Link>
              </div>

              <div className="px-1">
                <Link href="/pages/contact-us">
                  <a>Contact us</a>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          className="
            w-full lg:w-1/2 bg-white text-default p-8 md:p-48 lg:p-56 flex flex-col items-center justify-center
          "
        >
          <p className="text-3xl font-bold font-poppins mb-4">
            Login to {name}
          </p>

          <div className="w-full mb-4"></div>

          <LoginForm
            onSubmit={() => {
              Router.push(ROUTES.home.path);
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
