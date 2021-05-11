import React from 'react';
import Layout from 'layouts/empty';
import Logo from 'components/landing/logo';
import Icons from 'components/landing/icons';
import Images from 'components/landing/images';
import Title from 'components/landing/title';
import Text from 'components/landing/text';
import Features from 'components/landing/features';
import Options from 'components/landing/options';
import Screenshots from 'components/landing/screenshots';
import { useRouter } from 'next/router';

const IndexPage: React.FunctionComponent<any> = () => {
  const router = useRouter();
  // router.push('/login');

  return(
  <Layout>
    <div
      className={
        'homepage bg-white text-default w-full py-4 px-8 flex items-center justify-start shadow'
      }
    >
      <Logo />
    </div>
    <div className="container max-w-screen-lg mx-auto lg:px-4">
      {/* section*/}
      <div className="mb-4 lg:mb-16 pt-4 lg:pt-24">
        <div className="flex flex-wrap items-center">
          <div className="w-full p-4 lg:w-3/5 lg:px-8">
            <Title />
            <Text />
            <div className="flex flex-row items-center justify-start mb-6">
              <Icons />
            </div>
            <div className="flex flex-row items-center justify-start">
              <a
                href="#"
                className="btn btn-default btn-lg bg-indigo-700 text-white rounded-lg"
                onClick={() => {router.push('/login')}}
              >
                Goto MGL APP
              </a>
            </div>
          </div>
          <div className="hidden lg:flex lg:w-2/5">
            <Images />
          </div>
        </div>
      </div>

      <Options />
      <Features />
      <Screenshots />

      <div className="text-center text-xs text-gray-400 pb-4">
        &copy; 2020 Batchthemes
      </div>
    </div>
  </Layout>
  );
};

export default IndexPage;
