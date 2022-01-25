import { makeMultiStyleConfig } from './helpers'

export const Anonymity = makeMultiStyleConfig({
  base: {
    m: 'auto',
    maxW: '680px',
    mt: '48px',
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
  list: {
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
  listItem: {
    ml: '12px',
  },
})
