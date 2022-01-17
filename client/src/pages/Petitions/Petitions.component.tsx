import { Box, Flex, HStack, Spacer, Stack, Text } from '@chakra-ui/react'
import { useAuth } from '../../contexts/AuthContext'
import PageTitle from '../../components/PageTitle/PageTitle.component'
import PostQuestionButton from '../../components/PostQuestionButton/PostQuestionButton.component'
import QuestionsListComponent from '../../components/QuestionsList/QuestionsList.component'

const HomePage = (): JSX.Element => {
  const { user } = useAuth()

  const isAuthenticatedOfficer = user !== null

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
          id="questions"
          maxW="680px"
          m="auto"
          justifySelf="center"
          w="100%"
          pt={{ base: '32px', sm: '80px', xl: '90px' }}
          px={8}
          direction={{ base: 'column', lg: 'row' }}
        >
          <Box flex="5">
            <Flex
              flexDir={{ base: 'column-reverse', sm: 'row' }}
              mb={5}
              justifyContent="space-between"
            >
              <Text
                color="primary.500"
                textStyle="subhead-3"
                mt={{ base: '32px', sm: 0 }}
                mb={{ sm: '20px' }}
                d="block"
              ></Text>
              {/* Dropdown stuff */}
              {/* Hidden for officer because of the subcomponents in officer dashboard */}
              {/* that requires different treatment */}
              <Stack
                spacing={{ base: 2, sm: 4 }}
                direction={{ base: 'column', md: 'row' }}
              >
                {isAuthenticatedOfficer && <PostQuestionButton />}
              </Stack>
            </Flex>
            {/* List of Posts depending on whether user is citizen or agency officer */}
            <QuestionsListComponent
              sort=""
              topics=""
              pageSize={50}
              listAnswerable={false}
            />
          </Box>
        </Flex>
      </HStack>
      <Spacer />
    </Flex>
  )
}

export default HomePage
