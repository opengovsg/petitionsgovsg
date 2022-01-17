import { RichTextPreview } from '../../../../components/RichText/RichTextEditor.component'
import './PostCell.styles.scss'

const PostCell = ({ post }: { post?: { title: string } }): JSX.Element => {
  return (
    <>
      <div className="post-cell">
        {post?.title && (
          <div className="post-text">
            <RichTextPreview value={post.title} />
          </div>
        )}
      </div>
    </>
  )
}

export default PostCell
