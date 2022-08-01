import { recommendationRepository } from "../repositories/recommendationRepository.js";
import { createRecommendationWithScoreData } from "../controllers/e2eTestController.js";

async function deleteAll() {
  await recommendationRepository.deleteAll();
}

async function createMany(data: createRecommendationWithScoreData[]) {
  await recommendationRepository.createMany(data);
}

export const e2eTestService = {
  deleteAll,
  createMany
};
