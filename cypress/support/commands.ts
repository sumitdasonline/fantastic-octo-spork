/// <reference types="cypress" />
export { };
import 'cypress-mochawesome-reporter/register';


Cypress.Commands.add("TestStep", { prevSubject: "optional" }, (subject, stepDefinition) => {
    if (subject === undefined) {
        return cy.task('log', stepDefinition);
    }
    cy.task('log', stepDefinition);
    return cy.wrap(subject);
})


declare global {
    namespace Cypress {
        interface Chainable {
            TestStep(stepDefinition: string, options?: Partial<TypeOptions>
            ): Chainable<any>;
        }
    }
}