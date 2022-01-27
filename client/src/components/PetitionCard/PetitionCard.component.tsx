import {
  Flex,
  Box,
  Text,
  Badge,
  Button,
  useMultiStyleConfig,
  Divider,
} from '@chakra-ui/react'
import { GetSinglePostDto } from '../../api'
import { useNavigate } from 'react-router-dom'
import { PostStatus } from '~shared/types/base'
import { getDateDistance } from '../../util/date'
import { Link as RouterLink } from 'react-router-dom'

export const replaceRichTextTag = (value: string): string =>
  value.replace(/(<p[^>]+?>|<p>|<\/p>)/gim, '')

const PetitionCard = ({
  post: { id, title, request, status, fullname, signatureCount, createdAt },
}: {
  post: Pick<
    GetSinglePostDto,
    | 'id'
    | 'title'
    | 'request'
    | 'status'
    | 'fullname'
    | 'signatureCount'
    | 'createdAt'
  >
}): JSX.Element => {
  // const { user } = useAuth()
  const styles = useMultiStyleConfig('PetitionCard', { status })
  const navigate = useNavigate()

  const cleanedRequest = replaceRichTextTag(request)

  return (
    <RouterLink to={`posts/${id}`}>
      <Box sx={styles.card}>
        <Box sx={styles.topcard}>
          <Text sx={styles.title}>{title}</Text>
          <Text sx={styles.request}>{cleanedRequest}</Text>
          <Text sx={styles.creator}>Created by {fullname}</Text>
          <Badge sx={styles.badge}>
            {status === PostStatus.Draft
              ? `Created, pending endorsers`
              : `Open for signatures`}
          </Badge>
        </Box>
        <Divider sx={styles.divider} />
        <Flex justifyContent="space-between" flexWrap="wrap">
          <Box>
            <Text sx={styles.signatureCount}>{signatureCount} signed</Text>
            <Text sx={styles.duration}>{getDateDistance(createdAt)} to go</Text>
          </Box>
          <Button
            sx={styles.signButton}
            onClick={() => {
              navigate(`posts/${id}`)
            }}
          >
            Sign petition
          </Button>
        </Flex>
      </Box>
    </RouterLink>
  )
}

export default PetitionCard
