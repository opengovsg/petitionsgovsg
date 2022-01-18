import {
  Checkbox,
  Flex,
  Input,
  Text,
  Textarea,
  useMultiStyleConfig,
} from '@chakra-ui/react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as SignatureService from '../../services/SignatureService'

type FormValues = {
  comment: string | undefined
}

const MAX_CHAR_COUNT = 200

const refreshPage = () => {
  window.location.reload()
}

const SignForm = ({ postId }: { postId: string | undefined }): JSX.Element => {
  const styles = useMultiStyleConfig('SignForm', {})
  const { register, handleSubmit } = useForm<FormValues>()
  const [count, setCount] = useState(MAX_CHAR_COUNT)
  const [useName, setUseName] = useState(false)

  const onSubmit: SubmitHandler<FormValues> = async ({ comment }) => {
    await SignatureService.createSignature(Number(postId), {
      comment: comment ?? null,
      useName: useName,
    })
    refreshPage()
  }

  const signatureComponent = (
    <>
      <Textarea
        maxLength={MAX_CHAR_COUNT}
        sx={styles.input}
        className="form-input"
        placeholder="Share your reason for signing (optional)"
        {...register('comment', {
          required: false,
          maxLength: {
            value: MAX_CHAR_COUNT,
            message: 'Maximum length should be 200',
          },
        })}
        onChange={(e) => setCount(MAX_CHAR_COUNT - e.target.value.length)}
      />
      <Text sx={styles.characterCount}>{count} characters left</Text>
    </>
  )

  const useNameComponent = (
    <Checkbox
      mt="8px"
      onChange={() => {
        setUseName(!useName)
      }}
    >
      <Text sx={styles.caption}>I want to sign using my full name.</Text>
    </Checkbox>
  )

  return (
    <Flex sx={styles.container} className="form-container">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        {signatureComponent}
        {useNameComponent}
        <Input
          sx={styles.submitButton}
          id="submit-button"
          name="submit-button"
          type="submit"
          value={'Sign this petition'}
        />
      </form>
    </Flex>
  )
}

export default SignForm
