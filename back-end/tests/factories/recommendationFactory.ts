import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database.js";
import { CreateRecommendationData } from "../../src/services/recommendationsService.js";

export function createRecommendationData(
  name = faker.name.firstName() + " - " + faker.name.lastName(),
  youtubeLink = "https://www.youtube.com/watch?v=Z6d3BofQqN0"
) {
  return {
    name,
    youtubeLink
  };
}

export function createRecommendationDataWithScore(
  name = faker.name.firstName() + " - " + faker.name.lastName(),
  youtubeLink = "https://www.youtube.com/watch?v=Z6d3BofQqN0",
  score = 0
) {
  return {
    name,
    youtubeLink,
    score
  };
}

export async function createRecommendation(data: CreateRecommendationData) {
  return await prisma.recommendation.create({ data });
}

export async function createManyRecommendations(
  data: CreateRecommendationData[]
) {
  await prisma.recommendation.createMany({ data });
}

export async function findManyRecommendations() {
  return await prisma.recommendation.findMany();
}

export async function findOneRecommendation(name: string) {
  return await prisma.recommendation.findUnique({ where: { name } });
}

export async function updateScoreToMinusFive(id: number) {
  await prisma.recommendation.update({
    where: { id },
    data: { score: -5 }
  });
}
