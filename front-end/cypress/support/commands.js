/// <reference types="cypress" />
import { faker } from "@faker-js/faker";
const URL = "http://localhost:4000/recommendations";
const NUMBER_OF_RECOMMENDATIONS = 10;
const MIN_SCORE = -5;
const MAX_SCORE = 15;

Cypress.Commands.add("resetDatabase", () => {
  cy.request("DELETE", `${URL}/reset`).as("reset");
});

Cypress.Commands.add("createRecommendation", () => {
  const recommendationData = {
    name: faker.name.firstName() + " - " + faker.name.lastName(),
    youtubeLink:
      "https://www.youtube.com/watch?v=Z6d3BofQqN0&list=RDGMEMHDXYb1_DDSgDsobPsOFxpAVMZ6d3BofQqN0&start_radio=1"
  };
  cy.visit("");
  cy.get("#name-input").type(recommendationData.name);
  cy.get("#youtube-link-input").type(recommendationData.youtubeLink);

  cy.intercept("POST", "/recommendations").as("addRecommendation");
  cy.get("#add-recommendation-button").click();
  cy.wait("@addRecommendation");
});

Cypress.Commands.add("createManyRecommendations", () => {
  const arr = [];
  for (let i = 0; i < NUMBER_OF_RECOMMENDATIONS; i++) {
    const recommendation = {
      name: faker.name.firstName() + " - " + faker.name.lastName(),
      youtubeLink:
        "https://www.youtube.com/watch?v=Z6d3BofQqN0&list=RDGMEMHDXYb1_DDSgDsobPsOFxpAVMZ6d3BofQqN0&start_radio=1",
      score: Math.floor(Math.random() * (MAX_SCORE - MIN_SCORE) + MIN_SCORE)
    };
    arr.push(recommendation);
  }

  cy.request("POST", `${URL}/createmany`, arr).as("createmany");
});
