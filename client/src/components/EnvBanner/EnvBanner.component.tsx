import { Box, HStack, Icon } from '@chakra-ui/react'
import { BiInfoCircle } from 'react-icons/bi'

type bannerDataType =
  | {
      bannerMessage: string
    }
  | undefined

export const EnvBanner = ({
  data,
  isSuccess,
}: {
  data: bannerDataType
  isSuccess: boolean
}): JSX.Element | null => {
  return isSuccess && data?.bannerMessage ? (
    <Box
      minH="50px"
      color="neutral.100"
      zIndex="2000"
      background="primary.500"
      display="flex"
      justifyContent="center"
      alignItems="center"
      className="banner"
    >
      <HStack justifyContent="space-between" flexWrap="wrap">
        <HStack alignItems="flex-start" mx="8" my="2">
          <Icon as={BiInfoCircle} />
          <Box dangerouslySetInnerHTML={{ __html: data.bannerMessage }} />
        </HStack>
      </HStack>
    </Box>
  ) : null
}
