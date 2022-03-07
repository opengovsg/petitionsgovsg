import {
  Button,
  Divider,
  Flex,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BiCopy } from 'react-icons/bi'

export type SubscriptionFormValues = { email: string }

const MAX_CHAR_COUNT = 200
type FormValues = {
  email: string
}
interface SubscriptionModalProps
  extends Pick<ModalProps, 'isOpen' | 'onClose'> {
  onConfirm: (subscriptionReq: FormValues) => Promise<void>
}

const refreshPage = async () => window.location.reload()

export const SubscriptionModal = ({
  isOpen,
  onClose,
  onConfirm,
}: SubscriptionModalProps): JSX.Element => {
  const { register, handleSubmit, reset } = useForm<FormValues>()
  const onSubmit: SubmitHandler<FormValues> = async ({ email }) => {
    if (email) {
      await onConfirm({ email: email })
      reset()
      setTimeout(() => refreshPage(), 3000)
    } else {
      onClose()
      refreshPage()
    }
  }
  const [copied, setCopied] = useState(false)
  const receiveEmailUpdatesComponent = (
    <>
      <FormLabel>
        Receive email updates regarding this petition (optional)
      </FormLabel>
      <Input
        maxLength={MAX_CHAR_COUNT}
        className="form-input"
        placeholder="mail@example.com"
        {...register('email', {
          required: false,
        })}
      />
    </>
  )
  const onCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }
  const sharePetitionComponent = (
    <>
      <FormLabel pt="32px">
        Sharing leads to way more signatures. Help this petition grow!
      </FormLabel>
      <Flex>
        <Input
          value={window.location.href}
          maxLength={MAX_CHAR_COUNT}
          className="form-input"
          placeholder={window.location.href}
          color="primary.500"
          textDecoration="underline"
          isReadOnly={true}
          mr="8px"
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader fontSize="24px" pt="4">
            Thank you for supporting this petition!
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Divider mb="6" />
            {receiveEmailUpdatesComponent}
            {sharePetitionComponent}
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              bg="secondary.500"
              fontStyle={'subhead-1'}
              color="white"
              onClick={handleSubmit(onSubmit)}
              _hover={{
                bg: 'secondary.600',
              }}
            >
              Done
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
