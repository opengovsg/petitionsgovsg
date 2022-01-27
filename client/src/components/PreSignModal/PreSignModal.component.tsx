import {
  Button,
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
} from '@chakra-ui/react'
import { useAuth } from '../../contexts/AuthContext'
import { GetSinglePostDto } from '../../api'

type PreSignModalProps = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  isEndorser: boolean
  petitionOwner: string
  post: GetSinglePostDto | undefined
  postId: string | undefined
  onNext: () => Promise<void>
}

export const PreSignModal = ({
  isOpen,
  onClose,
  isEndorser,
  petitionOwner,
  onNext,
}: PreSignModalProps): JSX.Element => {
  // If user is signed in, don't need to resign in through SP app
  const { user } = useAuth()

  const onClickSgid = async (redirect: string) => {
    if (process.env.NODE_ENV === 'production') {
      window.location.href = `${process.env.PUBLIC_URL}/api/v1/auth/sgid/login?redirect=${redirect}`
    } else {
      window.location.href = `http://localhost:6174/api/v1/auth/sgid/login?redirect=${redirect}`
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textStyle={'h2'}>
          You're signing this petition with your Singpass
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isEndorser ? (
            <Box>
              <Text textStyle={'body-2'} mb="16px">
                You have been requested by {petitionOwner} to be an endorser of
                this petition. You will be using your Singpass login and having
                your full name published on the petition page as an endorser.
              </Text>
              <Text textStyle={'body-2'} mb="16px">
                Please read through the petition carefully before endorsing it.
              </Text>
            </Box>
          ) : (
            <Text textStyle={'body-2'} mb="16px">
              You will be using your Singpass login to sign this petition.
              Please read through the petition carefully before endorsing it.
            </Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={onClose}
            bg="transparent"
            mx="8px"
            _hover={{
              bg: 'secondary.100',
            }}
          >
            Cancel
          </Button>
          {user ? (
            <Button
              type="submit"
              bg="secondary.500"
              fontStyle={'subhead-1'}
              color="white"
              onClick={onNext}
              _hover={{
                bg: 'secondary.600',
              }}
            >
              Proceed and sign
            </Button>
          ) : (
            <Button
              bg="secondary.500"
              fontStyle={'subhead-1'}
              color="white"
              onClick={() => onClickSgid(`${location.pathname}?sign`)}
              _hover={{
                bg: 'secondary.600',
              }}
            >
              Proceed and sign
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
