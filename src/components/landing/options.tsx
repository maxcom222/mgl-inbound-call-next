import React from 'react';

const Item: React.FunctionComponent<any> = ({ value, title }: any) => (
  <div className="flex flex-col text-indigo-700 p-2 lg:p-6 w-1/2 lg:w-1/5">
    <div className="text-3xl font-bold">{value}</div>

    <div className="font-sm text-secondary">{title}</div>
  </div>
);

const Options: React.FunctionComponent<any> = () => (
  <div className="flex flex-row flex-wrap items-center justify-center uppercase mb-4 text-center">
    <Item value="3" title="Backgrounds" />

    <Item value="4" title="Layouts" />

    <Item value="+100" title="Components" />
    {/*
    <Item value="5" title="Sample apps" />
    */}

    <Item value="2" title="Dashboards" />

    <Item value="7" title="Sidebar options" />
  </div>
);

export default Options;
