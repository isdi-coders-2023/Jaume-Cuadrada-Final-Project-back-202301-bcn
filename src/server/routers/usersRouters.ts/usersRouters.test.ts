import request from "supertest";
import mongoose from "mongoose";
import { type UserCredentials } from "../../controllers/types";
import { MongoMemoryServer } from "mongodb-memory-server";
import { loginUserErrors } from "../../utils/errors";
import statusCodes from "../../utils/statusCodes";
import connectDatabase from "../../../database/connectDatabase";
import User from "../../../database/models/User";
import { app } from "../..";

const { success, clientError } = statusCodes;

let mongodbServer: MongoMemoryServer;

beforeAll(async () => {
  mongodbServer = await MongoMemoryServer.create();
  const mongodbServerUrl = mongodbServer.getUri();

  await connectDatabase(mongodbServerUrl);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongodbServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe("Given a POST '/users/login' endpoint", () => {
  const loginUrl = "/users/login";
  const mockUser: UserCredentials = {
    username: "jaumecuadrada",
    password: "jaumecuadrada1234",
  };

  describe("When it recieves a request with username 'jaumecuadrada' and password 'jaumecuadrada1234' that does not exist in the database", () => {
    test("Then it should call its net method with a custom error", async () => {
      const expectedError = loginUserErrors.userNotFound;
      const expectedStatus = clientError.unauthorized;

      const response = await request(app)
        .post(loginUrl)
        .send(mockUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty(
        "error",
        expectedError.publicMessage
      );
    });
  });
});
