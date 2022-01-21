import { Spacer, Spinner } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { getApiErrorMessage } from '../../api/ApiClient'
import { useStyledToast } from '../../components/StyledToast/StyledToast'
import * as PostService from '../../services/PostService'
import FormFields, { FormSubmission } from './FormFields/FormFields.component'
import './PostForm.styles.scss'
import { useAuth } from '../../contexts/AuthContext'
import SgidButton from '../../components/SgidButton/SgidButton'
import {
  GET_ADDRESSEES_QUERY_KEY,
  getAddressees,
} from '../../services/AddresseeService'
import { useQuery } from 'react-query'

const PostForm = (): JSX.Element => {
  const { user, isLoading: isUserLoading } = useAuth()
  const toast = useStyledToast()
  const navigate = useNavigate()

  const onSubmit = async (data: FormSubmission) => {
    try {
      const { data: postId } = await PostService.createPost({
        title: data.postData.title,
        summary: data.postData.summary,
        reason: data.postData.reason,
        request: data.postData.request,
        references: '',
        addresseeId: data.postData.addressee.value,
        profile: data.postData.profile,
        email: data.postData.email,
      })
      toast({
        status: 'success',
        description: 'Your post has been created.',
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
  const isLoading = isUserLoading || isAddresseesLoading

  return isLoading ? (
    <Spinner />
  ) : user ? (
    <>
      <div className="post-form-container">
        <div className="post-form-content">
          <Spacer h={['64px', '64px', '84px']} />
          <div className="post-form-section">
            <div className="postform" style={{ width: '100%' }}>
              <FormFields
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

export default PostForm
