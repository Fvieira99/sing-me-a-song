import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database.js";

interface RecommendationData {
  name: string;
  youtubeLink: string;
}

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

export async function createRecommendation(data: RecommendationData) {
  return await prisma.recommendation.create({ data });
}

export async function createManyRecommendations(data: RecommendationData[]) {
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
