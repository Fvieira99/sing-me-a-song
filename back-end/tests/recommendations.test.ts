import { prisma } from "../src/database.js";
import supertest from "supertest";
import app from "../src/app.js";
import * as recommendationFactory from "./factories/recommendationFactory.js";
import * as scenarioFactory from "./factories/scenarioFactory.js";

const agent = supertest(app);

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
});

describe("Recommendations test suit", () => {
  it("Should create new recommendation and return it", async () => {
    const recommendation = recommendationFactory.createRecommendationData();

    const response = await agent.post("/recommendations").send(recommendation);

    expect(response.statusCode).toBe(201);

    const createdRecommendation =
      await recommendationFactory.findOneRecommendation(recommendation.name);

    expect(createdRecommendation).not.toBeNull();
  });

  it("Should upvote recommendation", async () => {
    const recommendationData = recommendationFactory.createRecommendationData();

    const recommendation = await recommendationFactory.createRecommendation(
      recommendationData
    );

    const response = await agent.post(
      `/recommendations/${recommendation.id}/upvote`
    );

    expect(response.statusCode).toBe(200);

    const createdRecommendation =
      await recommendationFactory.findOneRecommendation(
        recommendationData.name
      );

    expect(createdRecommendation.score).toBe(1);
  });

  it("Should downvote recommendation", async () => {
    const recommendationData = recommendationFactory.createRecommendationData();

    const recommendation = await recommendationFactory.createRecommendation(
      recommendationData
    );

    const response = await agent.post(
      `/recommendations/${recommendation.id}/downvote`
    );

    expect(response.statusCode).toBe(200);

    const createdRecommendation =
      await recommendationFactory.findOneRecommendation(
        recommendationData.name
      );

    expect(createdRecommendation.score).toBe(-1);
  });

  it("Should return three recommendations", async () => {
    await scenarioFactory.createThreeRecommendations();

    const response = await agent.get("/recommendations");
    expect(response.body.length).toBe(3);
  });

  it("Should return one recommendation", async () => {
    await scenarioFactory.createThreeRecommendations();

    const recommendations = await prisma.recommendation.findMany();

    expect(recommendations.length).toBe(3);

    const response = await agent.get(
      `/recommendations/${recommendations[1].id}`
    );

    expect(response.body).not.toBeNull();
    expect(response.body.name).toBe(recommendations[1].name);
  });
});
