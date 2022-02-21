import { makeMultiStyleConfig } from './helpers'

export const PetitionGrid = makeMultiStyleConfig({
  grid: {
    mx: 'auto',
    gridTemplateColumns: { base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' },
    gridColumnGap: '12px',
    gridRowGap: '20px',
  },
})
