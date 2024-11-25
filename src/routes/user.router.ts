import router from "express";
import { authMiddleware } from "../middlewares/authJwt";
import { addPatient, getMyInfos, getPatients } from "../controllers/user.controller";

const userRouter = router();

userRouter.get("/getMyInfos", authMiddleware, getMyInfos);
userRouter.get("/patients", authMiddleware, getPatients);
userRouter.post("/patients", authMiddleware, addPatient);

export default userRouter;
