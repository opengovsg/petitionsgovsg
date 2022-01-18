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
import { useRef } from 'react'
import { BiXCircle } from 'react-icons/bi'
import { useQuery } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import { PostStatus } from '~shared/types/base'
import EditButton from '../../components/EditButton/EditButton.component'
import { NavBreadcrumb } from '../../components/NavBreadcrumb/NavBreadcrumb'
import PageTitle from '../../components/PageTitle/PageTitle.component'
import Spinner from '../../components/Spinner/Spinner.component'
import {
  getPostById,
  GET_POST_BY_ID_QUERY_KEY,
} from '../../services/PostService'
import { useAuth } from '../../contexts/AuthContext'

const Post = (): JSX.Element => {
  const styles = useMultiStyleConfig('Post', {})
  // Does not need to handle logic when public post with id postId is not found because this is handled by server
  const { id: postId } = useParams()
  const { isLoading: isPostLoading, data: post } = useQuery(
    [GET_POST_BY_ID_QUERY_KEY, postId],
    () => getPostById(Number(postId), 3),
    { enabled: !!postId },
  )

  // User can edit if it is authenticated whose agency tags intersect with
  // those found on posts
  const { user } = useAuth()

  const formattedTimeString = format(
    utcToZonedTime(post?.updatedAt ?? Date.now(), 'Asia/Singapore'),
    'dd MMM yyyy HH:mm, zzzz',
  )

  const breadcrumbContentRef = useRef<{ text: string; link: string }[]>([])

  const isLoading = isPostLoading

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
            <Flex align="center">
              <Flex sx={styles.breadcrumb}>
                {breadcrumbContentRef.current.length > 0 ? (
                  <NavBreadcrumb navOrder={breadcrumbContentRef.current} />
                ) : null}
              </Flex>
              <Spacer />
              {user && (
                <EditButton postId={Number(postId)} onDeleteLink={`/agency`} />
              )}
            </Flex>
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
            <Box sx={styles.lastUpdated}>
              <time dateTime={formattedTimeString}>
                Last updated {formattedTimeString}
              </time>
            </Box>
          </Box>
          <VStack sx={styles.relatedSection} align="left"></VStack>
        </Stack>
      </Center>
      <Spacer />
    </Flex>
  )
}

export default Post
