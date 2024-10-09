import { Request, Response } from "express";
import { UserEntity } from "./entities/UserEntity";

interface CustomRequest extends Request {
  user?: UserEntity;
}

interface SignUpParams {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}
interface UserUpdateParams {
  firstName?: string;
  lastName?: string;
}
interface UserUpdateByAdminParams {
  firstName?: string;
  lastName?: string;
  newPassword?: string;
}
interface UpdatePasswordParams {
  currentPassword: string;
  newPassword: string;
}
interface LoginParams {
  email: string;
  password: string;
}

interface userVerificationParams {
  email: string;
  code: string;
}
