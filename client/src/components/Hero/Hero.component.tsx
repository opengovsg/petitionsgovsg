import { Text, Box, useMultiStyleConfig, HStack, Flex } from '@chakra-ui/react'
import { ReactComponent as HeroImage } from '../../assets/hero.svg'
import SgidButton from '../SgidButton/SgidButton.component'

const Hero = (): JSX.Element => {
  const styles = useMultiStyleConfig('Hero', {})

  return (
    <HStack sx={styles.hstack}>
      <Flex alignItems={'flex-end'}>
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
          <Box mt="40px">
            <SgidButton
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
