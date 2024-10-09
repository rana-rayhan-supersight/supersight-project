import { Request } from "express";
import AppDataSource from "../configs/data-source";
import { UserEntity } from "../entities/UserEntity";
import { Like } from "typeorm";
import { findUserByEmail } from "../helpers/entityFindHelper";
import { UserUpdateParams } from "../glogalTypes";
import {
  AdminSetUserPasswordCommand,
  ChangePasswordCommand,
  ForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { awsClientId, awsClientProvider, userPoolId } from "../secrect";

class UserService {
  // GET: get user list based on query or without query will return all users
  static async getUsers(req: Request) {
    const search = req.query.search ? String(req.query.search) : "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    // Repository for UserEntity
    const userRepo = AppDataSource.getRepository(UserEntity);

    // Define the search filter
    const whereCondition = search
      ? [
          { firstName: Like(`%${search}%`) },
          { lastName: Like(`%${search}%`) },
          { email: Like(`%${search}%`) },
        ]
      : [];

    // Combine conditions using an OR operator
    const users = await userRepo.find({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
      select: [
        "id",
        "firstName",
        "lastName",
        "email",
        "createdAt",
        "updatedAt",
        "role",
      ],
    });

    return users;
  }
}

export default UserService;
