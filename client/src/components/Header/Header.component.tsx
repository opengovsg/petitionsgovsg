import {
  Box,
  Flex,
  HStack,
  Link,
  Text,
  useDisclosure,
  useMultiStyleConfig,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Link as RouterLink, matchPath, useLocation } from 'react-router-dom'
import { ReactComponent as Petition } from '../../assets/petitions-sg.svg'
import { ReactComponent as PetitionMobile } from '../../assets/petitions-mobile.svg'
import Masthead from '../Masthead/Masthead.component'

const Header = (): JSX.Element => {
  const styles = useMultiStyleConfig('Header', {})
  const location = useLocation()

  // Look for /questions to catch search result and post pages
  const matchQuestions = matchPath('/questions/*', location.pathname)
  const { onOpen: openHeader, onClose: closeHeader } = useDisclosure({
    defaultIsOpen: true,
  })

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
            {deviceType === device.mobile ? <PetitionMobile /> : <Petition />}
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
          <Flex justify="space-between" sx={styles.logoBarMobile}>
            <Logo />
            <HStack gap="24px">
              <RouterLink to="/about">
                <Text sx={styles.mobileHeaderLink}>About</Text>
              </RouterLink>
              <RouterLink to="/anonymity">
                <Text sx={styles.mobileHeaderLink}>Anonymity</Text>
              </RouterLink>
            </HStack>
          </Flex>
        </>
      ) : (
        <HStack sx={styles.logoBarTabletDesktop} justifyContent="space-between">
          <Logo />
          <Flex alignItems="flex-end">
            <HStack marginInlineStart="auto" spacing="16px">
              <RouterLink to="/about">
                <Text>About PetitionsSG</Text>
              </RouterLink>
              <RouterLink to="/anonymity">
                <Text>Ensuring Anonymity</Text>
              </RouterLink>
            </HStack>
          </Flex>
        </HStack>
      )}
    </Flex>
  )
}

export default Header
