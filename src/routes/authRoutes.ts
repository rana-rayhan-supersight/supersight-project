import { Router } from "express";
const authRoutes = Router();

// POST: http://localhost:4000/api/v1/auth/register --- Register the user
authRoutes.post("/register");

export default authRoutes;
