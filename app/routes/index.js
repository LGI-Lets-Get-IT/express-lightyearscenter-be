const { version } = require('joi');
const verifyJwt = require('../middlewares/verifyJwt.middleware');
const verifyPermission = require('../middlewares/verifyPermission.middleware');

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
    middlewares: [verifyJwt],
    version: "1",
  },
  {
    path: 'assessments',
    router: require('./assessments.routes'),
    middlewares: [verifyJwt],
    version: '1',
  },
  {
    path: "clients",
    router: require("./clients.routes"),
    middlewares: [verifyJwt],
    version: "1",
  },
  {
    path: "employees",
    router: require("./employees.routes"),
    middlewares: [verifyJwt],
    version: "1",
  },
  {
    path: 'files',
    router: require('./files.routes'),
    middlewares: [],
    version: '1'
  },
  {
    path: 'notifications',
    router: require('./notifications.routes'),
    middlewares: [verifyJwt],
    version: '1',
  },
  {
    path: 'schools',
    router: require('./schools.routes'),
    middlewares: [verifyJwt],
    version: '1'
  },
  {
    path: 'treatments',
    router: require('./treatmentTypes.routes'),
    middlewares: [verifyJwt],
    version: '1'
  },
  {
    path: 'treatment-plans',
    router: require('./treatmentPlans.routes'),
    middlewares: [verifyJwt],
    version: '1'
  },
  {
    path: 'treatment-types',
    router: require('./treatmentTypes.routes'),
    middlewares: [verifyJwt],
    version: '1',
  },
  {
    path: 'test-types',
    router: require('./testTypes.routes'),
    middlewares: [verifyJwt],
    version: '1',
  },
];

module.exports = (app) => {
  _routes.forEach((route) => {
    const { path, router, middlewares, version } = route;
    app.use(`/api/v${version}/${path}`, middlewares, router);
  });
};
