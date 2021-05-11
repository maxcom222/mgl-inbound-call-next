import React from 'react';

const SectionTitle: React.FunctionComponent<any> = ({
  title,
  subtitle,
}: any) => (
  <div className="flex flex-col py-4 mb-4">
    <h1 className="text-2xl text-default font-poppins">{title}</h1>

    <h2 className="text-sm text-secondary">{subtitle}</h2>
  </div>
);

export default SectionTitle;
