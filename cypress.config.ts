import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,
  component: {
    specPattern: "src/**/*.component.cy.{js,jsx,ts,tsx}",
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },

  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "src/**/*.e2e.cy.{js,jsx,ts,tsx}",
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
  },
});
