module.exports = {
  fixturesFolder: 'cypress/fixtures',
  defaultCommandTimeout: 10000,
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'testresults/output.xml',
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:8080',
    specPattern: 'cypress/e2e/**/*.spec.*',
  },
}
