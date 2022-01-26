import { Button, useDisclosure } from '@chakra-ui/react'
import { SubmitHandler } from 'react-hook-form'
import { CreateSignatureReqDto, GetSinglePostDto } from '../../api'
import * as SignatureService from '../../services/SignatureService'
import { SignatureModal } from '../SignatureModal/SignatureModal.component'
import {
  SubscriptionModal,
  SubscriptionFormValues,
} from '../SubscriptionModal/SubscriptionModal.component'
import { useStyledToast } from '../StyledToast/StyledToast'
import { BiLockAlt, BiPen, BiShareAlt } from 'react-icons/bi'
import { PostStatus } from '~shared/types/base'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { EndorserModal } from '../../components/EndorserModal/EndorserModal.component'

type FormValues = CreateSignatureReqDto
const refreshPage = async () => window.location.reload()

const SignForm = ({
  post,
  postId,
  isPetitionOwner,
}: {
  post: GetSinglePostDto | undefined
  postId: string | undefined
  isPetitionOwner: boolean
}): JSX.Element => {
  const toast = useStyledToast()

  const [searchParams] = useSearchParams()
  const openSignatureModal = searchParams.has('sign')

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

  const onSubscriptionConfim: SubmitHandler<SubscriptionFormValues> = async ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    email,
  }: SubscriptionFormValues): Promise<void> => {
    //TODO: Implement subscription
    refreshPage()
  }

  // Init Endorser Modal
  const {
    onOpen: onEndorserModalOpen,
    onClose: onEndorserModalClose,
    isOpen: isEndorserModalOpen,
  } = useDisclosure()

  useEffect(() => {
    if (openSignatureModal) {
      onSignatureModalOpen()
    }
  }, [])

  return (
    <>
      {post?.status === PostStatus.Open && (
        <Button
          onClick={onClick}
          bg="secondary.500"
          fontStyle={'subhead-1'}
          color="white"
          height="56px"
          width="300px"
          _hover={{
            background: 'secondary.400',
          }}
          disabled={isPetitionOwner}
          leftIcon={<BiLockAlt />}
        >
          Sign this petition
        </Button>
      )}
      {post?.status === PostStatus.Draft && !isPetitionOwner && (
        <Button
          onClick={onClick}
          bg="secondary.500"
          fontStyle={'subhead-1'}
          color="white"
          height="56px"
          width="300px"
          _hover={{
            background: 'secondary.400',
          }}
          disabled={isPetitionOwner}
          leftIcon={<BiPen />}
        >
          Endorse this petition
        </Button>
      )}
      {post?.status === PostStatus.Draft && isPetitionOwner && (
        <Button
          onClick={onEndorserModalOpen}
          bg="secondary.500"
          fontStyle={'subhead-1'}
          color="white"
          height="56px"
          width="300px"
          _hover={{
            background: 'secondary.400',
          }}
          leftIcon={<BiShareAlt />}
        >
          Share private link
        </Button>
      )}

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={onSubscriptionModalClose}
        onConfirm={onSubscriptionConfim}
      />
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={onSignatureModalClose}
        onConfirm={onSignatureConfirm}
        postTitle={post?.title ?? ''}
        useFullname={post?.status === PostStatus.Draft}
      />
      <EndorserModal
        isOpen={isEndorserModalOpen}
        onClose={onEndorserModalClose}
      />
    </>
  )
}

export default SignForm
