describe("GET /recommendations/top/:amount", () => {
  it("Should return top recommendation", () => {
    cy.visit("");

    cy.get("#top").click();
    cy.url().should("equal", "http://localhost:3000/top");
  });
});
