const bookRouter = require("./book.route");
const nxbRouter = require("./nxb.route");

function route(app) {
  // render page in resources\views
  app.use("/api/books", bookRouter);
  app.use("/api/nxbs", nxbRouter);
}

module.exports = route;
