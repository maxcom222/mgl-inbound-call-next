
/// <reference types="cypress" />
/* eslint-disable functional/immutable-data */
const cypressReact = require("cypress-react-unit-test/plugins/load-webpack");
const env = require("../../src/env");
module.exports = (on, config) => {

  cypressReact(on, config);
  config.env = env;

  return config;
};
