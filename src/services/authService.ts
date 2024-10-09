import { Response } from "express";
import { awsClientId, awsClientProvider, userPoolId } from "../secrect";
import {
  AdminConfirmSignUpCommand,
  AdminDeleteUserCommand,
  AdminSetUserPasswordCommand,
  AuthFlowType,
  ChangePasswordCommand,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "../helpers/cookieHelper";
import AppDataSource from "../configs/data-source";
import { UserEntity } from "../entities/UserEntity";
import createError from "http-errors";
import {
  SignUpParams,
  UpdatePasswordParams,
  UserUpdateByAdminParams,
  UserUpdateParams,
} from "../glogalTypes";
import { findUserByEmail } from "../helpers/entityFindHelper";
import { UserRole } from "../entities/UserRole";

class AuthServices {
  // Static method to sign up a user via AWS Cognito
  static async signUp(signUpParams: SignUpParams) {
    const { firstName, lastName, email, password } = signUpParams;

    const userRepo = AppDataSource.getRepository(UserEntity);
    const isExist = await userRepo.exists({ where: { email } });
    if (isExist) throw createError(422, "User exist, please login!");

    const params = {
      ClientId: awsClientId,
      Username: email,
      Password: password,
      UserAttributes: [{ Name: "email", Value: email }],
    };

    // Execute the command using the AWS Cognito client
    const command = new SignUpCommand(params);
    // Execute the command using the AWS Cognito client
    const data = await awsClientProvider.send(command);

    const user = new UserEntity();
    user.id = data.UserSub || "";
    user.firstName = firstName || "";
    user.lastName = lastName || "";
    user.email = email;
    user.password = password;

    const savedUser = await userRepo.save(user);

    return { data, savedUser };
  }
  // Static method to login a user via AWS Cognito
  static async login(res: Response, email: string, password: string) {
    // Cognito authentication params
    const params = {
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: awsClientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };

    const command = new InitiateAuthCommand(params);
    const data = await awsClientProvider.send(command);
    //
    setAccessTokenCookie(res, data.AuthenticationResult?.AccessToken || "");
    setRefreshTokenCookie(res, data.AuthenticationResult?.RefreshToken || "");

    return data;
  }
  // Static method to verify a user via AWS Cognito
  static async verifyUser(email: string, code: string) {
    const userRepo = AppDataSource.getRepository(UserEntity);
    const user = await userRepo.findOne({ where: { email } });
    if (!user) throw createError(422, "User not exist, please register!");

    const params = {
      ClientId: awsClientId,
      Username: email,
      ConfirmationCode: code,
    };

    const command = new ConfirmSignUpCommand(params);
    const data = await awsClientProvider.send(command);

    user.confirmationStatus = true;
    const savedUser = await userRepo.save(user);

    return { data, savedUser };
  }
  // Static method to verify a user via AWS Cognito
  static async activeUserByAdmin(email: string) {
    const userRepo = AppDataSource.getRepository(UserEntity);
    const user = await userRepo.findOne({ where: { email } });
    if (!user) throw createError(422, "User not exist, please register!");

    const command = new AdminConfirmSignUpCommand({
      UserPoolId: userPoolId,
      Username: email,
    });
    const data = await awsClientProvider.send(command);

    user.confirmationStatus = true;
    const savedUser = await userRepo.save(user);

    return { data, savedUser };
  }
  // Static method to refresh access token if refresh token is valid
  static async refreshAuthToken(refreshToken: string) {
    const params = {
      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      ClientId: awsClientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    };
    const command = new InitiateAuthCommand(params);
    const data = await awsClientProvider.send(command);

    return data;
  }
  // PUT: update user
  static async updateUser(user: UserEntity, updateParams: UserUpdateParams) {
    const userRepo = AppDataSource.getRepository(UserEntity);
    const { firstName, lastName } = updateParams;

    // Update fields only if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    // Save the updated user
    const updatedUser = await userRepo.save(user);
    return updatedUser;
  }
  // PUT: update user password
  static async updateUserPassword(
    user: UserEntity,
    accessToken: string,
    updateParams: UpdatePasswordParams
  ) {
    const { currentPassword, newPassword } = updateParams;
    try {
      const command = new ChangePasswordCommand({
        AccessToken: accessToken,
        PreviousPassword: currentPassword,
        ProposedPassword: newPassword,
      });

      await awsClientProvider.send(command);
      // Update fields only if provided
    } catch (error) {
      throw createError(400, "Failed to change password: " + error);
    }

    if (newPassword) user.password = newPassword;
    // Save the updated user
    const updated = await AppDataSource.getRepository(UserEntity).save(user);

    return updated;
  }
  // PUT: update user by admin -----****
  static async updateUserByAdmin(
    user: UserEntity,
    email: string,
    updateParams: UserUpdateByAdminParams
  ) {
    const userToUpdate = await findUserByEmail(email);
    const userRepo = AppDataSource.getRepository(UserEntity);
    const { firstName, lastName, newPassword } = updateParams;

    if (user.role !== UserRole.ADMIN)
      throw createError(403, "Only admin can update!");
    // If the user is an admin
    try {
      // Admin can change another user's password without needing their access token
      const command = new AdminSetUserPasswordCommand({
        UserPoolId: process.env.USER_POOL_ID,
        Username: email,
        Password: newPassword,
        Permanent: true,
      });

      await awsClientProvider.send(command);

      // Update fields only if provided
      if (firstName) userToUpdate.firstName = firstName;
      if (lastName) userToUpdate.lastName = lastName;

      // Save the updated user
      const updatedUser = await userRepo.save(user);
      return updatedUser;
    } catch (error) {
      throw createError(
        400,
        "Failed to change password for the user: " + error
      );
    }
  }
  // reset user password
  static async resetUserPassword(email: string) {
    await findUserByEmail(email);
    console.log("---------------------");
    const command = new ForgotPasswordCommand({
      ClientId: awsClientId,
      Username: email,
    });
    const response = await awsClientProvider.send(command);

    return response;
  }
  // update user password with reset code
  static async confirmForgotPassword(
    email: string,
    code: string,
    newPassword: string
  ) {
    const user = await findUserByEmail(email);

    const command = new ConfirmForgotPasswordCommand({
      ClientId: awsClientId,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
    });

    user.password = newPassword;
    await AppDataSource.getRepository(UserEntity).save(user);

    const response = await awsClientProvider.send(command);

    return response;
  }
  // delete user by useremail
  static async deleteUserByEmail(user: UserEntity, email: string) {
    const isExist = await AppDataSource.getRepository(UserEntity).exists({
      where: { email },
    });
    if (!isExist) throw createError(404, "User not found or User is deleted!");

    // Check if the user is allowed to delete
    if (user.role !== UserRole.ADMIN) {
      throw createError(
        403,
        "Only the user or an Admin can delete the entity!"
      );
    }
    const command = new AdminDeleteUserCommand({
      UserPoolId: userPoolId,
      Username: email,
    });

    try {
      const response = await awsClientProvider.send(command);
      await AppDataSource.getRepository(UserEntity).delete({ email });
      return response;
    } catch (error) {
      throw createError(500, "Failed to delete user: " + error);
    }
  }
}

export default AuthServices;
