import { makeMultiStyleConfig } from './helpers'

export const PetitionCard = makeMultiStyleConfig({
  card: {
    height: '368px',
    width: '400px',
    borderRadius: '16px',
    shadow: 'md',
    px: '32px',
    py: '24px',
    border: '1px',
    borderColor: 'neutral.300',
  },
  title: {
    textStyle: 'h2',
    color: 'secondary.700',
    mb: '8px',
  },
  request: {
    textStyle: 'body-1',
    color: 'secondary.500',
    mb: '16px',
  },
  creator: {
    textStyle: 'subhead-2',
    color: 'secondary.500',
    mb: '20px',
  },
  badge: {
    bg: 'success.200',
    textStyle: 'caption-1',
    color: '#023D2E',
    borderRadius: '4px',
    width: '68px',
    height: '24px',
    textAlign: 'center',
    px: '8px',
    py: '4px',
  },
  divider: {
    my: '24px',
  },
  signatureCount: {
    textStyle: 'h4',
    color: 'secondary.500',
    pb: '2px',
  },
  signButton: {
    width: '127px',
    height: '44px',
    border: '1px',
    bg: 'white',
    borderColor: 'secondary.700',
  },
  duration: {
    textStyle: 'caption-2',
    color: 'secondary.800',
  },
})
