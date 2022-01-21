import { filterSignaturesWithComments } from '../../services/SignatureService'
import { GetSinglePostDto } from '../../api'
import { PostSignature } from './PostSignature.component'

export const PostSignatures = ({
  post,
}: {
  post: GetSinglePostDto | undefined
}): JSX.Element => {
  const signatures = filterSignaturesWithComments(post?.signatures ?? [])

  return (
    <>
      {signatures.map((signature) => (
        <PostSignature signature={signature} />
      ))}
    </>
  )
}
