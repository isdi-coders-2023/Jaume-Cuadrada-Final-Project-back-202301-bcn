import { type JwtPayload } from "jsonwebtoken";

export interface UserCredentials {
  username: string;
  password: string;
}

export interface CustomJwtPayload extends JwtPayload {
  username: string;
  sub: string;
}
