import { Button, useDisclosure } from '@chakra-ui/react'
import { SubmitHandler } from 'react-hook-form'
import { CreateSignatureReqDto, GetSinglePostDto } from '../../api'
import * as SignatureService from '../../services/SignatureService'
import { SignatureModal } from '../SignatureModal/SignatureModal.component'
import {
  SubscriptionModal,
  SubscriptionFormValues,
} from '../SubscriptionModal/SubscriptionModal.component'
import { PreSignModal } from '../../components/PreSignModal/PreSignModal.component'
import { useStyledToast } from '../StyledToast/StyledToast'
import { PostStatus } from '~shared/types/base'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { BiLockAlt, BiPen } from 'react-icons/bi'

type FormValues = CreateSignatureReqDto
const refreshPage = async () => window.location.reload()

const SignForm = ({
  post,
  postId,
}: {
  post: GetSinglePostDto | undefined
  postId: string | undefined
}): JSX.Element => {
  const toast = useStyledToast()

  const [searchParams] = useSearchParams()
  const openSignatureModal = searchParams.has('sign')

  // Init PreSignModal
  const {
    onOpen: onPreSignModalOpen,
    onClose: onPreSignModalClose,
    isOpen: isPreSignModalOpen,
  } = useDisclosure()

  const onPreSignModalClick = async () => {
    onPreSignModalOpen()
  }

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
    onPreSignModalClose()
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

  useEffect(() => {
    if (openSignatureModal) {
      onSignatureModalOpen()
    }
  }, [])

  return (
    <>
      <Button
        backgroundColor="secondary.500"
        _hover={{
          background: 'secondary.400',
        }}
        w="300px"
        h="56px"
        borderRadius="4px"
        color="white"
        onClick={onPreSignModalClick}
        leftIcon={post?.status === PostStatus.Draft ? <BiPen /> : <BiLockAlt />}
      >
        {post?.status === PostStatus.Draft
          ? `Endorse this petition`
          : `Sign this petition`}
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
        postTitle={post?.title ?? ''}
        useFullname={post?.status === PostStatus.Draft}
      />
      <PreSignModal
        isOpen={isPreSignModalOpen}
        onClose={onPreSignModalClose}
        onNext={onClick}
        isEndorser={post?.status === PostStatus.Draft}
        petitionOwner={post?.fullname || ''}
        post={post}
        postId={postId}
      />
    </>
  )
}

export default SignForm
