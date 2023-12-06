# fantastic-octo-spork


## Setup
 - For this you will need `node` v18. 
 - Do `npm i`
 - Create a `cypress.env.json` and add the following: `{ "email": <string>, "password": <password> }`
 - Run the test with the options found in `package.json`'s script.


## Tests
Only 2 end to end tests. 

### What is NOT here:
 - Since this is an End to end test, did not include any field validations of frontend. 
 - Field validations should be part of component test which should done at code level. 
 - The tests should start with a clean account. Like a new account. I do not know the architecture of the product well enough to do that and pollute with lots of floating account.

### Pre and post:
 - Logging in using API in *before* hook
 - Removing the created resource (channel/team) using API in *after* hook

#### Create custom channel
 - Creating a new custom channel using 2 different button, One using the Plus icon on top, and another using the button.
 - After the channel creatio we use API to trigger a message. and check in tickets that the message is appearing. (This whole thing can be done in backend only) (Also should be a seperate test, Need to make an API call to create a new team and then the rest. Would do that if I have some time but the concept is similar to login.)

#### Create a team
 - Usimg the similar 2 buttons (The plus sign on top and the text button) creating a team.  
 - And validating the request being sent from frontend is similar to the inputs provided

## Reporting

- After the test is run *(via npx cypress run)* you can goto `cypress/reports` folder and see a mochawesome report being generated.
- You can also see the test reports in ci via [actions](https://github.com/sumitdasonline/fantastic-octo-spork/actions) tab *(Not sure if you can run it)*.