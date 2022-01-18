import {
  Flex,
  Spinner,
  SimpleGrid,
  useMultiStyleConfig,
} from '@chakra-ui/react'
import PetitionCard from '../PetitionCard/PetitionCard.component'
import { useQuery } from 'react-query'
import { listPosts, LIST_POSTS_QUERY_KEY } from '../../services/PostService'

interface PetitionGridProps {
  sort: string
  // pageSize: number
  // footerControl?: JSX.Element
}

const PetitionGrid = ({ sort }: PetitionGridProps): JSX.Element => {
  // const { user } = useAuth()
  const styles = useMultiStyleConfig('PetitionGrid', {})

  const { data, isLoading } = useQuery(
    [LIST_POSTS_QUERY_KEY, { sort }],
    () => listPosts(sort),
    {
      keepPreviousData: true,
    },
  )

  const grid = (
    <SimpleGrid sx={styles.grid}>
      {data
        ? data.posts.map((post) => {
            return <PetitionCard post={post} />
          })
        : undefined}
    </SimpleGrid>
  )

  return (
    <Flex>
      {isLoading && <Spinner />}
      {grid}
    </Flex>
  )
}

export default PetitionGrid
