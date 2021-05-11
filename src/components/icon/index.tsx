import React from 'react';

const Icon: React.FunctionComponent<any> = ({ icon, classNames }: any) => (
  <i className={`${icon} ${classNames}`} />
);
export default Icon;
