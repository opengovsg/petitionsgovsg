import { Button } from '@chakra-ui/react'
import { BiRightArrowAlt } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

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
  width = '300px',
  height = '56px',
}: {
  text: string
  redirect: string
  width?: string
  height?: string
}): JSX.Element => {
  const { user } = useAuth()
  const navigate = useNavigate()
  if (user) {
    return (
      <Button
        backgroundColor="secondary.500"
        _hover={{
          background: 'secondary.400',
        }}
        w={width}
        h={height}
        borderRadius="4px"
        color="white"
        onClick={() => navigate(redirect)}
      >
        {text}
      </Button>
    )
  }
  return (
    <Button
      rightIcon={<BiRightArrowAlt />}
      backgroundColor="secondary.500"
      _hover={{
        background: 'secondary.400',
      }}
      w={width}
      h={height}
      borderRadius="4px"
      color="white"
      onClick={() => onClick(redirect)}
    >
      {text}
    </Button>
  )
}

export default SgidButton
