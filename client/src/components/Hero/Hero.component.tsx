import { Text, Box, useMultiStyleConfig, HStack } from '@chakra-ui/react'
import { ReactComponent as HeroImage } from '../../assets/hero.svg'

const Hero = (): JSX.Element => {
  const styles = useMultiStyleConfig('Hero', {})

  return (
    <HStack sx={styles.hstack}>
      <Box>
        <Box sx={styles.headingBox}>
          <Text sx={styles.heading}>
            Digital petitions recognised by the government
          </Text>
        </Box>
        <Box>
          <Text sx={styles.caption}>
            Digital petitions for citizens and ministries
          </Text>
          <Text sx={styles.caption}>
            Transparent • Legitimate • Efficient • Civil
          </Text>
        </Box>
      </Box>
      <HeroImage height="446px" />
    </HStack>
  )
}

export default Hero
