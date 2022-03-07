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
  variants: {
    danger: {
      infoBox: {
        bg: 'danger.100',
      },
    },
    info: {
      infoBox: {
        bg: 'primary.100',
      },
    },
    default: {
      infoBox: {
        bg: 'none',
      },
    },
  },
  defaultProps: {
    variant: 'solid',
  },
}
