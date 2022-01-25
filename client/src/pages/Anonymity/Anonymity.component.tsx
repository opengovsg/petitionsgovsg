import { useMultiStyleConfig, Text, Box } from '@chakra-ui/react'

const Anonymity = (): JSX.Element => {
  const styles = useMultiStyleConfig('About', {})

  return (
    <>
      <Box sx={styles.base}>
        <Text sx={styles.heading}>Ensuring Anonymity</Text>
        <Text sx={styles.subheading}>How we protect anonymity</Text>
        <Box sx={styles.sectionBox}>
          <Text sx={styles.text}>text here</Text>
        </Box>
      </Box>
    </>
  )
}

export default Anonymity
