import {
  Button,
  Flex,
  Input,
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
import { useState } from 'react'
import { BiCopy } from 'react-icons/bi'

const MAX_CHAR_COUNT = 200

type EndorserModalProps = Pick<ModalProps, 'isOpen' | 'onClose'>

export const EndorserModal = ({
  isOpen,
  onClose,
}: EndorserModalProps): JSX.Element => {
  const [copied, setCopied] = useState(false)
  const onCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }
  const sharePetitionComponent = (
    <>
      <Flex>
        <Input
          value={window.location.href}
          maxLength={MAX_CHAR_COUNT}
          className="form-input"
          placeholder={window.location.href}
          color="primary.500"
          textDecoration="underline"
          isReadOnly={true}
          mr="16px"
        />
        <Button
          rightIcon={<BiCopy />}
          aria-label="Done"
          fontStyle={'subhead-1'}
          bg="white"
          border="1px solid"
          borderColor="secondary.500"
          color="secondary.500"
          onClick={onCopy}
          _hover={{
            bg: 'secondary.100',
          }}
        >
          {copied ? 'copied' : 'copy link'}
        </Button>
      </Flex>
    </>
  )
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textStyle={'h2'}>
          Formalise your petition with 3 endorsers
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text textStyle={'body-2'} mb="16px">
            Get 3 people to formally back your petition as endorsers, using your
            private petition link. Endorsers are also required to sign the
            petition non-anonymously. A petition can be edited until it has at
            least one endorser, so it helps to have a final draft ready.
          </Text>
          {sharePetitionComponent}
        </ModalBody>
        <ModalFooter>
          <Button
            type="submit"
            bg="secondary.500"
            fontStyle={'subhead-1'}
            color="white"
            onClick={onClose}
            _hover={{
              bg: 'secondary.600',
            }}
          >
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
