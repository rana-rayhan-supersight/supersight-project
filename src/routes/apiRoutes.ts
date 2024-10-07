import { Router } from "express";
import authRoutes from "./authRoute";
import userRoute from "./userRoute";

const apiRoutes = Router();

//  http://localhost:4000/api/v1/auth ---***
apiRoutes.use("/auth", authRoutes);

//  http://localhost:4000/api/v1/user ---***
apiRoutes.use("/user", userRoute);

export default apiRoutes;
