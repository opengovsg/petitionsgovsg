import { Center, Flex } from '@chakra-ui/layout'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { listPosts, LIST_POSTS_QUERY_KEY } from '../../services/PostService'
import Pagination from '../Pagination'
import PostListComponent from '../PostList/PostList.component'
import Spinner from '../Spinner/Spinner.component'

interface QuestionsListProps {
  sort: string
  pageSize: number
  footerControl?: JSX.Element
}

const QuestionsList = ({
  sort,
  pageSize,
  footerControl,
}: QuestionsListProps): JSX.Element => {
  // Pagination
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery(
    [LIST_POSTS_QUERY_KEY, { sort, page, pageSize }],
    () => listPosts(sort, page, pageSize),
    {
      keepPreviousData: true,
    },
  )

  const handlePageChange = (nextPage: number) => {
    // -> request new data using the page number
    setPage(nextPage)
    window.scrollTo(0, 0)
  }

  return isLoading ? (
    <Spinner centerHeight="200px" />
  ) : (
    <>
      <PostListComponent
        posts={data?.posts.slice(0, pageSize)}
        defaultText={undefined}
      />
      <Center my={5}>
        {footerControl ?? (
          <Flex mt={{ base: '40px', sm: '48px', xl: '58px' }}>
            <Pagination
              totalCount={data?.totalItems ?? 0}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              currentPage={page}
            ></Pagination>
          </Flex>
        )}
      </Center>
    </>
  )
}

export default QuestionsList
