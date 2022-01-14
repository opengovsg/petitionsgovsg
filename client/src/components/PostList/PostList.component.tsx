import { Text } from '@chakra-ui/react'
import { BasePostDto } from '../../api'
import PostItem from '../PostItem/PostItem.component'

const PostList = ({
  posts,
  defaultText,
}: {
  posts?: BasePostDto[]
  defaultText?: string
}): JSX.Element => {
  defaultText = defaultText ?? 'There are no posts to display.'

  return (
    <div className="post-list">
      {posts && posts.length > 0 ? (
        <div className="questions">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <Text color="secondary.800" textStyle="h4" py={4}>
          {defaultText}
        </Text>
      )}
    </div>
  )
}

export default PostList
