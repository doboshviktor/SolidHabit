describe('SolidHabit', () => {
    it('Main page loading', () => {
        cy.visit('http://localhost:5173');
        cy.get('body').should('be.visible');
    });
});