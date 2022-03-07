import { Text } from '@chakra-ui/react'
import { PostWithAddresseeAndSignatures } from '~shared/types/api'
import { filterSignaturesWithComments } from '@/services/SignatureService'
import { PostSignature } from './PostSignature.component'

export const PostSignatures = ({
  post,
}: {
  post?: PostWithAddresseeAndSignatures
}): JSX.Element => {
  const signatures = filterSignaturesWithComments(post?.signatures ?? [])
  const showAllComments = signatures
    .reverse()
    .slice(0, 10)
    .map((signature) => (
      <PostSignature signature={signature} key={signature.id} />
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
