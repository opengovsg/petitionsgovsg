import { Button } from '@chakra-ui/react'
import { BiRightArrowAlt } from 'react-icons/bi'

const onClick = async (redirect: string) => {
  if (process.env.NODE_ENV === 'production') {
    window.location.href = `${process.env.PUBLIC_URL}/api/v1/auth/sgid/login?redirect=${redirect}`
  } else {
    window.location.href = `http://localhost:6174/api/v1/auth/sgid/login?redirect=${redirect}`
  }
}

const SgidButtonWithArrow = ({
  text,
  redirect,
}: {
  text: string
  redirect: string
  width?: string
  height?: string
}): JSX.Element => {
  return (
    <Button
      rightIcon={<BiRightArrowAlt />}
      backgroundColor="secondary.500"
      _hover={{
        background: 'secondary.400',
      }}
      width={{ base: '100%', md: '176px' }}
      height={{ base: '56px', md: '44px' }}
      borderRadius="4px"
      color="white"
      onClick={() => onClick(redirect)}
    >
      {text}
    </Button>
  )
}

export { SgidButtonWithArrow }
