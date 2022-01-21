import { Box, HStack } from '@chakra-ui/layout'
import { Icon, useMultiStyleConfig } from '@chakra-ui/react'
import { BiInfoCircle } from 'react-icons/bi'

export const InfoBox = ({
  children,
}: {
  children: JSX.Element
}): JSX.Element | null => {
  const styles = useMultiStyleConfig('InfoBox', {})
  return (
    <Box sx={styles.infoBox}>
      <HStack sx={styles.infoStack}>
        <Icon
          as={BiInfoCircle}
          color="primary.500"
          w="20px"
          h="20px"
          mt="2px"
        />
        <Box sx={styles.infoBody}>{children}</Box>
      </HStack>
    </Box>
  )
}
