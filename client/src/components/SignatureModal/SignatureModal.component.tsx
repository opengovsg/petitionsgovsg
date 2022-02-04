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
  Spinner,
} from '@chakra-ui/react'
import { CreateSignatureReqDto } from '../../api'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link as RouterLink } from 'react-router-dom'
import { BiLinkExternal } from 'react-icons/bi'
import { useAuth } from '../../contexts/AuthContext'

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
  const styles = useMultiStyleConfig('SignatureModal', {})
  const { register, handleSubmit, reset } = useForm<FormValues>()
  const [showDisclaimer, toggleShowDisclaimer] = useState(false)
  const onSubmit: SubmitHandler<CreateSignatureReqDto> = async ({
    comment,
    useName,
  }) => {
    await onConfirm({ comment: comment, useName: useName || useFullname })
    reset()
  }

  const { user, isLoading: isUserLoading } = useAuth()

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
      <Text sx={styles.charactersLeft}>{count} characters left</Text>
    </>
  )

  const useNameComponent = (
    <FormControl display="flex" alignItems="center">
      <VStack sx={styles.disclaimerBox}>
        {showDisclaimer ? (
          <Box>
            <FormLabel mb="0">
              I want to sign this petition using my full name, {user?.fullname}
            </FormLabel>
            <FormLabel sx={styles.disclaimerCaption}>
              Your full name will be visible as a signatory of this petition
            </FormLabel>
          </Box>
        ) : (
          <Box>
            <FormLabel mb="0">
              I want to sign this petition using my full name.
            </FormLabel>
            <FormLabel sx={styles.disclaimerCaption}>
              You will be an anonymous signer of this petition
            </FormLabel>
          </Box>
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

  const endorserNameComponent = (
    <Box>
      <Text>
        Your full name, {user?.fullname}, will be visible as an endorser of this
        petition
      </Text>
    </Box>
  )
  return isUserLoading ? (
    <Spinner />
  ) : (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader fontSize="24px" py="4">
            {postTitle}
            <Text sx={styles.headerCaption}>
              You will not be able to revoke your signature once you click on
              Confirm.
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Divider mb="6" />
            <Flex mb="12px">
              <Text sx={styles.bodyText}>
                Add a reason why you're signing this petition
              </Text>
              <Text sx={styles.optionalText}>(optional)</Text>
            </Flex>
            {signatureComponent}
            {useFullname ? endorserNameComponent : useNameComponent}
            {!useFullname && (
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
            )}
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
              type="submit"
              onClick={onClose}
              _hover={{
                bg: 'secondary.600',
              }}
              sx={styles.submitButton}
            >
              Confirm, sign petition
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
