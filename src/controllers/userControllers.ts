import { Request, Response, NextFunction } from "express";
import { successResponse } from "./responseController";
import UserService from "../services/userService";
import { CustomRequest, UserUpdateParams } from "../glogalTypes";
import createHttpError from "http-errors";
import AuthServices from "../services/authService";

// GET: http://localhost:4000/api/v1/user/list --- get users list
const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get query parameters
    const users = await UserService.getUsers(req);

    return successResponse(res, {
      statusCode: 200,
      message: "Users fetched successfully",
      payload: {
        count: users.length,
        users,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export { getUsers };
