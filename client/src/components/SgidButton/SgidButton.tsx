import { Button } from '@chakra-ui/react'

const onClick = async (redirect: string) => {
  if (process.env.NODE_ENV === 'production') {
    window.location.href = `${process.env.PUBLIC_URL}/api/v1/auth/sgid/login?redirect=${redirect}`
  } else {
    window.location.href = `http://localhost:6174/api/v1/auth/sgid/login?redirect=${redirect}`
  }
}

const SgidButton = ({
  text,
  redirect,
}: {
  text: string
  redirect: string
}): JSX.Element => {
  return (
    <Button
      backgroundColor="secondary.500"
      _hover={{
        background: 'secondary.400',
      }}
      w="300px"
      h="56px"
      borderRadius="4px"
      color="white"
      onClick={() => onClick(redirect)}
    >
      {text}
    </Button>
  )
}

export default SgidButton