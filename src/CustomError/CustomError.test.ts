import { CustomError } from "./CustomError";

describe("Given a CustomError class", () => {
  describe("When a new error is instanced", () => {
    test("Then it should create a new error with property message", () => {
      const newError = new CustomError(
        "Connection error",
        500,
        "connection error"
      );

      const expectedProperty = "message";
      expect(newError).toHaveProperty(expectedProperty);
    });
  });
});
