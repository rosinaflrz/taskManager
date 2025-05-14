const { TestEnvironment } = require("jest-environment-jsdom");

module.exports = {
    preset: '@shelf/jest-mongodb',
    coverageReporters: ["json-summary"],
    TestEnvironment : "jsdom"
};