import { Box, Text, useMultiStyleConfig } from '@chakra-ui/react'
import { RichTextPreview } from '@/components/RichText/RichTextEditor.component'
const PostSection = ({
  post,
}: {
  post?: { reason: string; request: string }
}): JSX.Element => {
  const styles = useMultiStyleConfig('PostSection', {})
  return (
    <Box sx={styles.container}>
      {post?.reason && (
        <Box sx={styles.content}>
          <Text sx={styles.request}>
            What would you like the ministry to do?
          </Text>
          <RichTextPreview value={post.request} />
          <Text sx={styles.reason}>What is the reason for your petition?</Text>
          <RichTextPreview value={post.reason} />
        </Box>
      )}
    </Box>
  )
}

export default PostSection
