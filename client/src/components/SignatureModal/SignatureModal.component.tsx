import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
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
  Textarea,
  useMultiStyleConfig,
  VStack,
} from '@chakra-ui/react'
import { CreateSignatureReqDto } from '../../api'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const MAX_CHAR_COUNT = 200
type FormValues = CreateSignatureReqDto
interface SignatureModalProps extends Pick<ModalProps, 'isOpen' | 'onClose'> {
  onConfirm: (signatureReq: CreateSignatureReqDto) => Promise<void>
  postTitle: string
}

export const SignatureModal = ({
  isOpen,
  onClose,
  onConfirm,
  postTitle,
}: SignatureModalProps): JSX.Element => {
  const [count, setCount] = useState(MAX_CHAR_COUNT)
  const styles = useMultiStyleConfig('SignForm', {})
  const { register, handleSubmit, reset } = useForm<FormValues>()
  const onSubmit: SubmitHandler<CreateSignatureReqDto> = async ({
    comment,
    useName,
  }) => {
    await onConfirm({ comment: comment, useName: useName })
    reset()
  }

  const signatureComponent = (
    <>
      <Textarea
        maxLength={MAX_CHAR_COUNT}
        sx={styles.input}
        className="form-input"
        placeholder="I believe in this cause because... "
        {...register('comment', {
          required: false,
          maxLength: {
            value: MAX_CHAR_COUNT,
            message: 'Maximum length should be 200',
          },
        })}
        onChange={(e) => setCount(MAX_CHAR_COUNT - e.target.value.length)}
      />
      <Text sx={styles.characterCount}>{count} characters left</Text>
    </>
  )
  const useNameComponent = (
    <FormControl display="flex" alignItems="center">
      <VStack alignItems="flex-start" spacing="0" py="4px">
        <FormLabel mb="0">
          I want to sign this petition using my full name.
        </FormLabel>
        <FormLabel fontSize="12px" fontWeight="400" color="secondary.400">
          Your full name will be visible as a signer of this petition.
        </FormLabel>
      </VStack>
      <Flex ms="auto">
        <Switch alignSelf="flex-end" {...register('useName', {})} />
      </Flex>
    </FormControl>
  )
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader fontSize="24px" py="4">
            {postTitle}
            <Text textStyle="body-1" fontSize="16px" py="2">
              You will not be able to revoke your signature once you click on
              Confirm.
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Divider mb="6" />
            {signatureComponent}
            {useNameComponent}
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
            <Button
              type="submit"
              bg="secondary.500"
              onClick={onClose}
              fontStyle={'subhead-1'}
              color="white"
              _hover={{
                bg: 'secondary.600',
              }}
            >
              Confirm, sign petition
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
