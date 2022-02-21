import { Text, Box, useMultiStyleConfig, Flex, Grid } from '@chakra-ui/react'
import { ReactComponent as HeroImage } from '@/assets/hero.svg'
import { SgidButtonWithArrow } from '../SgidButton/SgidButton.component'

const Hero = (): JSX.Element => {
  const styles = useMultiStyleConfig('Hero', {})

  return (
    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }}>
      <Box mt="32px" mx="auto">
        <Box sx={styles.headingBox}>
          <Text sx={styles.heading}>
            Where citizens push for change that matters
          </Text>
        </Box>
        <Box>
          <Text sx={styles.caption}>Transparent • Trustworthy • Impactful</Text>
        </Box>
        <Box mt="40px">
          <SgidButtonWithArrow text="Start a petition" redirect="/create" />
        </Box>
      </Box>
      <Flex mt={{ base: '32px', md: '88px' }} mr="-24px">
        <HeroImage width="100%" height="100%" />
      </Flex>
    </Grid>
  )
}

export default Hero
