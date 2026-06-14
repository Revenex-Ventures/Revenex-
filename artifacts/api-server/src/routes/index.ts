import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import reviewsRouter from "./reviews";
import contactRouter from "./contact";
import demoRouter from "./demo";
import chatRouter from "./chat";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(reviewsRouter);
router.use(contactRouter);
router.use(demoRouter);
router.use(chatRouter);
router.use(adminRouter);

export default router;
