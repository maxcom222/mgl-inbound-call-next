import React from 'react';

const Item: React.FunctionComponent<any> = ({
  title,
  description,
  icon,
}: any) => (
  <div className="w-full lg:w-1/2 flex flex-row items-start justify-start mb-8 px-2">
    <div className="flex-shrink-0">
      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-white text-indigo-700">
        {icon}
      </div>
    </div>

    <div className="mx-4">
      <h5 className="text-lg leading-6 font-bold text-default mb-1">{title}</h5>

      <p className="text-base leading-6 text-secondary">{description}</p>
    </div>
  </div>
);

const Features: React.FunctionComponent<any> = () => (
  <div className="flex flex-row flex-wrap items-center justify-center mb-4 pt-12">
    <Item
      title="Zero Configuration"
      description="Automatic code splitting, filesystem based routing, hot code reloading and universal rendering."
      icon={<i className={'icon-settings text-3xl'}></i>}
    />

    <Item
      title="Ready for production"
      description="Optimized for a smaller build size, faster development compilation and easy to deploy"
      icon={<i className={'icon-plane text-3xl'}></i>}
    />

    <Item
      title="100+ widgets and components"
      description="Lots of widgets and components to help you develop your application faster"
      icon={<i className={'icon-layers text-3xl'}></i>}
    />

    <Item
      title="SSR ready"
      description="Statically generated and server-rendered React ready to deploy to your server"
      icon={<i className={'icon-speedometer text-3xl'}></i>}
    />
  </div>
);
export default Features;
