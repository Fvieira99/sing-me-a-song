import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database.js";

interface RecommendationData {
  name: string;
  youtubeLink: string;
}

export function createRecommendationData(
  youtubeLink = "https://www.youtube.com/watch?v=Z6d3BofQqN0"
) {
  return {
    name: faker.name.findName(undefined, "-", undefined),
    youtubeLink
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
