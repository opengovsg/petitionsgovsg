import { makeMultiStyleConfig } from './helpers'

export const FormFields = makeMultiStyleConfig({
  heading: {
    textStyle: 'h1',
    color: 'secondary.700',
    mb: '8px',
  },
  headingCaption: {
    textStyle: 'subhead-1',
    color: 'secondary.700',
    mb: '56px',
  },
  formLabel: {
    textStyle: 'subhead-1',
    color: 'secondary.700',
    mb: '0px',
  },
  formLabelBox: {
    mb: '12px',
    mt: '40px',
  },
  name: {
    bgColor: 'white',
    h: '44px',
    px: '16px',
    py: '10px',
    textStyle: 'body-1',
    color: 'secondary.700',
  },
  formCaption: {
    textStyle: 'body-2',
    color: 'secondary.400',
  },
  optional: {
    textStyle: 'body-2',
    color: 'neutral.700',
  },
  charsRemainingBox: {
    textStyle: 'body-2',
    color: 'secondary.400',
    mt: '8px',
  },
  input: {
    bg: 'white',
  },
  infoBox: {
    py: '16px',
    px: '16px',
    bg: 'white',
    mt: '16px',
  },
  infoHeading: {
    textStyle: 'body-1',
    fontWeight: '700',
    color: 'secondary.700',
  },
  infoBody: {
    textStyle: 'body-1',
    fontWeight: '400',
    color: 'secondary.700',
  },
  infoStack: {
    alignItems: 'flex-start',
  },
  buttonGroup: {
    mt: '60px',
    justifyContent: 'flex-end',
  },
  button: {
    bg: 'secondary.500',
    color: 'white',
    textStyle: 'subhead-1',
  },
  stepsBox: {
    mb: '48px',
    justifyContent: 'space-between',
  },
  stepsBackLink: {
    fontWeight: '500',
    color: 'secondary.500',
  },
  stepsText: {
    textStyle: 'body-1',
    color: 'secondary.300',
  },
})
