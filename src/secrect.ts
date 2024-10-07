import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { config } from "dotenv";
config();

// server port ---***
const serverPort = process.env.SERVER_PORT;

// Database props ---***
const supersight_db_host = process.env.SUPERSIGHT_DB_HOST || "localhost";
const supersight_db_v1 = process.env.SUPERSIGHT_DB_V1;
const supersight_db_password_v1 = process.env.SUPERSIGHT_DB_PASSWORD_V1;

// AWS props ---***
const awsClientId: string = process.env.AWS_CLIENT_ID!;
const awsClientProvider = new CognitoIdentityProviderClient({
  region: process.env.AWS_CLIENT_REGION,
});
const awsCognitoJwtVerifier = CognitoJwtVerifier.create({
  userPoolId: "eu-north-1_jfeOn0x4A",
  tokenUse: "access",
  clientId: awsClientId,
});

export {
  serverPort,
  supersight_db_host,
  supersight_db_v1,
  supersight_db_password_v1,
  awsClientProvider,
  awsClientId,
  awsCognitoJwtVerifier,
};
