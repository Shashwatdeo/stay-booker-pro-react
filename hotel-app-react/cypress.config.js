const { defineConfig } = require("cypress");

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      // Implement node event listeners here

      // Example: Log errors using Cypress tasks
      on("task", {
        logError(error) {
          console.error("Cypress error:", error);
          return null;
        },
      });

      return config;
    },
    defaultCommandTimeout: 60000, // Increase timeout to 60 seconds
    requestTimeout: 60000, // Increase request timeout to 60 seconds
  },
});
