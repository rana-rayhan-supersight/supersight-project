import { Response } from "express";
import { awsClientId, awsClientProvider } from "../secrect";
import {
  AuthFlowType,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "../helpers/cookieHelper";

class AuthServices {
  // Static method to sign up a user via AWS Cognito
  static async signUp(email: string, password: string) {
    const params = {
      ClientId: awsClientId, // Directly use awsClientId
      Username: email,
      Password: password,
      UserAttributes: [{ Name: "email", Value: email }],
    };

    const command = new SignUpCommand(params);
    // Execute the command using the AWS Cognito client
    const data = await awsClientProvider.send(command);
    return data;
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
    const params = {
      ClientId: awsClientId,
      Username: email,
      ConfirmationCode: code,
    };

    const command = new ConfirmSignUpCommand(params);
    const data = await awsClientProvider.send(command);

    return data;
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
}

export default AuthServices;
