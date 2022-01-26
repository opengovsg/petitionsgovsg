import {
  Box,
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
import { Link as RouterLink } from 'react-router-dom'
import { BiLinkExternal } from 'react-icons/bi'

const MAX_CHAR_COUNT = 200
type FormValues = CreateSignatureReqDto
interface SignatureModalProps extends Pick<ModalProps, 'isOpen' | 'onClose'> {
  onConfirm: (signatureReq: CreateSignatureReqDto) => Promise<void>
  postTitle: string
  useFullname: boolean
}

export const SignatureModal = ({
  isOpen,
  onClose,
  onConfirm,
  postTitle,
  useFullname,
}: SignatureModalProps): JSX.Element => {
  const [count, setCount] = useState(MAX_CHAR_COUNT)
  const styles = useMultiStyleConfig('SignForm', {})
  const { register, handleSubmit, reset } = useForm<FormValues>()
  const [showDisclaimer, toggleShowDisclaimer] = useState(false)
  const onSubmit: SubmitHandler<CreateSignatureReqDto> = async ({
    comment,
    useName,
  }) => {
    await onConfirm({ comment: comment, useName: useName || useFullname })
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
      <Text textStyle="body-2" color="secondary.400">
        {count} characters left
      </Text>
    </>
  )
  const useNameComponent = (
    <FormControl display="flex" alignItems="center">
      <VStack alignItems="flex-start" spacing="0" py="4px">
        <FormLabel mb="0">
          I want to sign this petition using my full name.
        </FormLabel>
        {showDisclaimer ? (
          <FormLabel fontSize="12px" fontWeight="400" color="secondary.400">
            Your full name will be visible as a signatory of this petition
          </FormLabel>
        ) : (
          <FormLabel fontSize="12px" fontWeight="400" color="secondary.400">
            You will be an anonymous signer of this petition
          </FormLabel>
        )}
      </VStack>
      <Flex ms="auto">
        <Switch
          alignSelf="flex-end"
          colorScheme="green"
          {...register('useName', {})}
          onChange={() => {
            toggleShowDisclaimer(!showDisclaimer)
          }}
        />
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
            <Flex mb="12px">
              <Text textStyle="subhead-1" pr="8px" color="secondary.700">
                Add a reason why you’re signing this petition
              </Text>
              <Text textStyle="body-2" color="neutral.700">
                (optional)
              </Text>
            </Flex>
            {signatureComponent}
            {!useFullname && useNameComponent}
            <RouterLink to="/anonymity">
              <Flex alignItems="center" mt="20px">
                <Text
                  _hover={{
                    color: 'primary.600',
                  }}
                  color="primary.500"
                  as="u"
                  mr="8px"
                >
                  Read more about how we ensure anonymity
                </Text>
                <Box color="primary.500">
                  <BiLinkExternal />
                </Box>
              </Flex>
            </RouterLink>
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
