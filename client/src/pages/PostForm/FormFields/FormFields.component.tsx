import { Button, ButtonGroup, useMultiStyleConfig } from '@chakra-ui/react'
import { useState } from 'react'
import { Addressee } from '~shared/types/base'
import { useForm, FormProvider } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import ProfileForm from './ProfileForm'
import PetitionHeadingForm from './PetitionHeadingForm'
import PetitionBodyForm from './PetitionBodyForm'

export type FormSubmission = {
  postData: postDataType
}

type AddresseeOption = { value: number; label: string }

type postDataType = {
  name: string
  email: string
  profile: string
  title: string
  reason: string
  request: string
  summary: string
  addressee: AddresseeOption
}

interface PostFormProps {
  inputPostData?: postDataType
  addresseeOptions: Addressee[]
  onSubmit: (formData: FormSubmission) => Promise<void>
  submitButtonText: string
}

interface PostFormInput {
  postName: string
  postEmail: string
  postProfile: string
  postTitle: string
  postReason: string
  postRequest: string
  postSummary: string
  postAddressee: AddresseeOption
}

// const TITLE_MAX_LEN = 150

const PostForm = ({
  inputPostData = {
    name: '',
    email: '',
    profile: '',
    title: '',
    reason: '',
    request: '',
    summary: '',
    addressee: {
      value: 0,
      label: '',
    },
  },
  addresseeOptions,
  onSubmit,
  submitButtonText,
}: PostFormProps): JSX.Element => {
  const styles = useMultiStyleConfig('PostForm', {})
  const [activeStep, setActiveStep] = useState(0)

  const navigate = useNavigate()
  const methods = useForm<PostFormInput>({
    defaultValues: {
      postName: inputPostData.name,
      postEmail: inputPostData.email,
      postProfile: inputPostData.profile,
      postTitle: inputPostData.title,
      postReason: inputPostData.reason,
      postRequest: inputPostData.request,
      postSummary: inputPostData.summary,
      postAddressee: inputPostData.addressee,
    },
  })
  const { trigger, handleSubmit, watch } = methods

  const replaceEmptyRichTextInput = (value: string): string =>
    value === '<p></p>\n' ? '' : value

  const internalOnSubmit = handleSubmit((formData) => {
    onSubmit({
      postData: {
        name: formData.postName,
        profile: formData.postProfile,
        email: formData.postEmail,
        title: formData.postTitle,
        reason: replaceEmptyRichTextInput(formData.postReason),
        request: replaceEmptyRichTextInput(formData.postRequest),
        summary: replaceEmptyRichTextInput(formData.postSummary ?? ''),
        addressee: formData.postAddressee,
      },
    })
  })

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <ProfileForm />
      case 1:
        return <PetitionHeadingForm addresseeOptions={addresseeOptions} />
      case 2:
        return <PetitionBodyForm />
      case 3:
      default:
        return 'unknown'
    }
  }

  const handleNext = async () => {
    const isStepValid = await trigger()
    if (isStepValid) setActiveStep(activeStep + 1)
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

  const renderButton = () => {
    if (activeStep > 2) {
      return undefined
    } else if (activeStep === 2) {
      return (
        <Button type="submit" sx={styles.submitButton}>
          {submitButtonText}
        </Button>
      )
    } else {
      return <Button onClick={handleNext}>Next step</Button>
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={internalOnSubmit}>
        {getStepContent(activeStep)}
        <ButtonGroup sx={styles.buttonGroup}>
          {renderButton()}
          <Button onClick={handleBack}>Back</Button>
          <Button sx={styles.cancelButton} onClick={() => navigate('/')}>
            Cancel
          </Button>
        </ButtonGroup>
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
      </form>
    </FormProvider>
  )
}

export default PostForm
