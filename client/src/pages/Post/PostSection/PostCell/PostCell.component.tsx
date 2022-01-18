import { RichTextPreview } from '../../../../components/RichText/RichTextEditor.component'
import './PostCell.styles.scss'

const PostCell = ({
  post,
}: {
  post?: { reason: string | null; request: string | null }
}): JSX.Element => {
  return (
    <>
      <div className="post-cell">
        {post?.reason && (
          <div className="post-text">
            <RichTextPreview value={post.reason} />
          </div>
        )}
      </div>
    </>
  )
}

export default PostCell
