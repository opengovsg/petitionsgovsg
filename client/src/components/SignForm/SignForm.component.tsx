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
import * as SubscriptionService from '@/services/SubscriptionService'
import { SignatureModal } from '../SignatureModal/SignatureModal.component'
import { useStyledToast } from '../StyledToast/StyledToast'
import {
  SubscriptionFormValues,
  SubscriptionModal,
} from '../SubscriptionModal/SubscriptionModal.component'
import { useQuery } from 'react-query'
import { SignedModal } from '../SignedModal/SignedModal.component'

type FormValues = CreateSignatureReqDto

const SignForm = ({
  post,
  postId,
}: {
  post?: PostWithAddresseeAndSignatures
  postId: string | undefined
}): JSX.Element => {
  const toast = useStyledToast()
  const { user, logout } = useAuth()
  const [searchParams] = useSearchParams()
  const openSignatureModal = searchParams.has('sign')
  const { data: userSignature } = useQuery(
    [SignatureService.GET_USER_SIGNATURE_FOR_POST_QUERY_KEY, postId],
    () => SignatureService.getUserSignatureForPost(Number(postId)),
    { enabled: !!postId && !!user },
  )

  const refreshPage = async () => {
    window.location.reload()
  }

  // Event listener to clear user data when navigating away from the page
  useEffect(() => {
    window.addEventListener('beforeunload', logout)
    return () => window.removeEventListener('beforeunload', logout)
  }, [])

  // Event listener to refresh page when page is loaded using back/forward navigation
  useEffect(() => {
    if (
      window.performance?.getEntriesByType('navigation')[0].type ===
      'back_forward'
    ) {
      refreshPage()
    }
  }, [])

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

  const onSubscriptionConfirm: SubmitHandler<SubscriptionFormValues> = async ({
    email,
  }: SubscriptionFormValues): Promise<void> => {
    await SubscriptionService.createSubscription(Number(postId), {
      email: email,
    })
    toast({
      status: 'success',
      description: 'You have successfully subscribed to this petition!',
    })
  }

  const onSignatureModalCloseAndLogout = () => {
    onSignatureModalClose()
    logout()
  }

  const onSubscriptionModalCloseAndLogout = () => {
    onSubscriptionModalClose()
    logout()
  }

  // Init Signed Modal
  const {
    onOpen: onSignedModalOpen,
    onClose: onSignedModalClose,
    isOpen: isSignedModalOpen,
  } = useDisclosure()

  // Open signed modal if user is logged in and user has signed
  useEffect(() => {
    if (user && userSignature) {
      onSignedModalOpen()
    }
  }, [user, userSignature])

  // Open signature modal if user is logged in and user has not signed
  useEffect(() => {
    if (openSignatureModal && user && !userSignature) {
      onSignatureModalOpen()
    }
  }, [user, userSignature])

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
        onClose={onSubscriptionModalCloseAndLogout}
        onConfirm={onSubscriptionConfirm}
      />
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onNext={onSignatureModalClose}
        onClose={onSignatureModalCloseAndLogout}
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
      <SignedModal isOpen={isSignedModalOpen} onClose={onSignedModalClose} />
    </>
  )
}

export default SignForm
