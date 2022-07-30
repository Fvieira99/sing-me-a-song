import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { jest } from "@jest/globals";

describe("Recommendation service unit tests", () => {
  it("Should create recommendation", async () => {
    const recommendation = {
      name: "Testing - Testing",
      youtubeLink: "https://www.youtube.com/watch?v=Z6d3BofQqN0"
    };

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {});

    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce((): any => {});

    await recommendationService.insert(recommendation);
    expect(recommendationRepository.create).toBeCalled();
  });

  it("Should not create recommendation", async () => {
    const recommendation = {
      name: "Testing - Testing",
      youtubeLink: "https://www.youtube.com/watch?v=Z6d3BofQqN0"
    };

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          name: recommendation.name,
          youtubeLink: recommendation.youtubeLink,
          score: 0
        };
      });
    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce((): any => {});

    const promise = recommendationService.insert(recommendation);
    expect(promise).rejects.toEqual({
      message: "Recommendations names must be unique",
      type: "conflict"
    });
  });

  it("Should upvote recommendation", async () => {
    const recommendation = {
      id: 1,
      name: "Testing - Testing",
      youtubeLink: "https://www.youtube.com/watch?v=Z6d3BofQqN0"
    };

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return {
          id: recommendation.id,
          name: recommendation.name,
          youtubeLink: recommendation.youtubeLink,
          score: 0
        };
      });
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {});

    await recommendationService.upvote(recommendation.id);
    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("Should not upvote recommendation - nonexisting id", () => {
    const recommendationId = 1;
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {});

    const promise = recommendationService.upvote(recommendationId);
    expect(promise).rejects.toEqual({ type: "not_found", message: "" });
  });

  it("Should downvote recommendation", async () => {
    const recommendation = {
      id: 1,
      name: "Testing - Testing",
      youtubeLink: "https://www.youtube.com/watch?v=Z6d3BofQqN0"
    };

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return {
          id: recommendation.id,
          name: recommendation.name,
          youtubeLink: recommendation.youtubeLink,
          score: 0
        };
      });

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return {
          id: recommendation.id,
          name: recommendation.name,
          youtubeLink: recommendation.youtubeLink,
          score: -1
        };
      });

    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});

    await recommendationService.downvote(recommendation.id);
    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).not.toBeCalled();
  });

  it("Should delete recommendation if score is lower than 5", async () => {
    const recommendation = {
      id: 1,
      name: "Testing - Testing",
      youtubeLink: "https://www.youtube.com/watch?v=Z6d3BofQqN0"
    };

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return {
          id: recommendation.id,
          name: recommendation.name,
          youtubeLink: recommendation.youtubeLink,
          score: 0
        };
      });

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return {
          id: recommendation.id,
          name: recommendation.name,
          youtubeLink: recommendation.youtubeLink,
          score: -6
        };
      });
    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});

    await recommendationService.downvote(recommendation.id);
    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).toBeCalled();
  });

  it("Should call findAll function on get()", async () => {
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {});

    await recommendationService.get();
    expect(recommendationRepository.findAll).toBeCalled();
  });

  it("Should return random < 0,7 recommendation", async () => {
    jest.spyOn(Math, "random").mockImplementationOnce((): any => {
      return 0.5;
    });

    jest
      .spyOn(recommendationRepository, "findAll")
      .mockClear()
      .mockImplementationOnce((): any => {
        return [
          { id: 1, name: "test1", youtubeLink: "fake", score: 11 },
          { id: 2, name: "test2", youtubeLink: "fake2", score: 12 }
        ];
      });

    const recommentadion = await recommendationService.getRandom();
    expect(recommentadion.score).toBeGreaterThan(10);
    expect(recommendationRepository.findAll).toBeCalledTimes(1);
  });

  it("Should return random > 0,7 recommendation", async () => {
    jest.spyOn(Math, "random").mockImplementationOnce((): any => {
      return 0.8;
    });

    jest
      .spyOn(recommendationRepository, "findAll")
      .mockClear()
      .mockImplementationOnce((): any => {
        return [
          { id: 1, name: "test1", youtubeLink: "fake", score: 5 },
          { id: 2, name: "test2", youtubeLink: "fake2", score: 2 }
        ];
      });

    const recommentadion = await recommendationService.getRandom();
    expect(recommentadion.score).toBeLessThanOrEqual(10);
    expect(recommendationRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it("Should call findAll again if score filter doesn't match any recommendation score", async () => {
    jest.spyOn(Math, "random").mockImplementationOnce((): any => {
      return 0.8;
    });
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockClear()
      .mockImplementationOnce((): any => {
        return [];
      })
      .mockImplementationOnce((): any => {
        return [
          { id: 1, name: "test1", youtubeLink: "fake", score: 11 },
          { id: 2, name: "test2", youtubeLink: "fake2", score: 12 }
        ];
      });

    const recommendation = await recommendationService.getRandom();
    expect(recommendation.score).toBeGreaterThan(10);
    expect(recommendationRepository.findAll).toBeCalledTimes(2);
  });

  it("Should return not found error if there are no recommendations to find", async () => {
    jest.spyOn(Math, "random").mockImplementationOnce((): any => {
      return 0.8;
    });
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockClear()
      .mockImplementationOnce((): any => {
        return [];
      })
      .mockImplementationOnce((): any => {
        return [];
      });

    const promise = recommendationService.getRandom();
    expect(promise).rejects.toEqual({ type: "not_found", message: "" });
  });

  it("Should return a number of recommendations by DESC order based on amout parameter", async () => {
    const amount = 2;
    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockImplementationOnce((): any => {
        return [
          { id: 1, name: "test1", youtubeLink: "fake", score: 12 },
          { id: 2, name: "test2", youtubeLink: "fake2", score: 11 }
        ];
      });

    const recommendations = await recommendationService.getTop(amount);
    expect(recommendations[0].score).toBeGreaterThan(recommendations[1].score);
  });
});
