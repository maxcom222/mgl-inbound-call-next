/* eslint-disable functional/no-class */
/* eslint-disable functional/no-this-expression */
import React from 'react';
import App, { AppInitialProps, AppContext } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import { END } from 'redux-saga';
import NProgress from 'nprogress';
import { NotificationContainer } from 'react-notifications';

// import { makeServer } from 'shared/utils/mirage';
import { I18n } from 'shared/vendor/i18n';
import ConnectedLayout from 'shared/components/layout/ConntectedLayout';
import { reduxWrapper } from '../store';

import 'react-confirm-alert/src/react-confirm-alert.css';
import "react-datepicker/dist/react-datepicker.css";
import 'rc-time-picker/assets/index.css';
import 'react-tippy/dist/tippy.css';
import '../scss/styles.scss';
import '../scss/_components.scss';
import '../scss/_layouts.scss';
import '../scss/_palettes.scss';
import '../scss/react-circular-progressbar.scss';
import '../scss/rc-slider.scss';
import '../scss/react-datetime.scss';
import '../scss/react-notifications.scss';
import '../scss/nprogress.scss';
import '../styles/flexboxgrid.min.css';

if (process.env.NODE_ENV === 'development' && process.browser) {
  // makeServer({ environment: 'development' });
}

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

class WrappedApp extends App<AppInitialProps> {
  public static readonly getInitialProps = async ({
    Component,
    ctx,
  }: AppContext): Promise<any> => {
    // 1. Wait for all page actions to dispatch
    const pageProps = {
      ...(Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {}),
    };

    // 2. Stop the saga if on server
    if (ctx.req) {
      ctx.store.dispatch(END);
      const store = (ctx as any).store;
      await store.sagaTask.toPromise();
    }

    // 3. Return props
    return {
      pageProps,
    };
  };

  render(): JSX.Element {
    const { Component, pageProps } = this.props;

    return (
      <I18n lngDict={pageProps.lngDict} locale={pageProps.lng}>
        <Head>
          <meta charSet="utf-8" />

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
          />
          <meta
            name="description"
            content="Concavo - React and Tailwind CSS admin template"
          />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <ConnectedLayout>
          <Component {...pageProps} />
          <NotificationContainer />
        </ConnectedLayout>
      </I18n>
    );
  }
}

export default reduxWrapper.withRedux(WrappedApp);
