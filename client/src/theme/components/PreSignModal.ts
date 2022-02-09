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
  disclaimerBox: {
    alignItems: 'flex-start',
    spacing: '0',
    py: '4px',
  },
  disclaimerHeader: {
    textStyle: 'subhead-1',
  },
  disclaimerCaption: {
    fontSize: '12px',
    fontWeight: '400',
    color: 'secondary.400',
  },
})
