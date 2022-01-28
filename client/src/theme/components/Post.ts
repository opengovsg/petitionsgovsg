import { ComponentMultiStyleConfig } from '@chakra-ui/react'

export const Post: ComponentMultiStyleConfig = {
  parts: ['posts'],
  baseStyle: ({ status }) => ({
    spinner: {
      height: '200px',
    },
    container: {
      height: '100%',
      mb: '88px',
    },
    content: {
      maxW: '1188px',
      w: '100%',
      px: { base: '24px', sm: '88px' },
    },
    title: {
      mt: { base: '32px', sm: '60px' },
      textStyle: 'h2',
      color: 'secondary.800',
    },
    header: {
      mt: { base: '32px', sm: '48px' },
      textStyle: 'h2',
      color: 'secondary.800',
    },
    subtitle: {
      textStyle: 'body-2',
      color: 'secondary.800',
      mb: '16px',
      my: '12px',
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
      pt: { base: '0px', sm: '60px', lg: '96px' },
      color: 'secondary.800',
      align: 'left',
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
      bg: status === 'CLOSED' ? 'success.200' : 'primary.200',
      textStyle: 'caption-1',
      color: status === 'CLOSED' ? 'success.800' : 'primary.800',
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
    startedByBox: {
      my: '4px',
      fontWeight: '500',
    },
    startedByText: {
      textDecoration: 'underline',
    },
    sharePrivateLinkButton: {
      bg: 'secondary.500',
      fontStyle: 'subhead-1',
      color: 'white',
      height: '56px',
      width: '300px',
    },
    sharePetitionButton: {
      fontStyle: 'subhead-1',
      color: 'secondary.500',
      height: '56px',
      width: '300px',
      borderRadius: '4px',
      borderColor: 'secondary.500',
    },
  }),
}
