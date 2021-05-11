export type RouteRecord = {
  readonly path: string;
  readonly title: string;
};

export const ROUTES = {
  home: {
    path: '/dashboard',
    title: 'pageTitle.home',
  } as RouteRecord,
  login: {
    path: '/',
    title: 'pageTitle.login',
  } as RouteRecord,
};
