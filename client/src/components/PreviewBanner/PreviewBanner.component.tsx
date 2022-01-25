import {
  Icon,
  Text,
  HStack,
  Button,
  Box,
  useDisclosure,
  ButtonGroup,
} from '@chakra-ui/react'
import { BiInfoCircle } from 'react-icons/bi'
import { Banner } from '../Banner/Banner.component'
import { GetSinglePostDto } from '../../api'
import { EndorserModal } from '../../components/EndorserModal/EndorserModal.component'
import { useLocation, useNavigate } from 'react-router-dom'

interface PreviewBannerProps {
  isPetitionOwner: boolean | undefined
  post: GetSinglePostDto
}

export const PreviewBanner = ({
  isPetitionOwner,
  post,
}: PreviewBannerProps): JSX.Element | null => {
  const navigate = useNavigate()
  const location = useLocation()

  const {
    onOpen: onEndorserModalOpen,
    onClose: onEndorserModalClose,
    isOpen: isEndorserModalOpen,
  } = useDisclosure()

  const onClick = async () => {
    onEndorserModalOpen()
  }

  return (
    <Banner>
      <HStack justifyContent={'space-between'}>
        <HStack alignItems={'flex-start'}>
          <Icon as={BiInfoCircle} />
          {isPetitionOwner ? (
            <Text w="860px">
              Get 3 people to formally back your petition as endorsers, using
              your private petition link. A petition can be edited until it has
              at least one endorser, so it helps to have a final draft ready.
            </Text>
          ) : (
            <Text>
              {`You have been requested by ${post.fullname} to be an endorser of this petition.
              Please read through it carefully before endorsing the petition.`}
            </Text>
          )}
        </HStack>
        {isPetitionOwner ? (
          <Box>
            <ButtonGroup spacing="4">
              {post.signatureCount === 0 ? (
                <Button
                  bg="transparent"
                  variant="outline"
                  _hover={{ bg: 'primary.600' }}
                  onClick={() => navigate(`${location.pathname}/edit`)}
                >
                  Edit petition
                </Button>
              ) : undefined}
              <Button
                bg="white"
                variant="solid"
                color="primary.500"
                _hover={{ bg: 'primary.100' }}
                onClick={onClick}
              >
                Get private link
              </Button>
            </ButtonGroup>
          </Box>
        ) : undefined}
        <EndorserModal
          isOpen={isEndorserModalOpen}
          onClose={onEndorserModalClose}
        />
      </HStack>
    </Banner>
  )
}
