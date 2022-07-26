import * as recommendationFactory from "./recommendationFactory.js";

export async function createThreeRecommendations() {
  const recommendation1 = recommendationFactory.createRecommendationData();
  const recommendation2 = recommendationFactory.createRecommendationData();
  const recommendation3 = recommendationFactory.createRecommendationData();

  const data = [recommendation1, recommendation2, recommendation3];

  await recommendationFactory.createManyRecommendations(data);
}
