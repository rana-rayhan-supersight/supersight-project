import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import { awsCognitoJwtVerifier } from "../secrect";
import { CustomRequest } from "../glogalTypes";

// login module
const isLoggedIn = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) throw createError(400, "Please log in or register first");

    const decoded = await awsCognitoJwtVerifier.verify(token);

    if (!decoded || typeof decoded === "string") {
      throw createError(400, "Invalid access token, please login again");
    }

    // Assuming your token has a 'sub' field representing the user ID
    req.userId = decoded.sub;
    next();
  } catch (error) {
    return next(error);
  }
};

// logout module
const isLoggedOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken, refreshToken } = req.cookies;

    if (accessToken) {
      const decoded = await awsCognitoJwtVerifier.verify(accessToken);
      if (decoded) {
        throw createError(400, "User is already logged in");
      }
    }

    // const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      throw createError(400, "User is already logged in");
    }

    next();
  } catch (error) {
    return next(error);
  }
};

// admin check module
// const isAdmin = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     if (!req.user || !req.user.isAdmin) {
//       throw createError(
//         403,
//         "Request forbidden. You must be an admin to access this resource"
//       );
//     }

//     next();
//   } catch (error) {
//     return next(error);
//   }
// };

export { isLoggedIn, isLoggedOut };
