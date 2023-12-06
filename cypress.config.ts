import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message)

          return null
        },
      })
    },
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 120000,
    baseUrl: "https://app.trengo.com/",
    retries: { "runMode": 2, "openMode": 0 },
    watchForFileChanges: false,
    modifyObstructiveCode: false,
    video: true,
    supportFile: "cypress/support/commands.ts"
  },
});
