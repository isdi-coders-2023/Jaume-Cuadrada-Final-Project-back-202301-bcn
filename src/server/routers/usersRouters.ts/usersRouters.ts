import { validate } from "express-validation";
import { Router } from "express";
import loginUserSchema from "../../../database/models/loginUserSchema.js";
import { loginUser } from "../../controllers/usersControllers.js";

const usersRouter = Router();

usersRouter.post(
  "/login",
  validate(loginUserSchema, {}, { abortEarly: false }),
  loginUser
);
export default usersRouter;
