import { Box, Text, Button, VStack } from '@chakra-ui/react'
import { ReactComponent as Anonymity } from '@/assets/anonymity.svg'
import { useNavigate } from 'react-router-dom'

export const AnonymityBanner = (): JSX.Element => {
  const navigate = useNavigate()

  return (
    <Box
      color="primary.100"
      background="secondary.700"
      display="flex"
      justifyContent="center"
      alignItems="center"
      className="banner"
      top={{ base: '108px', lg: '96px' }}
      mx="-24px"
    >
      <Box width="70%" justifyContent="center" my="72px">
        <VStack>
          <Anonymity />
          <Text textStyle="display-2" pt="32px">
            Ensuring Anonymity for Signatories
          </Text>
          <Text textStyle="h4" py="32px">
            Open Government Products has engineered significant protections to
            protect the identity of signees that opt to be anonymous even in the
            event of a complete data breach of PetitionSG.
          </Text>
          <Button
            textStyle="subhead-1"
            bg="white"
            color="secondary.500"
            onClick={() => {
              navigate(`/anonymity`)
            }}
          >
            How we protect your identity
          </Button>
        </VStack>
      </Box>
    </Box>
  )
}
