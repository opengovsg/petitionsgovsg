import { Button, Center, Flex, Heading, Spacer, Text } from '@chakra-ui/react'
import { Fragment } from 'react'
import { Link as ReachLink } from 'react-router-dom'
import { BackToHome } from '../../components/BackToHome/BackToHome'

const About = (): JSX.Element => {
  const pagePX = { base: 8, md: 12 }
  return (
    <Fragment>
      <Flex
        mt={{ base: '32px', sm: '60px' }}
        mb={{ base: '32px', sm: '50px' }}
        px={pagePX}
      >
        <BackToHome mainPageName={null} />
      </Flex>
      <Flex direction="column" px={pagePX}>
        <Heading align="center" size="4xl">
          About
        </Heading>
        <Spacer minH={10} />
        <Text align="center">About page.</Text>
        <Spacer minH={10} />
        <Center>
          <Button as={ReachLink} to="/">
            Back to home page
          </Button>
        </Center>
      </Flex>
      <Spacer />
    </Fragment>
  )
}

export default About
