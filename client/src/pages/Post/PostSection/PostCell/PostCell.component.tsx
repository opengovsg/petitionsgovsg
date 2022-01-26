import { Text } from '@chakra-ui/react'
import { RichTextPreview } from '../../../../components/RichText/RichTextEditor.component'
import './PostCell.styles.scss'

const PostCell = ({
  post,
}: {
  post?: { reason: string; request: string }
}): JSX.Element => {
  return (
    <>
      <div className="post-cell">
        {post?.reason && (
          <div className="post-text">
            <Text textStyle="h2" color="secondary.800" mb="16px">
              What would you like the ministry to do?
            </Text>
            <RichTextPreview value={post.request} />
            <Text textStyle="h2" color="secondary.800" mt="32px" mb="16px">
              What is the reason for your petition?
            </Text>
            <RichTextPreview value={post.reason} />
          </div>
        )}
      </div>
    </>
  )
}

export default PostCell
