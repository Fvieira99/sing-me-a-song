beforeEach(() => {
  cy.resetDatabase();
  cy.createRecommendation();
});

describe("POST /recommendations/:id/downvote", () => {
  it("Should downvote recommendation", () => {
    cy.get("#downvote-icon").click();
  });

  it("Should delete recommendation if score is lower than five", () => {
    cy.get("#downvote-icon").click().click().click().click().click().click();
  });
});
