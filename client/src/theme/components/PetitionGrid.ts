import { makeMultiStyleConfig } from './helpers'

export const PetitionGrid = makeMultiStyleConfig({
  grid: {
    mx: 'auto',
    'grid-template-columns': { base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' },
    'grid-column-gap': '12px',
    'grid-row-gap': '20px',
  },
})
