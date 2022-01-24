import { Button } from '@chakra-ui/react'
import {
  publishPost,
  GET_POST_BY_ID_QUERY_KEY,
} from '../../services/PostService'
import { useMutation, useQueryClient } from 'react-query'
import { useStyledToast } from '../StyledToast/StyledToast'
import { getApiErrorMessage } from '../../api'

interface PublishButtonProps {
  postId: string | undefined
}

const PublishButton = ({ postId }: PublishButtonProps): JSX.Element => {
  const toast = useStyledToast()

  const queryClient = useQueryClient()
  const publishPostMutation = useMutation(publishPost, {
    onSuccess: () => {
      queryClient.invalidateQueries([GET_POST_BY_ID_QUERY_KEY, postId])
      toast({
        status: 'success',
        description: 'Petition has been published publicly',
      })
    },
    onError: (err) => {
      toast({
        status: 'error',
        description: getApiErrorMessage(err),
      })
    },
  })

  const onPublishConfirm = () => publishPostMutation.mutate(Number(postId))

  return (
    <>
      <Button
        bg="white"
        color="primary.500"
        variant="outline"
        onClick={onPublishConfirm}
      >
        Submit petition
      </Button>
    </>
  )
}

export default PublishButton
