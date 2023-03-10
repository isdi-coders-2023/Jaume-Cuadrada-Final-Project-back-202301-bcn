import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../database/models/User";
import type { UserCredentials } from "./types";
import { loginUser } from "./usersControllers";
import { CustomError } from "../../CustomError/CustomError";
import mongoose from "mongoose";

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const req: Partial<Request> = {};
const next = jest.fn() as NextFunction;

beforeEach(() => jest.clearAllMocks());

describe("Given a loginUser controller", () => {
  const mockUser: UserCredentials = {
    username: "jaumecuadrada",
    password: "hola1234",
  };

  describe("When it receives a request with a username `jaumecuadrada` and password `hola1234` and the user is not registered in the database", () => {
    test("Then it should call its next method with a status 401 and the message `Wrong credentials`", async () => {
      const expectedError = new CustomError(
        "User not found",
        401,
        "Wrong credentials"
      );
      req.body = mockUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(undefined),
      }));

      await loginUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
  describe("When it receives a request with a username `jaumecuadrada` and password `hola1234` and the user is registered in the database", () => {
    test("Then it should call its status method with 200 and its json method with a token", async () => {
      const expectedStatusCode = 200;
      const mockToken = "asdfdsfg";

      const expectedBodyResponse = { token: mockToken };
      req.body = mockUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockUser,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue("asdfdsfg");

      await loginUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedBodyResponse);
    });
  });
  describe("When it receives a request with a username `jaumecuadrada` and password `hola1234` and the user is registered in the database but the passwords don't match", () => {
    test("Then it should call its next method with a status 401 and the message `Wrong credentials`", async () => {
      const expectedError = new CustomError(
        "Wrong password",
        401,
        "Wrong credentials"
      );
      req.body = mockUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockUser,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await loginUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
  describe("When the database responds with an error", () => {
    test("Then it should call its next method", async () => {
      const errorDatabase = new Error("error");

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockRejectedValue(errorDatabase),
      }));

      await loginUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(errorDatabase);
    });
  });
});
