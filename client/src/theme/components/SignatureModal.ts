import { ComponentMultiStyleConfig } from '@chakra-ui/theme'
import { makeMultiStyleConfig } from './helpers'

const styles = {
  input: {
    textStyle: 'body-1',
    py: '4px',
    px: '8px',
    border: '2px solid',
    bg: 'neutral.100',
    borderColor: 'neutral.400',
    _placeholder: {
      color: 'neutral.500',
    },
    h: '140px',
  },
  charactersLeft: {
    textStyle: 'body-2',
    color: 'secondary.400',
  },
  disclaimerBox: {
    alignItems: 'flex-start',
    spacing: '0',
    py: '4px',
  },
  disclaimerCaption: {
    fontSize: '12px',
    fontWeight: '400',
    color: 'secondary.400',
  },
  headerCaption: {
    textStyle: 'body-1',
    fontSize: '16px',
    py: '2',
  },
  bodyText: {
    textStyle: 'subhead-1',
    pr: '8px',
    color: 'secondary.700',
  },
  optionalText: {
    textStyle: 'body-2',
    color: 'neutral.700',
  },
  cancelButton: {
    bg: 'transparent',
    mx: '8px',
  },
  submitButton: {
    bg: 'secondary.500',
    fontStyle: 'subhead-1',
    color: 'white',
  },
}

export const SignatureModal: ComponentMultiStyleConfig =
  makeMultiStyleConfig(styles)
