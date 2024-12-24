import router from "express";
import { authMiddleware } from "../middlewares/authJwt";
import { addPatient, deletePatient, getMyInfos, getPatient, getPatients, updatePatient } from "../controllers/user.controller";

const userRouter = router();

userRouter.get("/getMyInfos", authMiddleware, getMyInfos);
userRouter.get("/patients", authMiddleware, getPatients);
userRouter.post("/patients", authMiddleware, addPatient);
userRouter.get("/patients/:id", authMiddleware, getPatient);
userRouter.put("/patients/:id", authMiddleware, updatePatient);
userRouter.delete("/patients/:id", authMiddleware, deletePatient);


export default userRouter;
