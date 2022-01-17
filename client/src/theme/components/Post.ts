import { makeMultiStyleConfig } from './helpers'

export const Post = makeMultiStyleConfig({
  spinner: {
    height: '200px',
  },
  container: {
    height: '100%',
  },
  content: {
    maxW: '1188px',
    px: { base: '24px', sm: '88px' },
  },
  title: {
    mt: { base: '32px', sm: '60px' },
    textStyle: 'h2',
    color: 'secondary.800',
  },
  subtitle: {
    textStyle: 'body-2',
    color: 'secondary.800',
    mb: '16px',
  },
  private: {
    textStyle: 'body-2',
    color: 'secondary.800',
    fontStyle: 'italic',
    mt: '8px',
  },
  privateIcon: {
    marginRight: '4px',
    color: 'neutral.500',
    fontSize: '24',
  },
  lastUpdated: {
    textStyle: 'caption-1',
    color: 'secondary.800',
    pr: '20px',
  },
  relatedSection: {
    w: { base: 'auto', lg: '300px' },
    minW: { base: 'auto', lg: '300px' },
    pt: { base: '36px', sm: '60px', lg: '96px' },
    color: 'secondary.800',
  },
  relatedHeading: {
    mb: { base: '16px', sm: '0px' },
    textStyle: 'h2',
  },
  relatedLink: {
    py: { base: '24px', sm: '32px' },
    textStyle: 'subhead-2',
    fontWeight: 'normal',
    borderBottomWidth: '1px',
  },
  caption: {
    fontSize: '12px',
    lineheight: '16px',
  },
  signed: {
    mt: '16px',
    backgroundColor: 'secondary.800',
    w: '300px',
    h: '56px',
    borderRadius: '4px',
    color: 'white',
  },
})
