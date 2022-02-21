import { makeMultiStyleConfig } from './helpers'

export const Hero = makeMultiStyleConfig({
  hstack: {
    mx: 'auto',
    mt: '102px',
  },
  heading: {
    gridColumnStart: '1',
    textStyle: { base: 'display-1-mobile', md: 'display-1' },
    color: 'secondary.500',
  },
  headingBox: {
    w: { base: '312px', md: '570px' },
    h: { base: undefined, md: '216px' },
    mb: '16px',
    mt: { base: undefined, md: '102px' },
  },
  caption: {
    textStyle: 'body-1',
    color: 'secondary.700',
  },
})
