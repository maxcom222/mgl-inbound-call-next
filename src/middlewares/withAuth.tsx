import React from 'react';
import { useRouter } from 'next/router';
import {useSelector} from 'react-redux';
import { AppState } from '../store/types';

const witAuth: React.FunctionComponent<any> = (props) => {
  const route = useRouter();
  const isAuthenticated = useSelector(
    (state: AppState) => state.global.isAuthenticated
  );
  if (!isAuthenticated) {
    void route.push('/login');

    return null;
  }

  return props.children;
};

export default witAuth;
