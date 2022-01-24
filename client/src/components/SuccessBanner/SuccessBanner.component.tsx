import { Icon, Text, HStack } from '@chakra-ui/react'
import { BiInfoCircle } from 'react-icons/bi'
import { Banner } from '../Banner/Banner.component'
import { useAuth } from '../../contexts/AuthContext'
import { useQuery } from 'react-query'
import {
  verifyPetitionOwner,
  VERIFY_PETITION_OWNER,
} from '../../services/AuthService'

interface SuccessBannerProps {
  postId: string | undefined
}

export const SuccessBanner = ({
  postId,
}: SuccessBannerProps): JSX.Element | null => {
  const { user } = useAuth()
  const { data: petitionOwner } = useQuery(
    [VERIFY_PETITION_OWNER, postId],
    () => verifyPetitionOwner(Number(postId)),
    { enabled: !!postId && !!user },
  )

  return petitionOwner ? (
    <Banner>
      <HStack justifyContent={'space-between'}>
        <HStack alignItems={'flex-start'}>
          <Icon as={BiInfoCircle} mt="2px" />
          <Text w="860px">Your post is now live!</Text>
        </HStack>
      </HStack>
    </Banner>
  ) : (
    <></>
  )
}
