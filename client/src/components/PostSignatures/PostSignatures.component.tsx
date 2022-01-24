import { filterSignaturesWithComments } from '../../services/SignatureService'
import { GetSinglePostDto } from '../../api'
import { PostSignature } from './PostSignature.component'
import { Text } from '@chakra-ui/react'

export const PostSignatures = ({
  post,
}: {
  post: GetSinglePostDto | undefined
}): JSX.Element => {
  const signatures = filterSignaturesWithComments(post?.signatures ?? [])
  const showAllComments = signatures.map((signature) => (
    <PostSignature signature={signature} />
  ))

  return (
    <>
      {signatures.length > 0 && (
        <Text
          mt={{ base: '32px', sm: '48px' }}
          textStyle="h2"
          color="secondary.800"
        >
          Reasons for signing
        </Text>
      )}
      {showAllComments}
    </>
  )
}
