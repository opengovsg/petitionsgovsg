import PostCell from './PostCell/PostCell.component'

import './PostSection.styles.scss'

const PostSection = ({
  post,
}: {
  post?: { reason: string; request: string }
}): JSX.Element => {
  return (
    <>
      <div className="question">
        <div className="post-layout">
          <PostCell post={post} />
        </div>
      </div>
    </>
  )
}

export default PostSection
