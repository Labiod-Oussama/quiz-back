import router from "express";
import { signIn, signUp } from "../controllers/auth.controller";

const authRouter = router();

authRouter.post("/register", signUp);
authRouter.post("/login", signIn);

export default authRouter;
