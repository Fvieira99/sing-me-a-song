import { recommendationRepository } from "../repositories/recommendationRepository.js";

async function deleteAll() {
  await recommendationRepository.deleteAll();
}

export const e2eTestService = {
  deleteAll
};
