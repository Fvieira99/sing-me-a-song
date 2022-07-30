import { Request, Response } from "express";
import { e2eTestService } from "../services/e2eTestService.js";

async function deleteAll(req: Request, res: Response) {
  await e2eTestService.deleteAll();
  res.send(204);
}

export const e2eTestController = {
  deleteAll
};
