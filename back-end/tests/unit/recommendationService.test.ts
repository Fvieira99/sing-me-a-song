import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { faker } from "@faker-js/faker";

// describe("Recommendation Service unit tests", () => {
//   it("Should return 409 if recommendation name already exists", () => {
//     jest
//       .spyOn(recommendationRepository, "findByName")
//       .mockImplementationOnce(async ("teste") => return {id: 1, name:"teste", youtubeLink:"https://www.youtube.com/watch?v=Z6d3BofQqN0", score: 0 })
//     const fakeRecommendation = {
//       name: "teste",
//       youtubeLink: "https://www.youtube.com/watch?v=Z6d3BofQqN0"
//     };
//   });
// });
