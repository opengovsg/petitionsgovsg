import {
  Box,
  Collapse,
  Flex,
  HStack,
  Image,
  Link,
  Text,
  useDisclosure,
  useMultiStyleConfig,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Link as RouterLink, matchPath, useLocation } from 'react-router-dom'
import { ReactComponent as Petition } from '../../assets/petitions.svg'
import { useAuth } from '../../contexts/AuthContext'

import LinkButton from '../LinkButton/LinkButton.component'
import Masthead from '../Masthead/Masthead.component'
import Spinner from '../Spinner/Spinner.component'

const Header = (): JSX.Element => {
  const styles = useMultiStyleConfig('Header', {})
  const { user, logout } = useAuth()

  const location = useLocation()
  // const matchPost = matchPath('/questions/:id', location.pathname)
  // const postId = matchPost?.params?.id

  // Similar logic to find agency as login component
  // if post is linked to multiple agencies via agencyTag
  // take the first agencyTag found as agency
  const AuthLinks = () => (
    <Flex mx={6} flexDirection="column" alignItems="flex-end">
      {user === null ? (
        <Spinner centerWidth="50px" centerHeight="50px" />
      ) : (
        <HStack>
          {/* <Text textStyle="body-2" mr={2} color="secondary.700">
            {user.fullname}
          </Text> */}
          <Image
            alt="user-logo"
            boxSize={8}
            borderRadius="3px"
            mr={4}
            alignItems="right"
            src={`https://secure.gravatar.com/avatar/${user.id}?s=164&d=identicon`}
            loading="lazy"
          />
          <LinkButton text={'Log out'} link={'/'} handleClick={logout} />
        </HStack>
      )}
    </Flex>
  )

  // Look for /questions to catch search result and post pages
  const matchQuestions = matchPath('/questions/*', location.pathname)
  const {
    isOpen: headerIsOpen,
    onOpen: openHeader,
    onClose: closeHeader,
  } = useDisclosure({ defaultIsOpen: true })

  const checkHeaderState = () => {
    if (window.pageYOffset > 280) closeHeader()
    else if (window.pageYOffset < 5) openHeader()
  }

  const device = {
    mobile: 'mobile',
    tablet: 'tablet',
    desktop: 'desktop',
  }

  // Responsive styling based on viewport width is implemented with window.innerWidth
  // instead of useBreakpointValue as useBreakpointValue switches value to true between
  // 345px - 465px for some reason.
  // 480 px = 30em if the breakpoint for mobile
  // 1440px = 90em is the breakpoint for desktop
  const [deviceType, setDeviceType] = useState(
    window.innerWidth < 480
      ? device.mobile
      : window.innerWidth < 1440
      ? device.tablet
      : device.desktop,
  )

  const checkViewportSize = () => {
    setDeviceType(
      window.innerWidth < 480
        ? device.mobile
        : window.innerWidth < 1440
        ? device.tablet
        : device.desktop,
    )
  }

  useEffect(() => {
    window.addEventListener('resize', checkViewportSize)
    return () => window.removeEventListener('resize', checkViewportSize)
  }, [])

  // attach to matchQuestions?.path instead of matchQuestions because matchQuestions is
  // an object and will trigger the callback without values within the object changing
  useEffect(() => {
    if (!matchQuestions) {
      openHeader()
      window.addEventListener('scroll', checkHeaderState)
      return () => {
        window.removeEventListener('scroll', checkHeaderState)
      }
    } else {
      closeHeader()
    }
  }, [matchQuestions?.pathname])

  const Logo = () => {
    return (
      <Link sx={styles.logoBarRouterLink} as={RouterLink} to="/">
        <HStack>
          <Box sx={styles.logoBarPetition}>
            <Petition />
          </Box>
        </HStack>
      </Link>
    )
  }

  return (
    <Flex direction="column" sx={styles.root}>
      <Masthead />
      {deviceType === device.mobile ? (
        <>
          {!matchQuestions ? (
            <Collapse in={headerIsOpen} animateOpacity={false}>
              <Flex justify="space-between" sx={styles.logoBarMobile}>
                <Logo />
                <HStack>
                  <RouterLink to="/about">What is Petitions?</RouterLink>
                  {user && <AuthLinks />}
                </HStack>
              </Flex>
            </Collapse>
          ) : null}
        </>
      ) : (
        <HStack sx={styles.logoBarTabletDesktop} justifyContent="space-between">
          <Logo />
          <HStack>
            <RouterLink to="/about">
              <Text>What is Petitions?</Text>
            </RouterLink>
            <RouterLink to="/">
              <Text>Ensuring Anonymity</Text>
            </RouterLink>
            {user && <AuthLinks />}
          </HStack>
        </HStack>
      )}
    </Flex>
  )
}

export default Header
