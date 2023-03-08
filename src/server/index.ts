import "../loadEnvironment.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { notFoundError, generalError } from "./middlewares/errorMiddlewares.js";
import usersRouter from "./routers/usersRouters.ts/usersRouters.js";

export const app = express();

app.disable("x-powered-by");

const allowedOrigins = [
  process.env.ALLOWED_ORIGIN_PRODUCTION!,
  process.env.ALLOWED_ORIGIN_PORT!,
];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));
app.use(morgan("dev"));
app.use(express.json());

app.use("/users", usersRouter);

app.use(notFoundError);
app.use(generalError);
