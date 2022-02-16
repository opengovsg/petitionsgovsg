import {
  Alert,
  AlertIcon,
  FormLabel,
  FormControl,
  Input,
  useMultiStyleConfig,
  Text,
  Box,
  Flex,
  Spinner,
} from '@chakra-ui/react'
import { useFormContext } from 'react-hook-form'

import { useQuery } from 'react-query'
import { InfoBox } from '@/components/InfoBox/InfoBox.component'
import { getUserName, GET_USER_NAME } from '@/services/AuthService'

const Profile = (): JSX.Element => {
  const styles = useMultiStyleConfig('FormFields', {})
  const { register, formState } = useFormContext()

  const { data, isLoading } = useQuery([GET_USER_NAME], () => getUserName(), {
    keepPreviousData: true,
  })

  return isLoading ? (
    <Spinner />
  ) : (
    <Box>
      <Text sx={styles.heading}>Your Profile</Text>
      <Text sx={styles.headingCaption}>Share a little bit about yourself</Text>
      <Box sx={styles.formFieldBox}>
        <Box sx={styles.formLabelBox}>
          <FormLabel sx={styles.formLabel}>Name</FormLabel>
          <Text sx={styles.name}>{data?.fullname}</Text>
        </Box>
      </Box>
      <Box sx={styles.formFieldBox}>
        <FormControl>
          <Box sx={styles.formLabelBox}>
            <FormLabel sx={styles.formLabel}>Email</FormLabel>
            <Text sx={styles.formCaption}>
              For ministries to contact you and to receive updates about your
              petition
            </Text>
          </Box>
          <Input
            sx={styles.input}
            placeholder="example@mail.com"
            {...register('postEmail', {
              minLength: 5,
              required: true,
            })}
          />
          {formState.errors.postEmail && (
            <Alert status="error" sx={styles.alert}>
              <AlertIcon />
              Please enter a valid email address.
            </Alert>
          )}
        </FormControl>
      </Box>
      <Box sx={styles.formFieldBox}>
        <FormControl>
          <Flex sx={styles.formLabelBox}>
            <FormLabel sx={styles.formLabel}>Short Profile</FormLabel>
            <Text sx={styles.optional}>(optional)</Text>
          </Flex>
          <Input
            sx={styles.input}
            placeholder="A short profile about yourself"
            {...register('postProfile', {
              minLength: 0,
              required: false,
            })}
          />
        </FormControl>
      </Box>
      <InfoBox>
        <Box>
          <Text sx={styles.infoHeading}>Make it personal</Text>
          <Text>
            Readers are more likely to sign and support your petition if it’s
            clear why you care.
          </Text>
        </Box>
      </InfoBox>
    </Box>
  )
}

export default Profile
