import { prisma } from "../../src/database.js";
import supertest from "supertest";
import app from "../../src/app.js";
import * as recommendationFactory from "../factories/recommendationFactory.js";
import * as scenarioFactory from "../factories/scenarioFactory.js";

const agent = supertest(app);

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
});

describe("POST /recommendations", () => {
  it("Should create new recommendation and return it", async () => {
    const recommendation = recommendationFactory.createRecommendationData();

    const response = await agent.post("/recommendations").send(recommendation);

    expect(response.statusCode).toBe(201);

    const createdRecommendation =
      await recommendationFactory.findOneRecommendation(recommendation.name);

    expect(createdRecommendation).not.toBeNull();
  });

  it("Should return 409 after trying to create recommendation with existing name", async () => {
    const sameName = "copy";
    const recommendation =
      recommendationFactory.createRecommendationData(sameName);
    await prisma.recommendation.create({ data: recommendation });

    const response = await agent.post(`/recommendations`).send(recommendation);

    expect(response.statusCode).toBe(409);
  });

  it("Should return 422 after trying to create recommendation with number on name property", async () => {
    const recommendation = {
      name: 10,
      youtubeLink: "https://www.youtube.com/watch?v=Z6d3BofQqN0"
    };
    const response = await agent.post(`/recommendations`).send(recommendation);

    expect(response.statusCode).toBe(422);
  });

  it("Should return 422 after trying to create recommendation with wrong youtube link", async () => {
    const recommendation = recommendationFactory.createRecommendationData(
      undefined,
      "https://www.instagram.com/"
    );
    const response = await agent.post(`/recommendations`).send(recommendation);

    expect(response.statusCode).toBe(422);
  });
});

describe("POST /recommendations/:id/upvote", () => {
  it("Should upvote recommendation", async () => {
    const recommendation =
      await scenarioFactory.createDataAndInsertOneRecommendation();

    const response = await agent.post(
      `/recommendations/${recommendation.id}/upvote`
    );

    expect(response.statusCode).toBe(200);

    const upvotedRecommendation =
      await recommendationFactory.findOneRecommendation(recommendation.name);

    expect(upvotedRecommendation.score).toBe(1);
  });

  it("Should return 404 after trying to upvote with nonexisting id", async () => {
    const recommendation =
      await scenarioFactory.createDataAndInsertOneRecommendation();

    const response = await agent.post(
      `/recommendations/${recommendation.id + 1}/upvote`
    );

    expect(response.statusCode).toBe(404);
  });
});

describe("POST /recommendations/:id/downvote", () => {
  it("Should downvote recommendation", async () => {
    const recommendation =
      await scenarioFactory.createDataAndInsertOneRecommendation();

    const response = await agent.post(
      `/recommendations/${recommendation.id}/downvote`
    );

    expect(response.statusCode).toBe(200);

    const downvotedRecommendation =
      await recommendationFactory.findOneRecommendation(recommendation.name);

    expect(downvotedRecommendation.score).toBe(-1);
  });

  it("Should return 404 after trying to downvote with nonexisting id", async () => {
    const recommendation =
      await scenarioFactory.createDataAndInsertOneRecommendation();

    const response = await agent.post(
      `/recommendations/${recommendation.id + 1}/downvote`
    );

    expect(response.statusCode).toBe(404);
  });

  it("Should delete recommendation with score < -5 after downvoting it", async () => {
    const recommendation =
      await scenarioFactory.createDataAndInsertOneRecommendation();

    await recommendationFactory.updateScoreToMinusFive(recommendation.id);

    const response = await agent.post(
      `/recommendations/${recommendation.id}/downvote`
    );

    expect(response.statusCode).toBe(200);

    const deletedRecommendation = await prisma.recommendation.findUnique({
      where: { id: recommendation.id }
    });
    expect(deletedRecommendation).toBeNull();
  });
});

describe("GET /recommendations", () => {
  it("Should return three recommendations", async () => {
    await scenarioFactory.createThreeRecommendations();

    const response = await agent.get("/recommendations");
    expect(response.body.length).toBe(3);
  });
});

describe("GET /recommendations/:id", () => {
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

  it("Should return 404 if passing nonexisting id", async () => {
    await scenarioFactory.createThreeRecommendations();

    const nonexistingId = 4;

    const response = await agent.get(`/recommendations/${nonexistingId}`);
    expect(response.statusCode).toBe(404);
  });
});

describe("GET /recommendations/random", () => {
  it("Should return one random recommendation", async () => {
    await scenarioFactory.createTenRecommendationsWithRandomScores();
    const createdRecommendations = await prisma.recommendation.findMany();
    expect(createdRecommendations.length).toBe(10);

    const response = await agent.get("/recommendations/random");
    expect(response.body).not.toBeNull();
  });
});

describe("GET /recommendations/top/:amount", () => {
  it("Should return 10 recommendations by score DESC", async () => {
    await scenarioFactory.createTenRecommendationsWithRandomScores();
    const amount = 10;
    const response = await agent.get(`/recommendations/top/${amount}`);
    console.log(response.body);
    expect(response.body.length).toBe(10);
    expect(response.body[0].score).toBeGreaterThanOrEqual(
      response.body[1].score
    );
  });
});

afterAll(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
  prisma.$disconnect();
});
