import {
  Button,
  useMultiStyleConfig,
  Box,
  Flex,
  Link,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { Addressee } from '~shared/types/base'
import { useForm, FormProvider } from 'react-hook-form'
import ProfileForm from './ProfileForm'
import PetitionHeadingForm from './PetitionHeadingForm'
import PetitionBodyForm from './PetitionBodyForm'
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi'

export type FormSubmission = {
  postData: postDataType
}

type AddresseeOption = { value: number; label: string }

type postDataType = {
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
  postEmail: string
  postProfile: string
  postTitle: string
  postReason: string
  postRequest: string
  postSummary: string
  postAddressee: AddresseeOption
}

const PostForm = ({
  inputPostData = {
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
  const styles = useMultiStyleConfig('FormFields', {})
  const [activeStep, setActiveStep] = useState(0)

  const methods = useForm<PostFormInput>({
    defaultValues: {
      postEmail: inputPostData.email,
      postProfile: inputPostData.profile,
      postTitle: inputPostData.title,
      postReason: inputPostData.reason,
      postRequest: inputPostData.request,
      postSummary: inputPostData.summary,
      postAddressee: inputPostData.addressee,
    },
  })
  const { trigger, handleSubmit } = methods

  const replaceEmptyRichTextInput = (value: string): string =>
    value === '<p></p>\n' ? '' : value

  const internalOnSubmit = handleSubmit((formData) => {
    onSubmit({
      postData: {
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
        <Button
          onClick={internalOnSubmit}
          rightIcon={<BiRightArrowAlt />}
          sx={styles.button}
        >
          {submitButtonText}
        </Button>
      )
    } else {
      return (
        <Button
          type="button"
          onClick={handleNext}
          rightIcon={<BiRightArrowAlt />}
          sx={styles.button}
        >
          Next
        </Button>
      )
    }
  }

  const steps = [
    'Your Profile',
    'Petition name, Select Ministry',
    'Reason for petition',
  ]

  return (
    <Box>
      <Flex sx={styles.stepsBox}>
        {activeStep > 0 ? (
          <Flex alignItems={'center'}>
            <BiLeftArrowAlt />
            <Link onClick={handleBack} sx={styles.stepsBackLink}>
              Back to {steps[activeStep - 1]}
            </Link>
          </Flex>
        ) : (
          <Box></Box>
        )}
        <Text sx={styles.stepsText}>Step {activeStep + 1} of 4</Text>
      </Flex>
      <FormProvider {...methods}>
        <form>{getStepContent(activeStep)}</form>
        <Flex sx={styles.buttonGroup}>{renderButton()}</Flex>
      </FormProvider>
    </Box>
  )
}

export default PostForm
