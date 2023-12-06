export function generateRandomString (length: number): string {
  let result: string = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

export function multiSelect (element: Cypress.Chainable<JQuery<HTMLElement>>, options: string[], exitClickElement: Cypress.Chainable<JQuery<HTMLElement>>): void {
  element.click().then($el => {
    options.forEach(i => {
      cy.wrap($el).contains(i).click()
    })
    exitClickElement.click({ force: true })
  })
}
