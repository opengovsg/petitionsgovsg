import { makeMultiStyleConfig } from './helpers'

export const HowItWorks = makeMultiStyleConfig({
  base: {
    mx: 'auto',
    py: '88px',
    px: '24px',
  },
  heading: {
    textStyle: 'display-2',
    color: 'secondary.500',
    mb: '48px',
  },
  button: {
    bg: 'white',
    px: '16px',
    py: '10px',
    borderColor: '#445072',
    border: '1px',
  },
  buttonText: {
    textStyle: 'subhead-1',
    color: 'secondary.500',
  },
  graphicBox: {
    mb: '50px',
  },
})
