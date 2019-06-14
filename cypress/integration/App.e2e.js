describe('App E2E', () => {
  // it('should assert that true is equal to true', () => {
  //   expect(true).to.equal(true);
  // });
  // it('should assert that true is not equal to false', () => {
  //   expect(true).not.to.equal(false);
  // });
  it('should have a header', () => {
    cy.visit('/');
    
    cy.get('h1')
      .should('have.text', 'My Counter');
  });

  it('should increment and decrement the counter', () => {
    cy.visit('/');

    cy.get('p')
      .should('have.text', '0');

    cy.contains('Increment').click();
    cy.get('p')
      .should('have.text', '1');
    
      cy.contains('Increment').click();
    cy.get('p')
      .should('have.text', '2');
    
    cy.contains('Decrement').click();
    cy.get('p')
      .should('have.text', '1');
  });

});

