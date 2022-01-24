import { Button, useDisclosure } from '@chakra-ui/react'
import { SubmitHandler } from 'react-hook-form'
import { CreateSignatureReqDto } from '../../api'
import * as SignatureService from '../../services/SignatureService'
import { SignatureModal } from '../SignatureModal/SignatureModal.component'
import {
  SubscriptionModal,
  SusbcriptionFormValues,
} from '../SubscriptionModal/SubscriptionModal.component'
import { useStyledToast } from '../StyledToast/StyledToast'
import { BiLockAlt } from 'react-icons/bi'

type FormValues = CreateSignatureReqDto
const refreshPage = async () => window.location.reload()

const SignForm = ({
  postId,
  postTitle,
  isPetitionOwner,
}: {
  postId: string | undefined
  postTitle: string
  isPetitionOwner: boolean
}): JSX.Element => {
  const toast = useStyledToast()

  // Init Signature Modal
  const {
    onOpen: onSignatureModalOpen,
    onClose: onSignatureModalClose,
    isOpen: isSignatureModalOpen,
  } = useDisclosure()
  const onSignatureConfirm: SubmitHandler<FormValues> = async ({
    comment,
    useName,
  }: CreateSignatureReqDto): Promise<void> => {
    await SignatureService.createSignature(Number(postId), {
      comment: comment ?? null,
      useName: useName,
    })
    toast({
      status: 'success',
      description: 'You have successfully signed this petition!',
    })
    onSubscriptionModalOpen()
  }
  const onClick = async () => {
    onSignatureModalOpen()
  }

  // Init Subscription Modal
  const {
    onOpen: onSubscriptionModalOpen,
    onClose: onSubscriptionModalClose,
    isOpen: isSubscriptionModalOpen,
  } = useDisclosure()

  const onSubscriptionConfim: SubmitHandler<SusbcriptionFormValues> = async ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    email,
  }: SusbcriptionFormValues): Promise<void> => {
    //TODO: Implement subscription
    refreshPage()
  }

  return (
    <>
      <Button
        onClick={onClick}
        bg="secondary.500"
        fontStyle={'subhead-1'}
        color="white"
        height="48px"
        width="300px"
        _hover={{
          background: 'secondary.400',
        }}
        disabled={isPetitionOwner}
        leftIcon={<BiLockAlt />}
      >
        Sign this petition
      </Button>
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={onSubscriptionModalClose}
        onConfirm={onSubscriptionConfim}
      />
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={onSignatureModalClose}
        onConfirm={onSignatureConfirm}
        postTitle={postTitle}
      />
    </>
  )
}

export default SignForm
