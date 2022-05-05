import { Button } from '@chakra-ui/react'
import { BiRightArrowAlt } from 'react-icons/bi'
import { SGID_REDIRECT_URI } from '@/api/Sgid'

const onClick = async (redirect: string) => {
  // Don't redirect user until more confident of going forward
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const target = `${SGID_REDIRECT_URI}?redirect=${redirect}&useName=true`
  // window.location.href = target
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
