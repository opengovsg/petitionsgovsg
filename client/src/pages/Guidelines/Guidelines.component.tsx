import { useMultiStyleConfig, Text, Box } from '@chakra-ui/react'

const Guidelines = (): JSX.Element => {
  const styles = useMultiStyleConfig('About', {})

  return (
    <>
      <Box sx={styles.base}>
        <Text sx={styles.heading}>Submission Process and Guidelines</Text>
        <Text sx={styles.subheading}>How to submit a petition</Text>
        <Box sx={styles.sectionBox}>
          <Text sx={styles.text}></Text>
        </Box>
        <Box sx={styles.sectionBox}>
          <Text sx={styles.subheading}>Guidelines</Text>
          <Text sx={styles.text}></Text>
        </Box>
      </Box>
    </>
  )
}

export default Guidelines
