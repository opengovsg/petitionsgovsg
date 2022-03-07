import { Box, HStack, Text } from '@chakra-ui/react'
import { formatDistanceToNow } from 'date-fns'
import { Signature } from '~shared/types/base'

export const PostSignature = ({
  signature,
}: {
  signature: Pick<Signature, 'comment' | 'createdAt' | 'fullname' | 'id'>
}): JSX.Element => {
  return (
    <Box my="16px">
      <HStack h="24px" color="secondary.700" my="8px" fontWeight="500">
        <Text>
          {signature.fullname ?? 'anon'} •{' '}
          {formatDistanceToNow(new Date(signature.createdAt), {
            addSuffix: true,
          })}
        </Text>
      </HStack>
      <Text
        fontWeight="400"
        fontSize="16px"
        lineHeight="28px"
        color="secondary.400"
        minWidth="300px"
        noOfLines={2}
      >
        {signature.comment}
      </Text>
    </Box>
  )
}
