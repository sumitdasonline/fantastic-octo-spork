import { AdminPage } from "./adminPage"

export class CustomChannelCreationPage extends AdminPage {
    channelCreationBy: Cypress.Chainable[]
    channelType: ChannelType | undefined

    constructor(channelName: Channel) {
        super()
        this.channelType = ChannelTypes.find(a => a.name == channelName)
        if (this.channelType == undefined) {
            throw new Error("Channel type incorrect.")
        }
        this.visit()
        this.channelCreationBy = this.createResource(`Connect ${this.channelType.name}`)
    }
    
    visit() {
        cy.visit(`admin/channels2/${this.channelType?.url}`)
    }

    newCustomChannel(button: Cypress.Chainable): CustomChannelCreationForm {
        button.click()
        return new CustomChannelCreationForm()
    }
}

export interface CreatedChannel {
    id: string,
    username: string
}

export enum Channel {
    CUSTOM_CHANNEL = "Custom channel"
}

export interface ChannelType {
    name: Channel
    url: string
}

export const ChannelTypes: ChannelType[] = [
    { name: Channel.CUSTOM_CHANNEL, url: "custom" }
]

export class CustomChannelCreationForm {
    internalNameLabel = cy.get("label").contains("Internal name")
    internalNameInput = this.internalNameLabel.siblings("div").find("input")
    createChannelButton = cy.get("button").contains("Create channel")


    enterInternalName(internalName: string) {
        cy.TestStep("Enter internal name").then(() => {
            this.internalNameInput.clear().type(internalName)
        })
    }

    clickCreateChannelButton(): Cypress.Chainable<CreatedChannel> {
        cy.intercept("POST", "api/v2/channels").as("createChannel")
        cy.TestStep("Create channel").then(() => {
            this.createChannelButton.click()
        })
        return cy.wait("@createChannel").then(({ response }) => {
            expect(response?.statusCode).to.equal(201)
            let id = response?.body.id
            let username = response?.body.username
            return {id: id, username: username}
          })
    }
}