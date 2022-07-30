import { Router } from "express";
import { e2eTestController } from "../controllers/e2eTestController.js";

const e2eRouter = Router();

e2eRouter.delete("/recommendations/reset", e2eTestController.deleteAll);

export default e2eRouter;
