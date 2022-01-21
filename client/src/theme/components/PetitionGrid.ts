import { makeMultiStyleConfig } from './helpers'

export const PetitionGrid = makeMultiStyleConfig({
  grid: {
    'grid-template-columns': { base: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' },
    m: 'auto',
    'grid-column-gap': '12px',
    'grid-row-gap': '20px',
  },
})
