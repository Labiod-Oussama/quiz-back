import router, {
    type Request,
    type Response,
    type NextFunction,
} from "express";

import authRouter from "./auth.router";
import userRouter from "./user.router";
import quizRouter from "./quiz.router";

const apiRouter = router();

apiRouter.use("/user", userRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/quiz", quizRouter);


apiRouter.all(
    "*",
    (request: Request, response: Response, errorHandler: NextFunction) => {
        errorHandler(new Error("Page not found"));
    }
);

export default apiRouter;
