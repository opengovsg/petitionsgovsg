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
import { InfoBox } from '../InfoBox/InfoBox.component'
import { BiLinkExternal } from 'react-icons/bi'
import { Link as RouterLink } from 'react-router-dom'

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
  const [activeStep, setActiveStep] = useState(0)
  const styles = useMultiStyleConfig('PreSignModal', {})
  const onClickSgid = async (redirect: string) => {
    window.location.href = `${SGID_REDIRECT_URI}?redirect=${redirect}&useName=${useName}`
  }
  const onCloseAndReset = () => {
    onClose()
    setActiveStep(0)
  }

  useEffect(() => {
    if (post?.status === PostStatus.Draft) {
      setUseName(true)
    }
  })

  const useNameComponent = (
    <Flex sx={styles.disclaimerContainer}>
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

  const preEndorseContent = (
    <Box>
      <Text sx={styles.text}>
        You have been requested by {petitionOwner} to be an endorser of this
        petition. You will be using your Singpass login and having your full
        name published on the petition page as an endorser.
      </Text>
      <Text sx={styles.text}>
        Please read through the petition carefully before endorsing it.
      </Text>
    </Box>
  )

  const preSignStepOne = (
    <InfoBox variant="info">
      <Text>
        You will be using your Singpass login sign this petition. Please read
        through the petition carefully before proceeding.
        <br />
        <br />
        Choosing to sign with your name will only retrieve your Singpass name.
        Other details like your address and NRIC are never retrieved from
        Singpass, so can never be leaked from PetitionsSG.
      </Text>
    </InfoBox>
  )

  const preSignStepTwo = (
    <>
      <InfoBox variant="info">
        <>
          <Text>
            PetitionsSG offers the option to sign a petition anonymously,
            because we understand public civic participation in Singapore on
            certain topics could come with some social stigma attached.
          </Text>
          <RouterLink to="/anonymity">
            <Flex alignItems="center" mt="20px">
              <Text
                _hover={{
                  color: 'primary.600',
                }}
                sx={styles.anonymityButton}
                as="u"
              >
                Read more about how we ensure anonymity
              </Text>
              <Box color="primary.500">
                <BiLinkExternal />
              </Box>
            </Flex>
          </RouterLink>
        </>
      </InfoBox>
      {post?.status === PostStatus.Open && useNameComponent}
    </>
  )

  const sgidButton = (
    <Button
      sx={styles.proceedButton}
      onClick={() => onClickSgid(`${location.pathname}?sign`)}
      _hover={{
        bg: 'secondary.600',
      }}
    >
      Proceed
    </Button>
  )

  const nextButton = (
    <Button
      sx={styles.proceedButton}
      onClick={() => setActiveStep(1)}
      _hover={{
        bg: 'secondary.600',
      }}
    >
      Proceed
    </Button>
  )

  const backButton = (
    <Button
      sx={styles.cancelButton}
      _hover={{
        bg: 'secondary.100',
      }}
      onClick={() => setActiveStep(0)}
    >
      Back
    </Button>
  )

  const cancelButton = (
    <Button sx={styles.cancelButton} onClick={onClose}>
      Cancel
    </Button>
  )

  const getPreSignStepContent = (step: number) => {
    switch (step) {
      case 1:
        return preSignStepTwo
      case 0:
      default:
        return preSignStepOne
    }
  }

  const getNextStepButton = (step: number) => {
    switch (step) {
      case 1:
        return sgidButton
      case 0:
      default:
        return nextButton
    }
  }

  const getCancelStepButton = (step: number) => {
    switch (step) {
      case 1:
        return backButton
      case 0:
      default:
        return cancelButton
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onCloseAndReset} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textStyle={'h2'}>
          You will be signing this petition with your Singpass
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isEndorser ? preEndorseContent : getPreSignStepContent(activeStep)}
        </ModalBody>
        <ModalFooter>
          {isEndorser ? cancelButton : getCancelStepButton(activeStep)}
          {isEndorser ? sgidButton : getNextStepButton(activeStep)}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
