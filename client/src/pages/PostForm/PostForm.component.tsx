import { Spacer, Spinner } from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getApiErrorMessage } from '../../api/ApiClient'
import { useStyledToast } from '../../components/StyledToast/StyledToast'
import * as PostService from '../../services/PostService'
import FormFields, { FormSubmission } from './FormFields/FormFields.component'
import './PostForm.styles.scss'
import { useAuth } from '../../contexts/AuthContext'
import {
  GET_ADDRESSEES_QUERY_KEY,
  getAddressees,
} from '../../services/AddresseeService'
import { useQuery } from 'react-query'
import { Navigate } from 'react-router-dom'

const PostForm = (): JSX.Element => {
  const { user, isLoading: isUserLoading } = useAuth()
  const toast = useStyledToast()
  const navigate = useNavigate()
  const location = useLocation()

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
        description: 'Your petition has been created.',
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
    <Navigate
      to={
        process.env.NODE_ENV === 'production'
          ? (window.location.href = `${process.env.PUBLIC_URL}/api/v1/auth/sgid/login?redirect=${location.pathname}`)
          : (window.location.href = `http://localhost:6174/api/v1/auth/sgid/login?redirect=${location.pathname}`)
      }
    />
  )
}
export default PostForm
