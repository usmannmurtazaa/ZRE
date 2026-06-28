describe('Properties Page', () => {
  beforeEach(() => {
    cy.visit('/properties')
  })

  it('loads property listings', () => {
    cy.get('[data-testid="property-card"]').should('have.length.at.least', 1)
  })

  it('filters by property type', () => {
    cy.contains('Residential').click()
    cy.wait(500)
    cy.get('[data-testid="property-card"]').should('exist')
  })

  it('applies price filter', () => {
    cy.get('input[placeholder*="Min Price"]').type('1000000')
    cy.get('input[placeholder*="Max Price"]').type('5000000')
    cy.contains('Apply Filters').click()
    cy.get('[data-testid="property-card"]').should('exist')
  })

  it('loads next page via pagination', () => {
    cy.get('button[aria-label*="next"]').click()
    cy.url().should('include', 'page=2')
  })

  it('has no accessibility violations', () => {
    cy.checkA11y()
  })
})
