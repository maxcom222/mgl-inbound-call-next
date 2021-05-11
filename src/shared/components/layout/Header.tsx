import Link from 'next/link';
import React, { useState } from 'react';
import { connect, MapDispatchToProps, useSelector } from 'react-redux';
import { actionOpenMobileSidebar } from '../../../store/global/actions';
import { IconButton } from '../general/Button';
import { OpenMobileSidebarAction } from '../../../store/global/types';
import { AppState } from '../../../store/types';
import { useI18n } from '../../hooks';
import { LogoutLink } from '../auth/LogoutLink';

type IDispatchProps = {
  readonly openMobileSidebar: () => OpenMobileSidebarAction;
};

type HeaderProps = IDispatchProps;
type NavLinkProps = {
  readonly title: string;
  readonly route: string;
};

const aClass = 'block text-white';
const liClass = 'mt-3 md:mt-0 md:ml-6';

const NavLink: React.FunctionComponent<NavLinkProps> = ({ title, route }) => (
  <li className={liClass}>
    <Link href={route}>
      <a className={aClass}>{title}</a>
    </Link>
  </li>
);

const Header: React.FunctionComponent<HeaderProps> = () => {
  const [isExpanded, toggleExpansion] = useState(false);
  const isAuthenticated = useSelector(
    (state: AppState) => state.global.isAuthenticated
  );
  const i18n = useI18n();

  const authRoute = !isAuthenticated ? (
    <NavLink title={i18n.t('general.login')} route="/auth/login" />
  ) : (
    <li className={liClass}>
      <LogoutLink className={aClass} />
    </li>
  );

  const listClass = `${
    isExpanded ? 'block' : 'hidden'
  } md:flex flex-col md:flex-row md:items-center md:justify-center text-sm w-full md:w-auto`;

  return (
    <header className="bg-teal-500">
      <div className="flex flex-wrap md:flex-no-wrap items-center justify-between max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex items-center">
          <Link href="/">
            <a className="font-bold text-white text-xl">
              Next.js Starter Tailwind
            </a>
          </Link>
        </div>

        <IconButton
          icon="las la-bars"
          className="block md:hidden border border-white flex items-center px-3 py-2 rounded text-white"
          onClick={() => toggleExpansion(!isExpanded)}
        ></IconButton>

        <ul className={listClass}>
          {[
            { title: 'pageTitle.home', route: '/' },
            { title: 'pageTitle.about', route: '/about' },
          ].map((navigationItem) => (
            <NavLink
              key={navigationItem.title}
              title={i18n.t(navigationItem.title)}
              route={navigationItem.route}
            ></NavLink>
          ))}
          {authRoute}
        </ul>
      </div>
    </header>
  );
};

const mapDispatchToProps: MapDispatchToProps<IDispatchProps, HeaderProps> = {
  openMobileSidebar: () => actionOpenMobileSidebar,
};

export default connect(null, mapDispatchToProps)(Header);
