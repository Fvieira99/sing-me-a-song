import { Router } from "express";
import { e2eTestController } from "../controllers/e2eTestController.js";

const e2eRouter = Router();

e2eRouter.delete("/recommendations/reset", e2eTestController.deleteAll);
e2eRouter.post("/recommendations/createMany", e2eTestController.createMany);

export default e2eRouter;
