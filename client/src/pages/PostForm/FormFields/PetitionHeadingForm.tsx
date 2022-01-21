import {
  Alert,
  AlertIcon,
  FormLabel,
  FormControl,
  Input,
  Box,
  Text,
  useMultiStyleConfig,
} from '@chakra-ui/react'
import { Addressee } from '~shared/types/base'
import { useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import Select from 'react-select'
import { InfoBox } from '../../../components/InfoBox/InfoBox.component'

const TITLE_MAX_LEN = 150

type AddresseeOption = { value: number; label: string }

const Profile = ({
  addresseeOptions,
}: {
  addresseeOptions: Addressee[]
}): JSX.Element => {
  const styles = useMultiStyleConfig('FormFields', {})
  const { control, watch, register, formState } = useFormContext()
  const { errors: formErrors } = formState

  const watchTitle = watch('postTitle')

  const titleCharsRemaining =
    watchTitle && typeof watchTitle === 'string'
      ? Math.max(TITLE_MAX_LEN - watchTitle.length, 0)
      : TITLE_MAX_LEN

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
    <Box>
      <Text sx={styles.heading}>
        Write your petition title and select a relevant ministry to address it
        to
      </Text>
      <Text sx={styles.headingCaption}>
        Get their attention with a short title that focusses on the change you’d
        like them to support and select a ministry with the power to solve your
        problem or take the action you’re demanding.
      </Text>
      <Box sx={styles.formFieldBox}>
        <FormControl>
          <Box sx={styles.formLabelBox}>
            <FormLabel sx={styles.formLabel}>Petition Title</FormLabel>
          </Box>
          <Input
            sx={styles.input}
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
        <InfoBox>
          <Box>
            <Text>
              Your title is the first thing people will see about your petition.
              Get their attention with a short title that focusses on the change
              you’d like them to support.
            </Text>
            <Text>• Keep your petition title short and to the point </Text>
            <Text>• Focus on the solution</Text>
          </Box>
        </InfoBox>
      </Box>
      <Box sx={styles.formFieldBox}>
        <FormControl sx={styles.formControl}>
          <Box sx={styles.formLabelBox}>
            <FormLabel sx={styles.formLabel}>
              Select the relevant Ministry to address your petition to
            </FormLabel>
          </Box>
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
              Please select a ministry.
            </Alert>
          )}
        </FormControl>
      </Box>
    </Box>
  )
}

export default Profile
