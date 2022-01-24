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
import SgidButton from '../../components/SgidButton/SgidButton'
import SignForm from '../../components/SignForm/SignForm.component'
import { PreviewBanner } from '../../components/PreviewBanner/PreviewBanner.component'
import { PostSignatures } from '../../components/PostSignatures/PostSignatures.component'
import { Button, useDisclosure } from '@chakra-ui/react'
import { BiShareAlt } from 'react-icons/bi'
import {
  SubscriptionModal,
  SusbcriptionFormValues,
} from '../../components/SubscriptionModal/SubscriptionModal.component'
import { SubmitHandler } from 'react-hook-form'
import { InfoBox } from '../../components/InfoBox/InfoBox.component'

const Post = (): JSX.Element => {
  // Does not need to handle logic when public post with id postId is not found because this is handled by server
  const { id: postId } = useParams()
  const { isLoading: isPostLoading, data: post } = useQuery(
    [GET_POST_BY_ID_QUERY_KEY, postId],
    () => getPostById(Number(postId)),
    { enabled: !!postId },
  )
  const styles = useMultiStyleConfig('Post', {})
  const location = useLocation()

  // If user is signed in, don't need to resign in through SP app
  const { user, isLoading: isUserLoading } = useAuth()

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

  const onSubscriptionConfim: SubmitHandler<SusbcriptionFormValues> = async ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    email,
  }: SusbcriptionFormValues): Promise<void> => {
    //TODO: Implement subscription
  }

  const onClick = async () => {
    onSubscriptionModalOpen()
  }

  const isLoading = isPostLoading || isSignatureLoading || isUserLoading

  return isLoading ? (
    <Spinner centerHeight={`${styles.spinner.height}`} />
  ) : (
    <Flex direction="column" sx={styles.container}>
      {post?.status === PostStatus.Draft && <PreviewBanner />}
      <PageTitle title={`${post?.title} Petitions`} description="" />
      <Center>
        <Stack
          spacing={{ base: '20px', lg: '88px' }}
          direction={{ base: 'column', lg: 'row' }}
          sx={styles.content}
        >
          <Box className="post-page">
            <Text sx={styles.title}>{post?.title}</Text>
            {post?.status === PostStatus.Open ? (
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
                <Badge sx={styles.badge}>In review</Badge>
              </Box>
            ) : null}
            {post?.summary && (
              <InfoBox>
                <Text>{post.summary}</Text>
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
                The ministry is reviewing this petition. Please subscribe for
                updates.
              </Text>
            </InfoBox>
            <Text sx={styles.header}>Reasons for signing</Text>
            <PostSignatures post={post} />
          </Box>
          <Stack sx={styles.sideSection} align="left">
            <Box my="8px">
              <Text sx={styles.numberHeading}>{post?.signatureCount}</Text>
              <Text sx={styles.numberSubHeading}>
                have signed this petition
              </Text>
            </Box>
            <Center py="8px">
              {!user && (
                <SgidButton
                  text="Sign this petition"
                  redirect={location.pathname}
                />
              )}
              {user && !userSignature && (
                <SignForm postId={postId} postTitle={post?.title ?? ''} />
              )}
              {user && userSignature && (
                <Center sx={styles.signed}>
                  You have signed this petition.
                </Center>
              )}
            </Center>
            {!userSignature && (
              <Text sx={styles.caption}>
                By signing, you accept the{' '}
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
                height="48px"
                width="300px"
                borderColor="secondary.500"
                variant="outline"
                leftIcon={<BiShareAlt />}
              >
                Share this petition
              </Button>
            </Center>
            <SubscriptionModal
              isOpen={isSubscriptionModalOpen}
              onClose={onSubscriptionModalClose}
              onConfirm={onSubscriptionConfim}
            />
            <Text sx={styles.signatureHeader}>Recent Activity</Text>
            {post?.signatures.map((signature) => (
              <Box>
                <Text sx={styles.signature}>
                  {signature.fullname ?? 'Anonymous'} signed this petition
                </Text>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Center>
      <Spacer />
    </Flex>
  )
}

export default Post
