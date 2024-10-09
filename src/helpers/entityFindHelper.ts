import createHttpError from "http-errors";
import AppDataSource from "../configs/data-source";
import { UserEntity } from "../entities/UserEntity";

const findUserById = async (id: string) => {
  if (!id) throw createHttpError(404, "User id is missisng!");

  const userRepo = AppDataSource.getRepository(UserEntity);
  const user = await userRepo.findOne({ where: { id } });
  if (!user) throw createHttpError(404, "User not found by id!");

  return user;
};

const findUserByEmail = async (email: string) => {
  if (!email) throw createHttpError(404, "User email is missisng!");

  const userRepo = AppDataSource.getRepository(UserEntity);
  const user = await userRepo.findOne({ where: { email } });
  if (!user) throw createHttpError(404, "User not found by email!");

  return user;
};

export { findUserById, findUserByEmail };
