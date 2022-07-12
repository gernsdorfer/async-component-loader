describe('component store', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('App', () => {

    it('should not exists my-app-counter component', () => {
      cy.get('my-app-counter').should('not.exist');
    });

    it('should exists my-app-counter component', () => {
      cy.get('.button-load-counter').click();
      cy.get('my-app-counter').should('exist');
    });

    it('should increment count', () => {
      cy.get('.button-load-counter').click();
      cy.get('my-app-counter .increment').click();

      cy.get('.counter').should('have.text','1');
    });
  });
});
