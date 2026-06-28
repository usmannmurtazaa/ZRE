import './commands'
import 'cypress-axe'
import '@testing-library/cypress/add-commands'

// Add custom command for login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/login')
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('not.include', '/auth/login')
})

// Add custom command for accessibility check
Cypress.Commands.add('checkA11y', () => {
  cy.injectAxe()
  cy.configureAxe({
    rules: {
      'color-contrast': { enabled: true },
      'aria-valid-attr': { enabled: true },
      'focusable-content': { enabled: true },
    },
  })
  cy.checkA11y()
})

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      checkA11y(): Chainable<void>
    }
  }
}
