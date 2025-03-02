const _routes = [
  {
    path: 'auth',
    router: require('./auth.routes'),
    middlewares: [],
    version: '1'
  },
  {
    path: "appointments",
    router: require("./appointments.routes"),
    middlewares: [],
    version: "1",
  },
  {
    path: "clients",
    router: require("./appointments.routes"),
    middlewares: [],
    version: "1",
  },
  {
    path: 'schools',
    router: require('./schools.routes'),
    middlewares: [],
    version: '1'
  }
];

module.exports = (app) => {
  _routes.forEach((route) => {
    const { path, router, middlewares, version } = route;
    app.use(`/api/v${version}/${path}`, middlewares, router);
  });
};
