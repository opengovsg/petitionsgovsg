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
  Icon,
  HStack,
} from '@chakra-ui/react'
import { useFormContext } from 'react-hook-form'
import { BiInfoCircle } from 'react-icons/bi'

const Profile = (): JSX.Element => {
  const styles = useMultiStyleConfig('FormFields', {})
  const { register, formState } = useFormContext()

  return (
    <Box>
      <Text sx={styles.heading}>Your Profile</Text>
      <Text sx={styles.headingCaption}>Share a little bit about yourself</Text>
      <Box sx={styles.formFieldBox}>
        <FormControl>
          <Box sx={styles.formLabelBox}>
            <FormLabel sx={styles.formLabel}>Name</FormLabel>
          </Box>
          <Input
            sx={styles.input}
            placeholder="Full Name"
            {...register('postName', {
              required: true,
            })}
          />
        </FormControl>
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
      <Box sx={styles.infoBox}>
        <HStack sx={styles.infoStack}>
          <Icon as={BiInfoCircle} color="primary.500" w="20px" h="20px" />
          <Box>
            <Text sx={styles.infoHeading}>Make it personal</Text>
            <Text sx={styles.infoBody}>
              Readers are more likely to sign and support your petition if it’s
              clear why you care.
            </Text>
          </Box>
        </HStack>
      </Box>
    </Box>
  )
}

export default Profile
