import { Box, Flex, HStack, VStack, Spacer, Text } from '@chakra-ui/react'
import SgidButton from '../../components/SgidButton/SgidButton'
import PageTitle from '../../components/PageTitle/PageTitle.component'
import PetitionGridComponent from '../../components/PetitionGrid/PetitionGrid.component'

const HomePage = (): JSX.Element => {
  // const device = {
  //   mobile: 'mobile',
  //   tablet: 'tablet',
  //   desktop: 'desktop',
  // }

  // const [deviceType, setDeviceType] = useState(
  //   window.innerWidth < 480
  //     ? device.mobile
  //     : window.innerWidth < 1440
  //     ? device.tablet
  //     : device.desktop,
  // )

  // const checkViewportSize = () => {
  //   setDeviceType(
  //     window.innerWidth < 480
  //       ? device.mobile
  //       : window.innerWidth < 1440
  //       ? device.tablet
  //       : device.desktop,
  //   )
  // }

  // useEffect(() => {
  //   window.addEventListener('resize', checkViewportSize)
  //   return () => window.removeEventListener('resize', checkViewportSize)
  // }, [])

  return (
    <Flex direction="column" height="100%" id="home-page">
      <PageTitle title="Petitions" description="Petitions in SG" />

      <HStack
        id="main"
        alignItems="flex-start"
        display="grid"
        gridTemplateColumns={{
          base: '1fr',
        }}
      >
        <Flex
          id="petitions"
          // maxW="680px"
          m="auto"
          w="100%"
          // direction={{ base: 'column', lg: 'row' }}
        >
          <Box flex="5">
            <Flex justifyContent="center" alignItems="center">
              <VStack>
                <Text
                  textStyle={'h1'}
                  color="secondary.500"
                  fontSize={'32px'}
                  pb="7px"
                  d="block"
                  mt="52px"
                >
                  petitions.gov.sg
                </Text>
                <Text
                  color="#212328"
                  fontSize={'24px'}
                  pb="22px"
                  fontStyle={'light'}
                >
                  digital petitions recognised by the government
                </Text>
                <SgidButton text="Start a petition here!" redirect="/create" />
                <Flex
                  height="470px"
                  // bg={'white'}
                  py="24px"
                  justifyContent="center"
                >
                  <Text>How do petitions.gov.sg work?</Text>
                </Flex>
              </VStack>
            </Flex>
            <Flex
              height="470px"
              bg={'white'}
              py="30px"
              m="auto"
              my="56px"
              width="1248px"
              // mx="auto"
              justifyContent="center"
            >
              <Text>How does petitions.gov.sg work?</Text>
            </Flex>
            {/* List of Posts*/}
            <Flex justifyContent="left" width="1248px" m="auto">
              <Text textStyle={'h2'} color={'secondary.500'} mb="26px">
                View petitions
              </Text>
            </Flex>
            <PetitionGridComponent sort="" />
          </Box>
        </Flex>
      </HStack>
      <Spacer />
    </Flex>
  )
}

export default HomePage
