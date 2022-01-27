import {
  Flex,
  Text,
  Box,
  useMultiStyleConfig,
  Button,
  VStack,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import HowItWorksBanner from './HowItWorksBanner.component'

const HowItWorks = (): JSX.Element => {
  const styles = useMultiStyleConfig('HowItWorks', {})
  const navigate = useNavigate()

  return (
    <Flex bg="white" mx="-24px">
      <Flex sx={styles.base}>
        <VStack>
          <Box sx={styles.graphicBox}>
            <Text sx={styles.heading}>How does petitions.gov.sg work?</Text>
            <HowItWorksBanner />
          </Box>
          <Button
            sx={styles.button}
            onClick={() => {
              navigate(`/guidelines`)
            }}
          >
            <Text sx={styles.buttonText}>Read more about the process</Text>
          </Button>
        </VStack>
      </Flex>
    </Flex>
  )
}

export default HowItWorks
