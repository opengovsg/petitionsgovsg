import { Flex, Text, Box, useMultiStyleConfig } from '@chakra-ui/react'
import { ReactComponent as HowItWorksBanner } from '../../assets/howitworks.svg'

const HowItWorks = (): JSX.Element => {
  const styles = useMultiStyleConfig('HowItWorks', {})

  return (
    <Flex sx={styles.base}>
      <Box>
        <Text sx={styles.heading}>How does petitions.gov.sg work?</Text>
        <HowItWorksBanner />
      </Box>
    </Flex>
  )
}

export default HowItWorks
