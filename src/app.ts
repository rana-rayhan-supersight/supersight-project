import "reflect-metadata";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response, urlencoded } from "express";

import AppDataSource from "./configs/data-source";
import { UserEntity } from "./entities/UserEntity";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password }: { email: string; password: string } = req.body;

      const userRepo = AppDataSource.getRepository(UserEntity);
      const user = new UserEntity();
      user.email = email;
      user.password = password;

      const savedUser = await userRepo.save(user);

      res.status(201).json({
        message: "user created!",
        savedUser,
      });
    } catch (error) {
      res.json({ error });
      console.log(error);
    }
  }
);
//
//
//  http://localhost:4000/api/v1/auth/register --- Register the user
app.use("/api/v1/auth", authRoutes);

export default app;
