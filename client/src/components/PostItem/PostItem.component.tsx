import { Flex, Link, useMultiStyleConfig } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { BasePostDto } from '../../api'
import { useAuth } from '../../contexts/AuthContext'
import EditButton from '../EditButton/EditButton.component'

// Note: PostItem is the component for the homepage
const PostItem = ({
  post: { id },
}: {
  post: Pick<
    BasePostDto,
    'id' | 'title' | 'summary' | 'reason' | 'request' | 'references' | 'status'
  >
}): JSX.Element => {
  const { user } = useAuth()
  const styles = useMultiStyleConfig('PostItem', {})

  return (
    <Flex sx={styles.container}>
      {/* Title display area */}
      <Link as={RouterLink} to={`/questions/${id}`}></Link>
      {/* <Box sx={styles.description}>
            {description && <RichTextFrontPreview value={description} />}
          </Box> */}
      {user && (
        <Flex sx={styles.editWrapper}>
          <EditButton postId={id} />
        </Flex>
      )}
    </Flex>
  )
}

export default PostItem
