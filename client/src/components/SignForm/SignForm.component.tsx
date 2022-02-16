import { Button, useDisclosure } from '@chakra-ui/react'
import { useEffect } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { BiLockAlt, BiPen } from 'react-icons/bi'
import { useSearchParams } from 'react-router-dom'
import {
  CreateSignatureReqDto,
  PostWithAddresseeAndSignatures,
} from '~shared/types/api'
import { PostStatus } from '~shared/types/base'
import { PreSignModal } from '@/components/PreSignModal/PreSignModal.component'
import { useAuth } from '@/contexts/AuthContext'
import * as SignatureService from '@/services/SignatureService'
import { SignatureModal } from '../SignatureModal/SignatureModal.component'
import { useStyledToast } from '../StyledToast/StyledToast'
import {
  SubscriptionFormValues,
  SubscriptionModal,
} from '../SubscriptionModal/SubscriptionModal.component'

type FormValues = CreateSignatureReqDto
const refreshPage = async () => window.location.reload()

const SignForm = ({
  post,
  postId,
}: {
  post?: PostWithAddresseeAndSignatures
  postId: string | undefined
}): JSX.Element => {
  const toast = useStyledToast()
  const { user } = useAuth()
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
    if (openSignatureModal && user) {
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
        alignSelf="center"
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
        isEndorser={post?.status === PostStatus.Draft}
        petitionOwner={post?.fullname || ''}
        post={post}
        postId={postId}
      />
    </>
  )
}

export default SignForm
