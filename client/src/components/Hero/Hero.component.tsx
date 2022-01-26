import { Text, Box, useMultiStyleConfig, HStack, Flex } from '@chakra-ui/react'
import { ReactComponent as HeroImage } from '../../assets/hero.svg'
import { SgidButtonWithArrow } from '../SgidButton/SgidButton.component'

const Hero = (): JSX.Element => {
  const styles = useMultiStyleConfig('Hero', {})

  return (
    <HStack sx={styles.hstack}>
      <Flex alignItems={'flex-end'}>
        <Box>
          <Box sx={styles.headingBox}>
            <Text sx={styles.heading}>
              Where citizens push for change that matters
            </Text>
          </Box>
          <Box>
            <Text sx={styles.caption}>
              Transparent • Trustworthy • Impactful
            </Text>
          </Box>
          <Box mt="40px">
            <SgidButtonWithArrow
              text="Start a petition"
              redirect="/create"
              width="176px"
              height="44px"
            />
          </Box>
        </Box>
        <HeroImage height="446px" />
      </Flex>
    </HStack>
  )
}

export default Hero
