import { Router } from "express";
import { getUsers } from "../controllers/userControllers";
const userRoute = Router();

// GET: http://localhost:4000/api/v1/user/list --- get users list
userRoute.get("/list", getUsers);

// exporting user route
export default userRoute;
