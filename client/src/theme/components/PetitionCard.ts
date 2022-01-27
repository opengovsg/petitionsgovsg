import { ComponentMultiStyleConfig } from '@chakra-ui/theme'

export const PetitionCard: ComponentMultiStyleConfig = {
  parts: ['petitionCardItems'],
  baseStyle: ({ status }) => ({
    card: {
      height: { base: '500px', md: '384px' },
      width: { base: '310px', md: '400px' },
      borderRadius: '16px',
      shadow: 'md',
      px: '32px',
      py: '24px',
      border: '1px',
      borderColor: 'neutral.300',
      bg: 'white',
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
      noOfLines: { base: 3, md: 2 },
    },
    creator: {
      textStyle: 'subhead-2',
      color: 'secondary.500',
      mb: '20px',
    },
    topcard: {
      minH: { base: '290px', md: '240px' },
    },
    badge: {
      bg: status === 'CLOSED' ? 'success.200' : 'primary.200',
      textStyle: 'caption-1',
      color: status === 'CLOSED' ? 'success.800' : 'primary.800',
      borderRadius: '4px',
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
      mt: { xs: '16px', md: '0px' },
      mb: '16px',
      borderColor: 'secondary.700',
    },
    duration: {
      textStyle: 'caption-2',
      color: 'secondary.800',
    },
  }),
}
