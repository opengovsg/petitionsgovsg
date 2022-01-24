import {
  Flex,
  Text,
  Box,
  useMultiStyleConfig,
  Button,
  VStack,
} from '@chakra-ui/react'
import { ReactComponent as HowItWorksBanner } from '../../assets/howitworks.svg'
import { useNavigate } from 'react-router-dom'

const HowItWorks = (): JSX.Element => {
  const styles = useMultiStyleConfig('HowItWorks', {})
  const navigate = useNavigate()

  return (
    <Flex sx={styles.base}>
      <VStack>
        <Box sx={styles.graphicBox}>
          <Text sx={styles.heading}>How does petitions.gov.sg work?</Text>
          <HowItWorksBanner />
        </Box>
        <Button
          sx={styles.button}
          onClick={() => {
            window.scrollTo(0, 0)
            navigate(`/guidelines`)
          }}
        >
          <Text sx={styles.buttonText}>Read more about the process</Text>
        </Button>
      </VStack>
    </Flex>
  )
}

export default HowItWorks
