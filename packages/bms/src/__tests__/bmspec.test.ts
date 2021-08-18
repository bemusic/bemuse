import { loadFeatures, autoBindSteps, StepDefinitions } from 'jest-cucumber'

const stepDefinitions: StepDefinitions = ({ given, and, when, then }) => {
  
}

describe('bmspec', () => {
  const features = loadFeatures('bmspec/features/**/*.feature')
  autoBindSteps(features, [stepDefinitions])
})
