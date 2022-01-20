import {
  Alert,
  AlertIcon,
  FormLabel,
  FormControl,
  useMultiStyleConfig,
  Box,
  Text,
  Flex,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { Controller, useFormContext } from 'react-hook-form'
import { RichTextEditor } from '../../../components/RichText/RichTextEditor.component'
import { BiInfoCircle } from 'react-icons/bi'

const Profile = (): JSX.Element => {
  const styles = useMultiStyleConfig('FormFields', {})
  const { control, formState } = useFormContext()
  const { errors: formErrors } = formState

  return (
    <Box>
      <Text sx={styles.heading}>Explain the problem you want to solve</Text>
      <Text sx={styles.headingCaption}>
        People are more likely to support your petition if it’s clear why you
        care. Explain how this change will impact you, your family, or your
        community.
      </Text>
      <Box sx={styles.formFieldBox}>
        <FormControl sx={styles.formControl}>
          <Box sx={styles.formLabelBox}>
            <FormLabel sx={styles.formLabel}>
              What would you like us to do?
            </FormLabel>
          </Box>
          <Controller
            name="postRequest"
            control={control}
            rules={{ minLength: 30 }}
            render={({ field: { onChange, value, ref } }) => (
              <RichTextEditor
                onChange={onChange}
                value={value}
                editorRef={ref}
                placeholder="What do you want to achieve?"
              />
            )}
          />
          {formErrors.postRequest && (
            <Alert status="error" sx={styles.alert}>
              <AlertIcon />
              Please enter an answer of minimum 30 characters.
            </Alert>
          )}
        </FormControl>
      </Box>
      <Box sx={styles.infoBox}>
        <HStack sx={styles.infoStack}>
          <Icon as={BiInfoCircle} color="primary.500" w="20px" h="20px" />
          <Box sx={styles.infoBody}>
            <Text>Describe the solution</Text>
            <Text>
              Explain what needs to happen and who can make the change. Make it
              clear what happens if you win or lose.
            </Text>
          </Box>
        </HStack>
      </Box>
      <Box sx={styles.formFieldBox}>
        <FormControl sx={styles.formControl}>
          <Box sx={styles.formLabelBox}>
            <FormLabel sx={styles.formLabel}>
              What is the reason for your petition?
            </FormLabel>
          </Box>
          <Controller
            name="postReason"
            control={control}
            rules={{ minLength: 30 }}
            render={({ field: { onChange, value, ref } }) => (
              <RichTextEditor
                onChange={onChange}
                value={value}
                editorRef={ref}
                placeholder="Why do you want to achieve this?"
              />
            )}
          />
          {formErrors.postReason && (
            <Alert status="error" sx={styles.alert}>
              <AlertIcon />
              Please enter an answer of minimum 30 characters.
            </Alert>
          )}
        </FormControl>
      </Box>
      <Box sx={styles.infoBox}>
        <HStack sx={styles.infoStack}>
          <Icon as={BiInfoCircle} color="primary.500" w="20px" h="20px" />
          <Box sx={styles.infoBody}>
            <Text>
              Describe the people involved and the problem they are facing
            </Text>
            <Text>
              Readers are most likely to take action when they understand who is
              affected.
            </Text>
          </Box>
        </HStack>
      </Box>
      <Box sx={styles.formFieldBox}>
        <FormControl sx={styles.formControl}>
          <Flex sx={styles.formLabelBox}>
            <FormLabel sx={styles.formLabel}>Summary of petition</FormLabel>
            <Text sx={styles.optional}>(optional)</Text>
          </Flex>
          <Controller
            name="postSummary"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <RichTextEditor
                onChange={onChange}
                value={value}
                editorRef={ref}
                placeholder="Give a summary of your petition"
              />
            )}
          />
        </FormControl>
      </Box>
    </Box>
  )
}

export default Profile
