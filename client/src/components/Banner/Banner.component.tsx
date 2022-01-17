import { Box } from '@chakra-ui/layout'

export const Banner = (): JSX.Element | null => {
  return (
    <Box
      h="50px"
      minH="50px"
      color="neutral.100"
      zIndex="2000"
      background="neutral.900"
      display="flex"
      justifyContent="center"
      alignItems="center"
      className="banner"
    >
      Banner
    </Box>
  )
}
