import { makeMultiStyleConfig } from './helpers'

export const Hero = makeMultiStyleConfig({
  hstack: {
    mx: 'auto',
    mt: '102px',
  },
  heading: {
    'grid-column-start': '1',
    textStyle: 'display-1',
    color: 'secondary.500',
  },
  headingBox: {
    w: '570px',
    h: '216px',
    mb: '16px',
    mt: '102px',
  },
  caption: {
    textStyle: 'body-1',
    color: 'secondary.700',
  },
})
