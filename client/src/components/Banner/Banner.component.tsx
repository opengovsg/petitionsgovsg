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
      background="primary.500"
      display="flex"
      justifyContent="center"
      alignItems="center"
      className="banner"
      position="sticky"
      zIndex="999"
      top={{ base: '108px', lg: '96px' }}
    >
      <Box width="80%" pl="32px" pr="48px">
        {children}
      </Box>
    </Box>
  )
}
