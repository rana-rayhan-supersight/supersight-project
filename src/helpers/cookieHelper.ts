import { Response } from "express";

const setAccessTokenCookie = (res: Response, token: string) => {
  res.cookie("accessToken", token, {
    maxAge: 1 * 60 * 60 * 1000, // 1 hour in milliseconds
    httpOnly: true,
    //   secure: true,
    sameSite: "lax",
  });
};

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: true,
    //   secure: true,
    sameSite: "lax",
  });
};

export { setAccessTokenCookie, setRefreshTokenCookie };
