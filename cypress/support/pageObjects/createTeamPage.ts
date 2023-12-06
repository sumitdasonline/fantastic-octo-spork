import { multiSelect } from '../utils'
import { AdminPage } from './adminPage'

export class CreateTeamPage extends AdminPage {
  createTeamBy: Cypress.Chainable[]
  constructor () {
    super()
    this.visit()
    this.createTeamBy = this.createResource('Create a team')
  }

  visit (): void {
    cy.visit('admin/teams')
  }

  openCreateTeamFormBy (index: number): CreateTeamForm {
    this.createTeamBy[index].click()
    return new CreateTeamForm()
  }
}

export class CreateTeamForm {
  teamNameInput = cy.get("[data-test='create-team-name']")
  teamMembersDropdown = cy.get("[data-test='create-team-members']")
  channelDropdown = cy.get("[data-test='create-team-channels']")
  createTeamButton = cy.get('button').contains('Create team')
  modal = cy.get("[data-test='t-modal']")

  enterTeamName (name: string): void {
    this.teamNameInput.clear().type(name)
  }

  addTeamMembers (names: string[]): void {
    multiSelect(this.teamMembersDropdown, names, this.modal)
  }

  addChannels (channels: string[]): void {
    multiSelect(this.channelDropdown, channels, this.modal)
  }

  createTeam (): void {
    cy.intercept('POST', 'api/v2/teams').as('createdTeam')
    this.createTeamButton.click()
    cy.wait('@createdTeam').then(({ response }) => {
      expect(response?.statusCode).to.equal(201)
    })
  }
}
