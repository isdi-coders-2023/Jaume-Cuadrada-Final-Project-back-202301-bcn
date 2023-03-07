import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../CustomError/CustomError";
import User from "../../database/models/User";
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
    const user = await User.findOne({ username });

    if (!user) {
      throw new CustomError("User not found", 401, "Wrong credentials");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new CustomError("Wrong password", 401, "Wrong credentials");
    }

    const jwtPayload: CustomJwtPayload = {
      sub: user?._id.toString(),
      username: user.username,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
      expiresIn: "2d",
    });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};
