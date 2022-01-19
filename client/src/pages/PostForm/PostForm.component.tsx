import { Spacer } from '@chakra-ui/react'
import { Fragment } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { getApiErrorMessage } from '../../api/ApiClient'
import { useStyledToast } from '../../components/StyledToast/StyledToast'
import * as PostService from '../../services/PostService'
import AskForm, { FormSubmission } from './FormFields/FormFields.component'
import './PostForm.styles.scss'
import { useAuth } from '../../contexts/AuthContext'

const PostForm = (): JSX.Element => {
  const { user } = useAuth()
  const toast = useStyledToast()
  const navigate = useNavigate()
  if (!user) {
    return <Navigate replace to="/login" />
  } else {
    // const { isLoading, data: topicData } = useQuery(
    //   GET_TOPICS_USED_BY_AGENCY_QUERY_KEY,
    //   () => getTopicsUsedByAgency(user.agencyId),
    //   {
    //     staleTime: Infinity,
    //   },
    // )
    const onSubmit = async (data: FormSubmission) => {
      try {
        const { data: postId } = await PostService.createPost({
          title: data.postData.title,
          summary: '',
          reason: '',
          request: '',
          references: '',
          fullname: '',
          addresseeId: 0,
          profile: '',
          email: '',
        })
        // await SignatureService.createSignature(postId)
        toast({
          status: 'success',
          description: 'Your post has been created.',
        })
        navigate(`/questions/${postId}`, { replace: true })
      } catch (err) {
        toast({
          status: 'error',
          description: getApiErrorMessage(err),
        })
      }
    }

    return (
      <Fragment>
        <div className="post-form-container">
          <div className="post-form-content">
            <Spacer h={['64px', '64px', '84px']} />
            <div className="post-form-header">
              <div className="post-form-headline fc-black-800">
                Post a Question
              </div>
            </div>
            <div className="post-form-section">
              <div className="postform" style={{ width: '100%' }}>
                {/* Undefined checks to coerce types. In reality all data should have loaded. */}
                <AskForm
                  onSubmit={onSubmit}
                  submitButtonText="Post your question"
                />
              </div>
            </div>
          </div>
        </div>
        <Spacer minH={20} />
      </Fragment>
    )
  }
}

export default PostForm
