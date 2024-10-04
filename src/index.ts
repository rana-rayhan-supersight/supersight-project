import "reflect-metadata";
import { serverPort } from "./secrect";
import AppDataSource from "./configs/data-source";
import app from "./app";

// Initialize the datasorce connection and running the server
AppDataSource.initialize()
  .then(() => {
    console.log("Database is connected !");
    app.listen(serverPort, () => {
      console.log(`Example app listening on port ${serverPort}!`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
