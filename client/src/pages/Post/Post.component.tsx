import {
  Box,
  Badge,
  Center,
  Flex,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/layout'
import { useMultiStyleConfig } from '@chakra-ui/system'
import { format, utcToZonedTime } from 'date-fns-tz'
import { useQuery } from 'react-query'
import { Link, useLocation, useParams } from 'react-router-dom'
import { PostStatus } from '~shared/types/base'
import PageTitle from '../../components/PageTitle/PageTitle.component'
import Spinner from '../../components/Spinner/Spinner.component'
import {
  getPostById,
  GET_POST_BY_ID_QUERY_KEY,
} from '../../services/PostService'
import {
  getUserSignatureForPost,
  GET_USER_SIGNATURE_FOR_POST_QUERY_KEY,
} from '../../services/SignatureService'
import { useAuth } from '../../contexts/AuthContext'
import PostSection from './PostSection/PostSection.component'
import {
  SgidButtonWithLock,
  SgidButtonWithPen,
} from '../../components/SgidButton/SgidButton.component'
import SignForm from '../../components/SignForm/SignForm.component'
import { PreviewBanner } from '../../components/PreviewBanner/PreviewBanner.component'
import { PostSignatures } from '../../components/PostSignatures/PostSignatures.component'
import { Button, useDisclosure } from '@chakra-ui/react'
import { BiShareAlt } from 'react-icons/bi'
import {
  SubscriptionModal,
  SubscriptionFormValues,
} from '../../components/SubscriptionModal/SubscriptionModal.component'
import { SubmitHandler } from 'react-hook-form'
import { InfoBox } from '../../components/InfoBox/InfoBox.component'
import { replaceRichTextTag } from '../../components/PetitionCard/PetitionCard.component'
import { SuccessBanner } from '../../components/SuccessBanner/SuccessBanner.component'
import {
  verifyPetitionOwner,
  VERIFY_PETITION_OWNER,
} from '../../services/AuthService'
import { GetSinglePostDto } from '../../api'

const Post = (): JSX.Element => {
  // Does not need to handle logic when public post with id postId is not found because this is handled by server
  const { id: postId } = useParams()
  const { isLoading: isPostLoading, data: post } = useQuery(
    [GET_POST_BY_ID_QUERY_KEY, postId],
    () => getPostById(Number(postId)),
    { enabled: !!postId },
  )

  const status = post?.status
  const styles = useMultiStyleConfig('Post', { status })
  const location = useLocation()

  // If user is signed in, don't need to resign in through SP app
  const { user, isLoading: isUserLoading } = useAuth()

  const { isLoading: isPetitionOwnerLoading, data: isPetitionOwner } = useQuery(
    [VERIFY_PETITION_OWNER, postId],
    () => verifyPetitionOwner(Number(postId)),
    { enabled: !!postId && !!user },
  )

  const { isLoading: isSignatureLoading, data: userSignature } = useQuery(
    [GET_USER_SIGNATURE_FOR_POST_QUERY_KEY, postId],
    () => getUserSignatureForPost(Number(postId)),
    { enabled: !!postId && !!user },
  )

  const formattedTimeString = format(
    utcToZonedTime(post?.updatedAt ?? Date.now(), 'Asia/Singapore'),
    'dd MMM yyyy HH:mm, zzzz',
  )

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
  }

  const onClick = async () => {
    onSubscriptionModalOpen()
  }

  const showRecentActivity = (post: GetSinglePostDto | undefined) => {
    // Clone signatures into a new array
    const signatures = [...(post?.signatures ?? [])]
    return (
      <>
        <Text sx={styles.signatureHeader}>Recent Activity</Text>
        {signatures
          .reverse()
          .slice(0, 10)
          .map((signature) => (
            <Box>
              <Text sx={styles.signature}>
                {signature.fullname ?? 'Anonymous'} signed this petition
              </Text>
            </Box>
          ))}

        <Text sx={styles.signature}>
          {post?.fullname} created this petition
        </Text>
      </>
    )
  }
  const isLoading =
    isPostLoading ||
    isSignatureLoading ||
    isUserLoading ||
    isPetitionOwnerLoading

  return isLoading ? (
    <Spinner centerHeight={`${styles.spinner.height}`} />
  ) : (
    <Flex direction="column" sx={styles.container}>
      {post?.status === PostStatus.Draft && (
        <PreviewBanner isPetitionOwner={isPetitionOwner} post={post} />
      )}
      {post?.status === PostStatus.Open && (
        <SuccessBanner isPetitionOwner={isPetitionOwner} />
      )}
      <PageTitle title={`${post?.title} Petitions`} description="" />
      <Center>
        <Stack
          spacing={{ base: '20px', lg: '88px' }}
          direction={{ base: 'column', lg: 'row' }}
          sx={styles.content}
        >
          <Box className="post-page">
            <Text sx={styles.title}>{post?.title}</Text>
            {post ? (
              <Box sx={styles.subtitle} className="subtitle-bar" my="12px">
                <Box my="4px" fontWeight="500">
                  Started by{' '}
                  <Text as="span" textDecoration="underline" textStyle="">
                    {post?.fullname}
                  </Text>
                </Box>
                <Box my="4px" fontWeight="500">
                  Addressed to the{' '}
                  <Text as="span" textDecoration="underline">
                    {post?.addressee.name} ({post.addressee.shortName})
                  </Text>
                </Box>
                <Badge sx={styles.badge}>
                  {post?.status === PostStatus.Draft
                    ? `Created, pending endorsers`
                    : `Open for signatures`}
                </Badge>
              </Box>
            ) : null}
            {post?.summary && (
              <InfoBox>
                <Text>{replaceRichTextTag(post.summary)}</Text>
              </InfoBox>
            )}
            <PostSection post={post} />
            <Box sx={styles.lastUpdated}>
              <time dateTime={formattedTimeString}>
                Last updated {formattedTimeString}
              </time>
            </Box>
            <Text sx={styles.header}>Updates</Text>
            <InfoBox>
              <Text>
                The petition has to reach 10000 signatures for a ministry
                response.
              </Text>
            </InfoBox>
            <PostSignatures post={post} />
          </Box>
          <Stack sx={styles.sideSection} align="left">
            <Box my="8px">
              <Text sx={styles.numberHeading}>{post?.signatureCount}</Text>
              <Text sx={styles.numberSubHeading}>
                have signed this petition
              </Text>
            </Box>
            {post?.status === PostStatus.Draft && (
              <Center py="8px">
                {!user && (
                  <SgidButtonWithPen
                    text="Endorse this petition"
                    redirect={`${location.pathname}?sign`}
                  />
                )}
                {user && !userSignature && (
                  <SignForm
                    post={post}
                    postId={postId}
                    isPetitionOwner={Boolean(isPetitionOwner)}
                  />
                )}
                {user && userSignature && (
                  <Center sx={styles.signed}>
                    You have signed this petition.
                  </Center>
                )}
              </Center>
            )}
            {post?.status === PostStatus.Open && (
              <Center py="8px">
                {!user && (
                  <SgidButtonWithLock
                    text="Sign this petition"
                    redirect={`${location.pathname}?sign`}
                  />
                )}
                {user && !userSignature && (
                  <SignForm
                    post={post}
                    postId={postId}
                    isPetitionOwner={Boolean(isPetitionOwner)}
                  />
                )}
                {user && userSignature && (
                  <Center sx={styles.signed}>
                    You have signed this petition.
                  </Center>
                )}
              </Center>
            )}
            {!userSignature && (
              <Text sx={styles.caption}>
                Proceed securely with Singpass. By signing, you accept the{' '}
                <Link to="/terms" style={{ textDecoration: 'underline' }}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" style={{ textDecoration: 'underline' }}>
                  Privacy Policy
                </Link>
              </Text>
            )}
            <Center py="8px">
              <Button
                onClick={onClick}
                fontStyle={'subhead-1'}
                color="secondary.500"
                height="56px"
                width="300px"
                borderRadius="4px"
                borderColor="secondary.500"
                variant="outline"
                leftIcon={<BiShareAlt />}
                disabled={post?.status === PostStatus.Draft}
              >
                Share this petition
              </Button>
            </Center>
            <SubscriptionModal
              isOpen={isSubscriptionModalOpen}
              onClose={onSubscriptionModalClose}
              onConfirm={onSubscriptionConfim}
            />
            {showRecentActivity(post)}
          </Stack>
        </Stack>
      </Center>
      <Spacer />
    </Flex>
  )
}

export default Post
