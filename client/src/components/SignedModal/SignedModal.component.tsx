import {
  Button,
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
import { InfoBox } from '../InfoBox/InfoBox.component'

type SignedModalProps = Pick<ModalProps, 'isOpen' | 'onClose'>

export const SignedModal = ({
  isOpen,
  onClose,
}: SignedModalProps): JSX.Element => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="24px" pt="4">
          You have already signed this petition
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <InfoBox variant="danger">
            <Text>
              You can only sign a petition once. You’ve previously used your
              Singpass login to sign this petition.
            </Text>
          </InfoBox>
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
            Back to petition
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
