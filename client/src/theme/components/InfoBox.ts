import { ComponentMultiStyleConfig } from '@chakra-ui/theme'

export const InfoBox: ComponentMultiStyleConfig = {
  parts: ['infoBoxItems'],
  baseStyle: () => ({
    infoBox: {
      py: '16px',
      px: '16px',
      bg: 'white',
      mt: '16px',
    },
    infoBody: {
      textStyle: 'body-1',
      fontWeight: '400',
      color: 'secondary.700',
    },
    infoStack: {
      alignItems: 'flex-start',
    },
  }),
}
