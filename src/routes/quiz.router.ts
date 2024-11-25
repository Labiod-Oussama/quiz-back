import router from "express";
import { authMiddleware } from "../middlewares/authJwt";
import { getAllTests, getOneTest, saveTest } from "../controllers/test.controller";

const quizRouter = router();

quizRouter.get('/', authMiddleware, getAllTests)
quizRouter.post("/:id/save", authMiddleware, saveTest);
quizRouter.get("/:id", authMiddleware, getOneTest);

export default quizRouter;
