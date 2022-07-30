describe("GET /recommendations/random", () => {
  it("Should return 1 random recommendation", () => {
    cy.visit("");

    cy.intercept("GET", "http://localhost:4000/recommendations/random").as(
      "getRandom"
    );
    cy.get("#random").click();
    cy.wait("@getRandom");

    cy.url().should("equal", "http://localhost:3000/random");
    cy.get("#recommendations").then($recommendations => {
      expect($recommendations).to.have.length(1);
    });
  });
});
