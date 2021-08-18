import { loadFeatures, autoBindSteps, StepDefinitions } from 'jest-cucumber'
import definitionModules from './bmspec/step_definitions'
import { World } from './bmspec/support'

describe('bmspec', () => {
  let world: World

  beforeEach(() => {
    world = new World()
  })

  const stepDefinitions: StepDefinitions = ({ defineStep }) => {
    for (const m of definitionModules) {
      for (const item of m.definitions) {
        defineStep(item.pattern, (...args) => {
          return item.callback.apply(world, args)
        })
      }
    }
  }

  const features = loadFeatures('bmspec/features/**/*.feature')
  autoBindSteps(features, [stepDefinitions])
})
