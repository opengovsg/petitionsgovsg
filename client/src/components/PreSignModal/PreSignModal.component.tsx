import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Switch,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useMultiStyleConfig } from '@chakra-ui/system'
import { useEffect, useState } from 'react'
import { PostWithAddresseeAndSignatures } from '~shared/types/api'
import { PostStatus } from '~shared/types/base'
import { SGID_REDIRECT_URI } from '@/api/Sgid'

type PreSignModalProps = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  isEndorser: boolean
  petitionOwner: string
  post: PostWithAddresseeAndSignatures | undefined
  postId: string | undefined
}

export const PreSignModal = ({
  isOpen,
  onClose,
  isEndorser,
  petitionOwner,
  post,
}: PreSignModalProps): JSX.Element => {
  const [useName, setUseName] = useState(false)

  const styles = useMultiStyleConfig('PreSignModal', {})

  const onClickSgid = async (redirect: string) => {
    window.location.href = `${SGID_REDIRECT_URI}?redirect=${redirect}&useName=${useName}`
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

  useEffect(() => {
    if (post?.status === PostStatus.Draft) {
      setUseName(true)
    }
  })

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
          {post?.status === PostStatus.Open && useNameComponent}
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
