import React from 'react';

import { useSelector, shallowEqual } from 'react-redux';
import Widget1 from './widget-1';
import Widget2 from './widget-2';
import Widget3 from './widget-3';
import Widget4 from './widget-4';
import Widget5 from './widget-5';
import Widget6 from './widget-6';
import Widget7 from './widget-7';

const User: React.FunctionComponent<any> = () => {
  const { leftSidebar } = useSelector(
    (state: any) => ({
      leftSidebar: state.global.leftSidebar,
    }),
    shallowEqual
  );
  const { showCard, card }: any = { ...leftSidebar };
  if (!showCard) return null;
  if (card === 1) {
    return <Widget1 />;
  }
  if (card === 2) {
    return <Widget2 />;
  }
  if (card === 3) {
    return <Widget3 />;
  }
  if (card === 4) {
    return <Widget4 />;
  }
  if (card === 5) {
    return <Widget5 />;
  }
  if (card === 6) {
    return <Widget6 />;
  }
  if (card === 7) {
    return <Widget7 />;
  }

  return null;
};

export default User;
