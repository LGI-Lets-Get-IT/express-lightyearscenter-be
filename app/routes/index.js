const _routes = [
  {
    path: "orders",
    router: require("./orders.routes"),
    middlewares: [],
    version: "1",
  },
  {
    path: "products",
    router: require('./products.routes'),
    middlewares: [],
    version: "1",
  },
  {
    path: "product-categories",
    router: require("./productCategory.routes"),
    middlewares: [],
    version: "1",
  },
  //   {
  //     path: "promotions",
  //     router: require("./promotions.routes"),
  //     middlewares: [],
  //     version: "1",
  //   },
];

module.exports = (app) => {
  _routes.forEach((route) => {
    const { path, router, middlewares, version } = route;
    app.use(`/api/v${version}/${path}`, middlewares, router);
  });
};
