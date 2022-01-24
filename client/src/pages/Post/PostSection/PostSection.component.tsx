import { Box } from '@chakra-ui/react'
import PostCell from './PostCell/PostCell.component'

const PostSection = ({
  post,
}: {
  post?: { reason: string; request: string }
}): JSX.Element => {
  return (
    <>
      <Box
        className="post"
        display="grid"
        my="16px"
        gridTemplateColumns="max-content 1fr"
        color="neutral.900"
      >
        <PostCell post={post} />
      </Box>
    </>
  )
}

export default PostSection
