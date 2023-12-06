export class TicketsPage {
  constructor () {
    this.visit()
  }

  visit (): void {
    cy.intercept('GET', 'client-api/notifications/list').as('notificationsList')
    cy.visit('tickets')
    cy.wait('@notificationsList', { timeout: 20000 })
  }

  checkLastMessageText (text: string): void {
    cy.get('div#ticket-list').first().should('contain.text', text)
  }
}
