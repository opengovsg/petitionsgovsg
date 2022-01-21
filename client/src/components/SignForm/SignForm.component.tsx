import { Button, useDisclosure } from '@chakra-ui/react'
import { SubmitHandler } from 'react-hook-form'
import { CreateSignatureReqDto } from '../../api'
import * as SignatureService from '../../services/SignatureService'
import { SignatureModal } from '../SignatureModal/SignatureModal.component'
import { SubscriptionModal } from '../SubscriptionModal/SubscriptionModal'
import { useStyledToast } from '../StyledToast/StyledToast'

type FormValues = CreateSignatureReqDto

type SusbcriptionFormValues = { email: string }

const SignForm = ({
  postId,
  postTitle,
}: {
  postId: string | undefined
  postTitle: string
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
    email,
  }: SusbcriptionFormValues): Promise<void> => {
    //TODO: Implement subscription
    console.log(email)
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
