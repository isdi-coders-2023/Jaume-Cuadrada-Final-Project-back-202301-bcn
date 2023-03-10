import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../CustomError/CustomError.js";
import User from "../../database/models/User.js";
import { type CustomJwtPayload, type UserCredentials } from "./types";

export const loginUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { password, username } = req.body;
  try {
    const user = await User.findOne({ username }).exec();

    if (!user) {
      const error = new CustomError("User not found", 401, "Wrong credentials");

      throw error;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      const error = new CustomError("Wrong password", 401, "Wrong credentials");

      throw error;
    }

    const jwtPayload: CustomJwtPayload = {
      sub: user?._id.toString(),
      username,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
      expiresIn: "2d",
    });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};
