import { Request, Response } from "express";
import { e2eTestService } from "../services/e2eTestService.js";
import { Recommendation } from "@prisma/client";

export type createRecommendationWithScoreData = Omit<Recommendation, "id">;

async function deleteAll(req: Request, res: Response) {
  await e2eTestService.deleteAll();
  res.sendStatus(204);
}

async function createMany(req: Request, res: Response) {
  const data: createRecommendationWithScoreData[] = req.body;
  await e2eTestService.createMany(data);
  res.sendStatus(201);
}

export const e2eTestController = {
  deleteAll,
  createMany
};
