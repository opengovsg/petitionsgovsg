import { Button } from '@chakra-ui/react'
import { BiRightArrowAlt } from 'react-icons/bi'
import { SGID_REDIRECT_URI } from '@/api/Sgid'

const onClick = async (redirect: string) => {
  window.location.href = `${SGID_REDIRECT_URI}?redirect=${redirect}&useName=true`
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
