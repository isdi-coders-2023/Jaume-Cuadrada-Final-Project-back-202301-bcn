import "./loadEnvironment.js";
import chalk from "chalk";
import mongoose from "mongoose";
import createDebug from "debug";
import startServer from "./server/startServer.js";
import connectDataBase from "./database/connectDatabase.js";

const debug = createDebug("waxcrate-api:server");

const port = process.env.PORT ?? 4000;
const mongoDdUrl = process.env.MONGODB_CONNECTION_URL;

mongoose.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

try {
  await connectDataBase(mongoDdUrl!);
  debug(chalk.green("Connected to data base"));

  await startServer(+port);
  debug(chalk.green(`Server listening on port ${port}`));
} catch (error) {
  debug(error.message);
}
