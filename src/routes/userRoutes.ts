import { Router } from "express";
const userRouter = Router();

// GET: http://localhost:4000/api/v1/users --- get users list
userRouter.get("/");

export default userRouter;
