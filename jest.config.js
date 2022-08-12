module.exports = {
  "testTimeout": 10000,
  "maxWorkers": 2,
  "coverageDirectory": "<rootDir>/coverage",
  "testEnvironment": "node",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js"
  ],
  "testMatch": [
    "**/?(*.)+(spec|test).(ts|js)"
  ],
  "globals": {
    "ts-jest": {
      "tsconfig": "tsconfig.json"
    }
  },
  "preset": "ts-jest"
}