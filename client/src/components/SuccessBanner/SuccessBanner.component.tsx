import { Icon, Text, HStack } from '@chakra-ui/react'
import { BiInfoCircle } from 'react-icons/bi'
import { Banner } from '../Banner/Banner.component'
interface SuccessBannerProps {
  isPetitionOwner: boolean | undefined
}

export const SuccessBanner = ({
  isPetitionOwner,
}: SuccessBannerProps): JSX.Element | null => {
  return isPetitionOwner ? (
    <Banner>
      <HStack justifyContent={'space-between'}>
        <HStack alignItems={'flex-start'}>
          <Icon as={BiInfoCircle} mt="2px" />
          <Text maxW="860px">Your post is now live!</Text>
        </HStack>
      </HStack>
    </Banner>
  ) : (
    <></>
  )
}
