import {
  Box,
  Center,
  Flex,
  Spacer,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/layout'
import { useMultiStyleConfig } from '@chakra-ui/system'
import { format, utcToZonedTime } from 'date-fns-tz'
import { BiXCircle } from 'react-icons/bi'
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

const Post = (): JSX.Element => {
  const styles = useMultiStyleConfig('Post', {})
  // Does not need to handle logic when public post with id postId is not found because this is handled by server
  const { id: postId } = useParams()
  const { isLoading: isPostLoading, data: post } = useQuery(
    [GET_POST_BY_ID_QUERY_KEY, postId],
    () => getPostById(Number(postId)),
    { enabled: !!postId },
  )

  const location = useLocation()

  // If user is signed in, don't need to resign in through SP app
  const { user } = useAuth()

  const { isLoading: isSignatureLoading, data: userSignature } = useQuery(
    [GET_USER_SIGNATURE_FOR_POST_QUERY_KEY, postId],
    () => getUserSignatureForPost(Number(postId)),
    { enabled: !!postId && !!user },
  )

  const formattedTimeString = format(
    utcToZonedTime(post?.updatedAt ?? Date.now(), 'Asia/Singapore'),
    'dd MMM yyyy HH:mm, zzzz',
  )

  const isLoading = isPostLoading || isSignatureLoading

  return isLoading ? (
    <Spinner centerHeight={`${styles.spinner.height}`} />
  ) : (
    <Flex direction="column" sx={styles.container}>
      <PageTitle title={`${post?.title} Petitions`} description="" />
      <Center>
        <Stack
          spacing={{ base: '20px', lg: '88px' }}
          direction={{ base: 'column', lg: 'row' }}
          sx={styles.content}
        >
          <Box className="post-page">
            <Text sx={styles.title}>{post?.title}</Text>
            {post?.status === PostStatus.Closed ? (
              <Box sx={styles.subtitle} className="subtitle-bar">
                <Flex sx={styles.private}>
                  <BiXCircle
                    style={{
                      marginRight: `${styles.privateIcon.marginRight}`,
                      color: `${styles.privateIcon.color}`,
                    }}
                    size={`${styles.privateIcon.fontSize}`}
                  />
                  <Box as="span">
                    This question remains private until an answer is posted.
                  </Box>
                </Flex>
              </Box>
            ) : null}
            <PostSection post={post} />
            <Box sx={styles.lastUpdated}>
              <time dateTime={formattedTimeString}>
                Last updated {formattedTimeString}
              </time>
            </Box>
          </Box>
          <VStack sx={styles.relatedSection} align="left">
            <Text sx={styles.relatedHeading}>{post?.signatureCount}</Text>
            <Text>have signed this petition</Text>
            <Center>
              {!user && (
                <SgidButton
                  text="Sign this petition"
                  redirect={location.pathname}
                />
              )}
              {user && !userSignature && <SignForm postId={postId} />}
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
            {post?.signatures.map((signature) => (
              <Box>
                <Text> {signature.fullname ?? 'anon'} has signed</Text>
              </Box>
            ))}
          </VStack>
        </Stack>
      </Center>
      <Spacer />
    </Flex>
  )
}

export default Post
