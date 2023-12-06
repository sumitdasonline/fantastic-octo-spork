import { generateRandomString } from "./utils"
import { loginEmail, loginPassword } from "../constants"

export class TrengoAPI {
    authorization: string | undefined
    constructor() {
        Cypress.env
        if (loginEmail == "" || loginPassword == "") {
            throw new Error("Please enter a valid username and password into .env file")
        } else {
            const body = {
                "email": loginEmail,
                "password": loginPassword,
                "remember": 1
            }
            cy.request("POST", "/auth/login", body)
            cy.request("/client-api/me/token").then((response) => {
                if (response.status == 200) {
                    const token = response.body.access_token
                    this.authorization = `Bearer ${token}`
                    // cy.wrap(token).as("token")
                }
            })
        }
    }

    customChannelMessage(username: string, name: string, message: string) {
        if (this.authorization == undefined) {
            new TrengoAPI()
        }
        const identifier = generateRandomString(13)
        const reqBody = {
            "contact": {
                "name": name,
                "email": "fasinib966@bustayes.com",
                "identifier": `custom-${identifier}`
            },
            "body": {
                "text": message
            },
            "attachments": {
                "*": {
                    "url": "string",
                    "name": "string"
                }
            },
            "channel": username
        }
        const options = {
            method: "POST",
            headers: {
                Authorization: this.authorization,
            },
            url: "api/v2/custom_channel_messages",
            body: reqBody
        }
        cy.request(options)
    }

    deleteResource(resourceName: string, resourceId: string) {
        const options = {
            method: "DELETE",
            url: `api/v2/${resourceName}/${resourceId}`,
            headers: {
                Authorization: this.authorization,
            }
        };
        cy.request(options)
    }

}