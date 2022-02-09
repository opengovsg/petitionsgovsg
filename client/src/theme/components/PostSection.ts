import { makeMultiStyleConfig } from './helpers'

export const PostSection = makeMultiStyleConfig({
  container: {
    d: 'grid',
    my: '16px',
    gridTemplateColumns: 'max-content 1fr',
    color: 'secondary.800',
  },
  content: {
    pr: '16px',
    gridColumn: '2',
    textStyle: 'body-1',
    mt: '16px',

    '& .public-DraftStyleDefault-block': {
      margin: 0,
    },
  },
  request: {
    textStyle: 'h2',
    mb: '16px',
  },
  reason: {
    textStyle: 'h2',
    mt: '32px',
    mb: '16px',
  },
})
