const app = require("./app");
const config = require("./app/config");
const MongDB = require("./app/utils/mongodb.util");

async function startServer() {
  try {
    await MongDB.connect(config.db.uri);
    console.log("Connected to the database!");
    const PORT = config.app.port;
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.log("Cannot connect to the database!", error);
    process.exit();
  }
}

startServer();