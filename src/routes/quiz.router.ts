import router from "express";
import { authMiddleware } from "../middlewares/authJwt";
import { deleteTest, getAllTests, getOneTest, saveTest } from "../controllers/test.controller";

const quizRouter = router();

quizRouter.get('/', authMiddleware, getAllTests)
quizRouter.post("/:id/save", authMiddleware, saveTest);
quizRouter.get("/:id", authMiddleware, getOneTest);
quizRouter.delete("/:id", authMiddleware, deleteTest);


export default quizRouter;
