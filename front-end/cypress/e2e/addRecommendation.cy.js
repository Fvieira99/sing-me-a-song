beforeEach(() => {
  cy.resetDatabase();
});

describe("POST /recommendations", () => {
  it("Should create new recommendation", () => {
    cy.createRecommendation();
  });
});
