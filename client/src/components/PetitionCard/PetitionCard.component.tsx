import {
  Flex,
  Link,
  HStack,
  Box,
  Text,
  Badge,
  Button,
  useMultiStyleConfig,
  Divider,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { BasePostDto } from '../../api'
import { useAuth } from '../../contexts/AuthContext'

const PetitionCard = ({
  post: {
    userId,
    title,
    summary,
    reason,
    request,
    references,
    status,
    fullname,
    signatureCount,
  },
}: {
  post: Pick<
    BasePostDto,
    | 'userId'
    | 'title'
    | 'summary'
    | 'reason'
    | 'request'
    | 'references'
    | 'status'
    | 'fullname'
    | 'signatureCount'
  >
}): JSX.Element => {
  // const { user } = useAuth()
  const styles = useMultiStyleConfig('PetitionCard', {})

  return (
    <Box sx={styles.card}>
      <Text sx={styles.title}>{title}</Text>
      <Text sx={styles.request}>{request}</Text>
      <Text sx={styles.creator}>Created by {fullname}</Text>
      <Badge sx={styles.badge}>{status}</Badge>
      <Divider sx={styles.divider} />
      <HStack justifyContent="space-between">
        <Box>
          <Text sx={styles.signatureCount}>{signatureCount} signed</Text>
          <Text sx={styles.duration}>days to go</Text>
        </Box>
        <Button sx={styles.signButton}>Sign petition</Button>
      </HStack>
    </Box>
  )
}

export default PetitionCard
