describe('Lead Management', () => {
  before(() => {
    cy.login('agent@example.com', 'Test1234')
    cy.visit('/agent-dashboard/leads')
  })

  it('displays leads assigned to agent', () => {
    cy.contains('Leads').should('be.visible')
    cy.get('table').should('exist')
  })

  it('updates lead status', () => {
    cy.get('select').first().select('contacted')
    cy.contains('Status updated').should('be.visible')
  })

  it('adds a note to a lead', () => {
    cy.get('button').contains('View').first().click()
    cy.get('textarea[placeholder*="Add note"]').type('Test note')
    cy.get('button').contains('Add Note').click()
    cy.contains('Note added').should('be.visible')
  })
})
