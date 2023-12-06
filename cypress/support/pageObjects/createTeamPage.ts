import { CyHttpMessages, Interception } from "cypress/types/net-stubbing"
import { multiSelect } from "../utils"
import { AdminPage } from "./adminPage"

export class CreateTeamPage extends AdminPage {
    createTeamBy: Cypress.Chainable[]
    constructor() {
        super()
        this.visit()
        this.createTeamBy = this.createResource("Create a team")
    }

    visit() {
        cy.visit("admin/teams")
    }

    openCreateTeamFormBy(index: number): CreateTeamForm {
        this.createTeamBy[index].click()
        return new CreateTeamForm()
    }
}

export class CreateTeamForm {
    teamNameInput = cy.get("[data-test='create-team-name']")
    teamMembersDropdown = cy.get("[data-test='create-team-members']")
    channelDropdown = cy.get("[data-test='create-team-channels']")
    createTeamButton = cy.get("button").contains("Create team")
    modal=cy.get("[data-test='t-modal']")

    enterTeamName(name: string) {
        this.teamNameInput.clear().type(name)
    }

    addTeamMembers(names: string[]) {
        multiSelect(this.teamMembersDropdown,names, this.modal)
    }
    
    addChannels(channels: string[]) {
        multiSelect(this.channelDropdown,channels, this.modal)
    }

    createTeam() {
        cy.intercept("POST","api/v2/teams").as("createdTeam")
        this.createTeamButton.click()
        cy.wait("@createdTeam").then(({response}) => {
            expect(response?.statusCode).to.equal(201)
        })
    }
}