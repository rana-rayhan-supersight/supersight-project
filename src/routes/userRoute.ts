import { Router } from "express";
const userRoute = Router();

// GET: http://localhost:4000/api/v1/users --- get users list
userRoute.get("/");

// exporting user route
export default userRoute;
