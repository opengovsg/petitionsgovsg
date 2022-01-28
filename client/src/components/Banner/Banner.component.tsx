import { Box } from '@chakra-ui/layout'

export const Banner = ({
  children,
}: {
  children: JSX.Element
}): JSX.Element | null => {
  return (
    <Box
      minH="64px"
      color="neutral.100"
      background="primary.500"
      display="flex"
      justifyContent="center"
      alignItems="center"
      className="banner"
      position="sticky"
      zIndex="999"
      py={{ base: '16px', md: '8px' }}
      top={{ base: '90px', lg: '96px' }}
    >
      <Box width="80%">{children}</Box>
    </Box>
  )
}
