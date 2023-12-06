export class AdminPage {
  createResource (buttonText: string): Cypress.Chainable[] {
    return [
      cy.get('div#settings-primary.col-xs').find('i'),
      cy.get('div.row-col').find('button').contains(buttonText)
    ]
  }
}
