describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('loads the home page', () => {
    cy.contains('Secure Your Future with Legally Approved Properties').should('be.visible')
    cy.get('input[placeholder*="Search properties"]').should('be.visible')
  })

  it('navigates to properties page via search', () => {
    cy.get('input[placeholder*="Search properties"]').type('Mehran{enter}')
    cy.url().should('include', '/properties?search=Mehran')
  })

  it('displays trust banner stats', () => {
    cy.contains('25+').should('be.visible')
    cy.contains('500+').should('be.visible')
  })

  it('links to property detail when clicking a property card', () => {
    cy.get('[data-testid="property-card"]').first().click()
    cy.url().should('include', '/properties/')
  })

  it('has no accessibility violations', () => {
    cy.checkA11y()
  })
})
