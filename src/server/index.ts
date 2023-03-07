import "../loadEnvironment.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";

export const app = express();

app.disable("x-powered-by");

const allowedOrigins = ["ALLOWED_ORIGIN_PRODUCTION, ALLOWED_ORIGIN_PORT"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));
app.use(morgan("dev"));
app.use(express.json());
