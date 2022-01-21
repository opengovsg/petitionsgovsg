import { Box } from '@chakra-ui/layout'

export const Banner = ({
  children,
}: {
  children: JSX.Element
}): JSX.Element | null => {
  return (
    <Box
      h="64px"
      minH="64px"
      color="neutral.100"
      zIndex="2000"
      background="primary.500"
      display="flex"
      justifyContent="center"
      alignItems="center"
      className="banner"
    >
      {children}
    </Box>
  )
}
