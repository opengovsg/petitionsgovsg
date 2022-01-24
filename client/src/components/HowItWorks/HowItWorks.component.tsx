import {
  Flex,
  Text,
  Box,
  useMultiStyleConfig,
  Button,
  VStack,
} from '@chakra-ui/react'
import { ReactComponent as HowItWorksBanner } from '../../assets/howitworks.svg'

const HowItWorks = (): JSX.Element => {
  const styles = useMultiStyleConfig('HowItWorks', {})

  return (
    <Flex sx={styles.base}>
      <VStack>
        <Box sx={styles.graphicBox}>
          <Text sx={styles.heading}>How does petitions.gov.sg work?</Text>
          <HowItWorksBanner />
        </Box>
        <Button sx={styles.button}>
          <Text sx={styles.buttonText}>Read more about the process</Text>
        </Button>
      </VStack>
    </Flex>
  )
}

export default HowItWorks
