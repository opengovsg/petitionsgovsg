import { Spacer, Spinner } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { getApiErrorMessage } from '../../api/ApiClient'
import { useStyledToast } from '../../components/StyledToast/StyledToast'
import * as PostService from '../../services/PostService'
import FormFields, {
  FormSubmission,
} from '../PostForm/FormFields/FormFields.component'
import '../PostForm/PostForm.styles.scss'
import { useAuth } from '../../contexts/AuthContext'
import SgidButton from '../../components/SgidButton/SgidButton.component'
import {
  GET_ADDRESSEES_QUERY_KEY,
  getAddressees,
} from '../../services/AddresseeService'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import {
  getPostById,
  GET_POST_BY_ID_QUERY_KEY,
  LIST_POSTS_QUERY_KEY,
} from '../../services/PostService'
import {
  verifyPetitionOwner,
  VERIFY_PETITION_OWNER,
} from '../../services/AuthService'

const EditPostForm = (): JSX.Element => {
  const { user, isLoading: isUserLoading } = useAuth()
  const queryclient = useQueryClient()
  const toast = useStyledToast()
  const navigate = useNavigate()
  const { id: postId } = useParams()
  const getPostQueryKey = useMemo(
    () => [GET_POST_BY_ID_QUERY_KEY, postId],
    [postId],
  )
  const { isLoading: isPostLoading, data: post } = useQuery(
    [GET_POST_BY_ID_QUERY_KEY, postId],
    () => getPostById(Number(postId)),
    { enabled: !!postId },
  )

  const { isLoading: isPetitionOwnerLoading, data: petitionOwner } = useQuery(
    [VERIFY_PETITION_OWNER, postId],
    () => verifyPetitionOwner(Number(postId)),
    { enabled: !!postId && !!user },
  )

  if (!petitionOwner) {
    return <Navigate replace to="/" />
  } else {
    const updatePost = async (data: FormSubmission) => {
      await PostService.updatePost(Number(postId), {
        title: data.postData.title,
        summary: data.postData.summary,
        reason: data.postData.reason,
        request: data.postData.request,
        references: '',
        addresseeId: data.postData.addressee.value,
        profile: data.postData.profile,
        email: data.postData.email,
      })
    }

    const updatePostMutation = useMutation(updatePost, {
      onSuccess: () => {
        queryclient.invalidateQueries(getPostQueryKey)
        queryclient.invalidateQueries(LIST_POSTS_QUERY_KEY)
      },
    })

    const onSubmit = async (data: FormSubmission) => {
      try {
        await updatePostMutation.mutateAsync(data)
        toast({
          status: 'success',
          description: 'Your petition has been updated.',
        })
        navigate(`/posts/${postId}`, { replace: true })
      } catch (err) {
        toast({
          status: 'error',
          description: getApiErrorMessage(err),
        })
      }
    }
    const { isLoading: isAddresseesLoading, data: addresseeData } = useQuery(
      GET_ADDRESSEES_QUERY_KEY,
      () => getAddressees(),
      {
        staleTime: Infinity,
      },
    )
    const isLoading =
      isUserLoading ||
      isAddresseesLoading ||
      isPostLoading ||
      isPetitionOwnerLoading

    return isLoading && post ? (
      <Spinner />
    ) : user ? (
      <>
        <div className="post-form-container">
          <div className="post-form-content">
            <Spacer h={['64px', '64px', '84px']} />
            <div className="post-form-section">
              <div className="postform" style={{ width: '100%' }}>
                <FormFields
                  inputPostData={{
                    email: post?.email ?? '',
                    profile: post?.profile ?? '',
                    title: post?.title ?? '',
                    reason: post?.reason ?? '',
                    request: post?.request ?? '',
                    summary: post?.summary ?? '',
                    addressee: {
                      value: post?.addresseeId ?? 0,
                      label: '',
                    },
                  }}
                  addresseeOptions={addresseeData ?? []}
                  onSubmit={onSubmit}
                  submitButtonText="Save &amp; Preview"
                />
              </div>
            </div>
          </div>
        </div>
        <Spacer minH={20} />
      </>
    ) : (
      <SgidButton text="Login using SingPass App" redirect="/create" />
    )
  }
}

export default EditPostForm
