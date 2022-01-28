import { makeMultiStyleConfig } from './helpers'

export const About = makeMultiStyleConfig({
  base: {
    m: 'auto',
    maxW: '680px',
    mt: '48px',
    px: { base: '24px', md: '0px' },
  },
  heading: {
    textStyle: 'display-2',
    color: 'secondary.500',
    mb: '48px',
  },
  subheading: {
    textStyle: 'h2',
    color: 'secondary.700',
    mb: '16px',
  },
  text: {
    textStyle: 'body-1',
    color: 'secondary.700',
    mb: '24px',
  },
  sectionBox: {
    mb: '48px',
  },
  listHeading: {
    textStyle: 'body-1',
    color: 'secondary.700',
    mb: '24px',
    fontWeight: '700',
  },
})
