import { ComponentMultiStyleConfig } from '@chakra-ui/theme'
import { makeMultiStyleConfig } from './helpers'

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '300px',
  },
  label: {
    mt: '16px',
    textStyle: 'subhead-1',
  },
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
  submitButton: {
    mt: '16px',
    backgroundColor: 'secondary.500',
    _hover: {
      background: 'secondary.400',
    },
    w: '300px',
    h: '56px',
    borderRadius: '4px',
    color: 'white',
  },
  characterCount: {
    fontSize: '12px',
    textAlign: 'right',
  },
  caption: {
    fontSize: '12px',
  },
}

export const SignForm: ComponentMultiStyleConfig = makeMultiStyleConfig(styles)
