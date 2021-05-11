import React from 'react';

import { useSelector, shallowEqual } from 'react-redux';

const Title: React.FunctionComponent<any> = ({ children }: any) => {
  const { leftSidebar } = useSelector(
    (state: any) => ({
      leftSidebar: state.global.leftSidebar,
    }),
    shallowEqual
  );
  const { showSectionTitle }: any = { ...leftSidebar };
  if (!showSectionTitle) return null;

  return (
    <div className="uppercase font-bold text-xs tracking-wider p-4">
      {children}
    </div>
  );
};

export default Title;
