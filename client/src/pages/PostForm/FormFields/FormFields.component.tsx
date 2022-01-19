import {
  Alert,
  AlertIcon,
  FormLabel,
  FormControl,
  FormHelperText,
  Input,
  Button,
  ButtonGroup,
  Box,
  HStack,
  useMultiStyleConfig,
} from '@chakra-ui/react'
import { Addressee } from '~shared/types/base'
import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { RichTextEditor } from '../../../components/RichText/RichTextEditor.component'

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

interface AskFormProps {
  inputPostData?: postDataType
  addresseeOptions: Addressee[]
  onSubmit: (formData: FormSubmission) => Promise<void>
  submitButtonText: string
}

interface AskFormInput {
  postEmail: string
  postProfile: string
  postTitle: string
  postReason: string
  postRequest: string
  postSummary: string
  postAddressee: AddresseeOption
}

const TITLE_MAX_LEN = 150

const AskForm = ({
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
}: AskFormProps): JSX.Element => {
  const styles = useMultiStyleConfig('AskForm', {})

  const navigate = useNavigate()
  const { register, control, handleSubmit, watch, formState } =
    useForm<AskFormInput>({
      defaultValues: {
        postTitle: inputPostData.title,
        postReason: inputPostData.reason,
        postRequest: inputPostData.request,
        postSummary: inputPostData.summary,
        postAddressee: inputPostData.addressee,
      },
    })
  const { errors: formErrors } = formState

  const replaceEmptyRichTextInput = (value: string): string =>
    value === '<p></p>\n' ? '' : value

  const watchTitle = watch('postTitle')

  const titleCharsRemaining =
    watchTitle && typeof watchTitle === 'string'
      ? Math.max(TITLE_MAX_LEN - watchTitle.length, 0)
      : TITLE_MAX_LEN

  const internalOnSubmit = handleSubmit((formData) =>
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
    }),
  )

  const isAddresseeChosen = (selectedAddressee: AddresseeOption) => {
    return Boolean(selectedAddressee?.value)
  }
  const optionsForAddresseeSelect: AddresseeOption[] = useMemo(
    () =>
      addresseeOptions.map((addressee) => ({
        value: addressee.id,
        label: addressee.name,
      })),
    [addresseeOptions],
  )

  return (
    <form onSubmit={internalOnSubmit}>
      <FormControl>
        <FormLabel sx={styles.formLabel}>Name</FormLabel>
        <Input
          placeholder="Full name here"
          {...register('postTitle', {
            minLength: 5,
            maxLength: TITLE_MAX_LEN,
            required: true,
            disabled: true,
          })}
        />
      </FormControl>
      <FormControl>
        <FormLabel sx={styles.formLabel}>Email</FormLabel>
        <Input
          placeholder="example@mail.com"
          {...register('postTitle', {
            minLength: 5,
            maxLength: TITLE_MAX_LEN,
            required: true,
          })}
        />
      </FormControl>
      <FormControl>
        <FormLabel sx={styles.formLabel}>Profile</FormLabel>
        <Controller
          name="postRequest"
          control={control}
          rules={{
            validate: (v) => !replaceEmptyRichTextInput(v) || v.length >= 30,
          }}
          render={({ field: { onChange, value, ref } }) => (
            <RichTextEditor
              onChange={onChange}
              value={value}
              editorRef={ref}
              // Move rich text editor styles to Chakra theming for consistency
              // Note: rich text editor does not make use of Chakra components
              {...styles.richTextEditor}
            />
          )}
        />
      </FormControl>
      <FormControl>
        <FormLabel sx={styles.formLabel}>Petition Title</FormLabel>
        <Input
          placeholder="Field Empty"
          {...register('postTitle', {
            minLength: 15,
            maxLength: TITLE_MAX_LEN,
            required: true,
          })}
        />
        {formErrors.postTitle ? (
          <Alert status="error" sx={styles.alert}>
            <AlertIcon />
            Please enter a title with 15-150 characters.
          </Alert>
        ) : (
          <Box sx={styles.charsRemainingBox}>
            {titleCharsRemaining} characters left
          </Box>
        )}
      </FormControl>
      <FormControl sx={styles.formControl}>
        <HStack>
          <Box sx={styles.formLabel}>Description</Box>
          <Box textStyle="body-2">(optional)</Box>
        </HStack>

        <FormHelperText sx={styles.formHelperText}>
          Additional description to give more context to your question
        </FormHelperText>
        <Controller
          name="postRequest"
          control={control}
          rules={{
            validate: (v) => !replaceEmptyRichTextInput(v) || v.length >= 30,
          }}
          render={({ field: { onChange, value, ref } }) => (
            <RichTextEditor
              onChange={onChange}
              value={value}
              editorRef={ref}
              // Move rich text editor styles to Chakra theming for consistency
              // Note: rich text editor does not make use of Chakra components
              {...styles.richTextEditor}
            />
          )}
        />
        {formState.errors.postRequest && (
          <Alert status="error" sx={styles.alert}>
            <AlertIcon />
            Please enter at least 30 characters.
          </Alert>
        )}
      </FormControl>

      <FormControl sx={styles.formControl}>
        <FormLabel sx={styles.formLabel}>
          Select the relevant Ministry to address your petition to
        </FormLabel>
        <Controller
          name="postAddressee"
          control={control}
          rules={{ validate: isAddresseeChosen }}
          render={({ field: { onChange, value } }) => (
            <Select
              options={optionsForAddresseeSelect}
              value={optionsForAddresseeSelect.find(
                (addressee) => addressee.value === value.value,
              )}
              onChange={(addressee) => onChange(addressee)}
              menuPortalTarget={document.body}
            />
          )}
        />
        {formState.errors.postAddressee && (
          <Alert status="error" sx={styles.alert}>
            <AlertIcon />
            Please select a topic.
          </Alert>
        )}
      </FormControl>
      <FormControl sx={styles.formControl}>
        <FormLabel sx={styles.formLabel}>
          What would you like us to do?
        </FormLabel>

        <Controller
          name="postRequest"
          control={control}
          rules={{ minLength: 30 }}
          render={({ field: { onChange, value, ref } }) => (
            <RichTextEditor
              onChange={onChange}
              value={value}
              editorRef={ref}
              placeholder="Enter answer with minimum 30 characters"
            />
          )}
        />
        {formErrors.postReason && (
          <Alert status="error" sx={styles.alert}>
            <AlertIcon />
            Please enter at least 30 characters.
          </Alert>
        )}
      </FormControl>
      <FormControl sx={styles.formControl}>
        <FormLabel sx={styles.formLabel}>
          What is the reason for your petition?
        </FormLabel>
        <Controller
          name="postReason"
          control={control}
          rules={{ minLength: 30 }}
          render={({ field: { onChange, value, ref } }) => (
            <RichTextEditor
              onChange={onChange}
              value={value}
              editorRef={ref}
              placeholder="Enter answer with minimum 30 characters"
            />
          )}
        />
        {formErrors.postReason && (
          <Alert status="error" sx={styles.alert}>
            <AlertIcon />
            Please enter at least 30 characters.
          </Alert>
        )}
      </FormControl>
      <FormControl sx={styles.formControl}>
        <FormLabel sx={styles.formLabel}>
          Summary of petition (optional)
        </FormLabel>
        <FormHelperText sx={styles.formHelperText}>
          Additional description to give more context to your question Give a
          summary of your petition – this will appear at the top of your
          petition page
        </FormHelperText>
        <Controller
          name="postSummary"
          control={control}
          rules={{ minLength: 30 }}
          render={({ field: { onChange, value, ref } }) => (
            <RichTextEditor
              onChange={onChange}
              value={value}
              editorRef={ref}
              placeholder="Enter answer with minimum 30 characters"
            />
          )}
        />
        {formErrors.postReason && (
          <Alert status="error" sx={styles.alert}>
            <AlertIcon />
            Please enter at least 30 characters.
          </Alert>
        )}
      </FormControl>
      <ButtonGroup sx={styles.buttonGroup}>
        <Button type="submit" sx={styles.submitButton}>
          {submitButtonText}
        </Button>
        <Button sx={styles.cancelButton} onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </ButtonGroup>
    </form>
  )
}

export default AskForm
