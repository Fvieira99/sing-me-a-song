/// <reference types="cypress" />

beforeEach(() => {
  cy.resetDatabase();
  cy.createRecommendation();
});

describe("POST /recommendations/:id/upvote", () => {
  it("Should upvote recommendation", () => {
    cy.get("#upvote-icon").click();
  });
});
