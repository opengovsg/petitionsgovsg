import { Box, Spacer, Spinner, useMultiStyleConfig } from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getApiErrorMessage } from '@/api/ApiClient'
import { useStyledToast } from '@/components/StyledToast/StyledToast'
import * as PostService from '../../services/PostService'
import FormFields, { FormSubmission } from './FormFields/FormFields.component'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_ADDRESSEES_QUERY_KEY,
  getAddressees,
} from '../../services/AddresseeService'
import { useQuery } from 'react-query'
import { Navigate } from 'react-router-dom'
import { SGID_REDIRECT_URI } from '@/api/Sgid'

const PostForm = (): JSX.Element => {
  const { user, isLoading: isUserLoading } = useAuth()
  const styles = useMultiStyleConfig('PostForm', {})
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
      <Box sx={styles.container}>
        <Box sx={styles.content}>
          <Spacer h={['64px', '64px', '84px']} />
          <Box sx={styles.section}>
            <Box sx={styles.form}>
              <FormFields
                addresseeOptions={addresseeData ?? []}
                onSubmit={onSubmit}
                submitButtonText="Save &amp; Preview"
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Spacer minH={20} />
    </>
  ) : (
    <Navigate
      to={
        (window.location.href = `${SGID_REDIRECT_URI}?redirect=${location.pathname}`)
      }
    />
  )
}
export default PostForm
