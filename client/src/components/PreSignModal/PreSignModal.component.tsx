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
  VStack,
  Flex,
  Switch,
} from '@chakra-ui/react'
import { useMultiStyleConfig } from '@chakra-ui/system'
import { GetSinglePostDto } from '../../api'
import { useState } from 'react'

type PreSignModalProps = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  isEndorser: boolean
  petitionOwner: string
  post: GetSinglePostDto | undefined
  postId: string | undefined
}

export const PreSignModal = ({
  isOpen,
  onClose,
  isEndorser,
  petitionOwner,
}: PreSignModalProps): JSX.Element => {
  // If user is signed in, don't need to resign in through SP app
  const [useName, setUseName] = useState(false)

  const styles = useMultiStyleConfig('PreSignModal', {})

  const onClickSgid = async (redirect: string) => {
    if (process.env.NODE_ENV === 'production') {
      window.location.href = `${process.env.PUBLIC_URL}/api/v1/auth/sgid/login?redirect=${redirect}&useName=${useName}`
    } else {
      window.location.href = `http://localhost:6174/api/v1/auth/sgid/login?redirect=${redirect}&useName=${useName}`
    }
  }

  const useNameComponent = (
    <Flex>
      <VStack sx={styles.disclaimerBox}>
        <Box>
          <Text sx={styles.disclaimerHeader}>
            I want to sign this petition using my full name.
          </Text>
          <Text sx={styles.disclaimerCaption}>
            Your full name will be visible as a signatory of this petition
          </Text>
        </Box>
      </VStack>
      <Flex ms="auto">
        <Switch
          alignSelf="center"
          colorScheme="green"
          onChange={() => {
            setUseName(!useName)
          }}
        />
      </Flex>
    </Flex>
  )

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
              <Text sx={styles.text}>
                You have been requested by {petitionOwner} to be an endorser of
                this petition. You will be using your Singpass login and having
                your full name published on the petition page as an endorser.
              </Text>
              <Text sx={styles.text}>
                Please read through the petition carefully before endorsing it.
              </Text>
            </Box>
          ) : (
            <Text sx={styles.text}>
              You will be using your Singpass login to sign this petition.
              Please read through the petition carefully before signing it.
            </Text>
          )}
          {useNameComponent}
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={onClose}
            sx={styles.cancelButton}
            _hover={{
              bg: 'secondary.100',
            }}
          >
            Cancel
          </Button>
          <Button
            sx={styles.proceedButton}
            onClick={() => onClickSgid(`${location.pathname}?sign`)}
            _hover={{
              bg: 'secondary.600',
            }}
          >
            Proceed and sign
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
