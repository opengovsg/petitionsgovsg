import {
  HStack,
  Box,
  Text,
  Badge,
  Button,
  useMultiStyleConfig,
  Divider,
} from '@chakra-ui/react'
import { GetSinglePostDto } from '../../api'
import { useNavigate } from 'react-router-dom'

const PetitionCard = ({
  post: { id, title, request, status, fullname, signatureCount },
}: {
  post: Pick<
    GetSinglePostDto,
    'id' | 'title' | 'request' | 'status' | 'fullname' | 'signatureCount'
  >
}): JSX.Element => {
  // const { user } = useAuth()
  const styles = useMultiStyleConfig('PetitionCard', { status })
  const navigate = useNavigate()

  return (
    <Box sx={styles.card}>
      <Text sx={styles.title}>{title}</Text>
      <Text sx={styles.request}>
        {request
          ? request.length > 50
            ? `${request?.substring(0, 50)}...`
            : request
          : undefined}
      </Text>
      <Text sx={styles.creator}>Created by {fullname}</Text>
      <Badge sx={styles.badge}>{status}</Badge>
      <Divider sx={styles.divider} />
      <HStack justifyContent="space-between">
        <Box>
          <Text sx={styles.signatureCount}>{signatureCount} signed</Text>
          <Text sx={styles.duration}>days to go</Text>
        </Box>
        <Button
          sx={styles.signButton}
          onClick={() => {
            navigate(`posts/${id}`)
          }}
        >
          Sign petition
        </Button>
      </HStack>
    </Box>
  )
}

export default PetitionCard
