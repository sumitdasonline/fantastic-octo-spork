import 'cypress-if'
import { TrengoAPI } from '../support/api'
import { Channel, type CreatedChannel, CustomChannelCreationPage } from '../support/pageObjects/customChannelCreationPage'
import { TicketsPage } from '../support/pageObjects/ticketsPage'
import { generateRandomString } from '../support/utils'
import { CreateTeamPage } from '../support/pageObjects/createTeamPage'
import { type Interception } from 'cypress/types/net-stubbing'

describe('Trengo', () => {
  context('Create channel', () => {
    let trengoApi: TrengoAPI

    beforeEach('Login using API', () => {
      trengoApi = new TrengoAPI()
    })

    afterEach('Remove channel', () => {
      // Clean up after should be avoided as this is an antipattern.
      // Best practice is to use a clean account eveytime, so either create a new account everytime in Before hook
      // Or Delete all channels

      cy.get<CreatedChannel>('@createdChannel').if().then(({ id }) => {
        trengoApi.deleteResource('channels', id)
      })

      cy.get('@createdTeam').if().then(({ response }) => {
        trengoApi.deleteResource('teams', response.body.id)
      })
    })

    describe('Custom Channel tests', () => {
      // 0 for + button and 1 for the button with text
      [0, 1].forEach(i => {
        it('Create custom channel and triggeer a message', () => {
          cy.TestStep('Open custom channel creation form').then(() => {
            const customChannelPage = new CustomChannelCreationPage(Channel.CUSTOM_CHANNEL)
            const customChannelCreationForm = customChannelPage.newCustomChannel(customChannelPage.channelCreationBy[i])

            cy.TestStep('Create channel and validate').then(() => {
              const internalName = generateRandomString(9)
              customChannelCreationForm.enterInternalName(internalName)
              customChannelCreationForm.clickCreateChannelButton().as('createdChannel')
            })
          })
          // The next part can be put into a seperate test
          // For which we can create the channel via API and
          // Trigger messages from there.
          const name = generateRandomString(5)
          const message = generateRandomString(6)
          cy.TestStep('Send message to the created channel').get<CreatedChannel>('@createdChannel').then(({ username }) => {
            trengoApi.customChannelMessage(username, name, message)
          })

          cy.TestStep('Check the message is displayed in the inbox').then(() => {
            const ticketsPage = new TicketsPage()
            ticketsPage.checkLastMessageText(name)
          })
        })
      })
    })

    describe('Create team test', () => {
      // 0 for + button and 1 for the button with text
      [0, 1].forEach(i => {
        const teamName = generateRandomString(5)
        const employees = ['Employee 1', 'Employee 2']
        const channels = ['Email', 'Live chat']

        it('Create team and validate the request', () => {
          cy.TestStep('Open team creation form').then(() => {
            const teamPage = new CreateTeamPage()
            const createTeamForm = teamPage.openCreateTeamFormBy(i)

            cy.TestStep('Fill team information').then(() => {
              createTeamForm.enterTeamName(teamName)
              createTeamForm.addTeamMembers(employees)
              createTeamForm.addChannels(channels)
            })

            cy.TestStep('Submit').then(() => {
              createTeamForm.createTeam()
            })

            cy.TestStep('Validate the request').then(() => {
              cy.get<Interception>('@createdTeam').then(({ request }) => {
                const teamMembersRequested = request.body.team_members
                employees.forEach(e => {
                  expect(teamMembersRequested.find((i: { name: string }) => i.name === e))
                })
                const channelsRequested = request.body.channels
                channels.forEach(c => {
                  expect(channelsRequested.find((i: { name: string }) => i.name === c))
                })
              })
            })
          })
        })
      })
    })
  })
})
