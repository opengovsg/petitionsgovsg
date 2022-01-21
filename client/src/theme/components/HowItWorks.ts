import { makeMultiStyleConfig } from './helpers'

export const HowItWorks = makeMultiStyleConfig({
  base: {
    mx: 'auto',
    justifyContent: 'center',
    py: '88px',
  },
  heading: {
    textStyle: 'display-2',
    color: 'secondary.500',
    mb: '48px',
  },
})
