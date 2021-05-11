import React from 'react';

const WidgetTitle: React.FunctionComponent<any> = ({
  title,
  description,
}: any) => (
  <div className="flex flex-col mb-6 widget-title w-full">
    <div className="title text-xl font-base font-poppins">{title}</div>

    <div className="description text-sm">{description}</div>
  </div>
);

export default WidgetTitle;
