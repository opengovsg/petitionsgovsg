import {
  Center,
  Spinner as ChakraSpinner,
  SpinnerProps as ChakraSpinnerProps,
} from '@chakra-ui/react'

interface SpinnerProps extends ChakraSpinnerProps {
  centerwidth?: string | number
  centerheight?: string | number
}

const Spinner = (props: SpinnerProps): JSX.Element => {
  return (
    <Center w={props.centerwidth} h={props.centerheight}>
      <ChakraSpinner {...props} />
    </Center>
  )
}

export default Spinner
