import "../loadEnvironment.js";
import mongoose from "mongoose";
import debug from "debug";

const connectDataBase = async (url: string) => {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(url);
  } catch (error: unknown) {
    debug("Connection to database failed");
  }
};

export default connectDataBase;
