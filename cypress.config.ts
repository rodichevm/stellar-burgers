import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts,jsx,tsx}'
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack'
    },
    specPattern: 'cypress/component/**/*.cy.{js,ts,jsx,tsx}'
  }
});
