const bookRouter = require("./book.route");

function route(app) {
  // render page in resources\views
  app.use("/api/books", bookRouter);
}

module.exports = route;
