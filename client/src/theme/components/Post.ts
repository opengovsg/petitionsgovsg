import { ComponentMultiStyleConfig } from '@chakra-ui/react'

export const Post: ComponentMultiStyleConfig = {
  parts: ['posts'],
  baseStyle: () => ({
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
    sideSection: {
      w: { base: 'auto', lg: '300px' },
      minW: { base: 'auto', lg: '300px' },
      pt: { base: '36px', sm: '60px', lg: '96px' },
      color: 'secondary.800',
    },
    numberHeading: {
      mb: { base: '16px', sm: '0px' },
      textStyle: 'h2',
      my: '16px',
    },
    numberSubHeading: {
      textStyle: 'h4',
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
    badge: {
      bg: 'success.200',
      textStyle: 'caption-1',
      color: 'success.900',
      borderRadius: '4px',
      height: '24px',
      textAlign: 'center',
      px: '8px',
      py: '4px',
      my: '12px',
    },
    signatureHeader: {
      pt: '40px',
      textSyle: 'subhead-1',
      color: 'secondary.500',
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: '500',
    },
    signature: {
      color: 'secondary.400',
      textStyle: 'body-2',
      fontWeight: '400',
      fontSize: '14px',
      lineHeight: '20px',
    },
  }),
}
