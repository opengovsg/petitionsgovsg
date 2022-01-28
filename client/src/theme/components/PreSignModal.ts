import { makeMultiStyleConfig } from './helpers'

export const PreSignModal = makeMultiStyleConfig({
  text: {
    textStyle: 'body-2',
    mb: '16px',
  },
  cancelButton: {
    bg: 'transparent',
    mx: '8px',
  },
  proceedButton: {
    bg: 'secondary.500',
    fontStyle: 'secondary.500',
    color: 'white',
  },
})
