describe('Authentication Flow', () => {
  it('allows user to register and login', () => {
    const email = `test+${Date.now()}@example.com`
    const password = 'Test1234'

    cy.visit('/auth/register')
    cy.get('input[name="name"]').type('Test User')
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type(password)
    cy.get('button[type="submit"]').click()

    cy.url().should('eq', 'http://localhost:3000/')
    cy.contains('Dashboard').should('be.visible')
  })

  it('logs out successfully', () => {
    cy.login('test@example.com', 'Test1234')
    cy.visit('/')
    cy.get('button').contains('Logout').click()
    cy.contains('Sign In').should('be.visible')
  })
})
