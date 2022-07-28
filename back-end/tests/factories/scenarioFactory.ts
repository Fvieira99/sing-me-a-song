import { prisma } from "../../src/database.js";
import * as recommendationFactory from "./recommendationFactory.js";

export async function createThreeRecommendations() {
  const recommendation1 = recommendationFactory.createRecommendationData();
  const recommendation2 = recommendationFactory.createRecommendationData();
  const recommendation3 = recommendationFactory.createRecommendationData();

  const data = [recommendation1, recommendation2, recommendation3];

  await recommendationFactory.createManyRecommendations(data);
}

export async function createDataAndInsertOneRecommendation() {
  const recommendationData = recommendationFactory.createRecommendationData();

  const recommendation = await recommendationFactory.createRecommendation(
    recommendationData
  );

  return recommendation;
}

export async function createTenRecommendationsWithRandomScores() {
  const recommendations = generateTenRandomRecommendations();
  await prisma.recommendation.createMany({ data: recommendations });
}

function generateRandomScore() {
  const max = 20;
  const min = -5;

  return Math.floor(Math.random() * (max - min) + min);
}

function generateTenRandomRecommendations() {
  const recommendationsArr = [];

  for (let i = 0; i < 10; i++) {
    const randomScore = generateRandomScore();
    const recommendtionData =
      recommendationFactory.createRecommendationDataWithScore(
        undefined,
        undefined,
        randomScore
      );
    recommendationsArr.push(recommendtionData);
  }

  return recommendationsArr;
}
