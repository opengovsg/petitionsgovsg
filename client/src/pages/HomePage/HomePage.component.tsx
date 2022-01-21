import {
  Box,
  Flex,
  HStack,
  VStack,
  Spacer,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from '@chakra-ui/react'
import SgidButton from '../../components/SgidButton/SgidButton'
import PageTitle from '../../components/PageTitle/PageTitle.component'
import PetitionGridComponent from '../../components/PetitionGrid/PetitionGrid.component'
import Hero from '../../components/Hero/Hero.component'
import HowItWorks from '../../components/HowItWorks/HowItWorks.component'
import { useState } from 'react'
import { BiChevronDown } from 'react-icons/bi'

const HomePage = (): JSX.Element => {
  // dropdown options
  const options = [
    { value: 'basic', label: 'Newest petitions' },
    { value: 'top', label: 'Popular' },
  ]
  // dropdown state, default popular
  const [sortState, setSortState] = useState(options[1])

  return (
    <Flex direction="column" height="100%" id="home-page">
      <PageTitle title="Petitions" description="Petitions in SG" />
      <Hero />
      <HowItWorks />
      <HStack
        id="main"
        alignItems="flex-start"
        display="grid"
        gridTemplateColumns={{
          base: 'repeat(12, 1fr)',
          mx: 'auto',
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
            <Flex
              justifyContent="center"
              alignItems="center"
              justifyItems="center"
              mb="32px"
            >
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
              </VStack>
            </Flex>
            {/* List of Posts*/}
            <Flex justifyContent="left" width="1248px" m="auto">
              <Text textStyle={'h2'} color={'secondary.500'} mb="26px">
                View petitions
              </Text>
              <Menu matchWidth autoSelect={false} offset={[0, 0]}>
                {() => (
                  <>
                    <MenuButton
                      as={Button}
                      bg="white"
                      border={'1px'}
                      borderColor={'#C9CCCF'}
                      marginStart="auto"
                    >
                      <Flex justifyContent="space-between" alignItems="center">
                        <Text textStyle="body-1" color="secondary.700">
                          {sortState.label}
                        </Text>
                        <BiChevronDown />
                      </Flex>
                    </MenuButton>
                    <MenuList minW={0}>
                      {options.map(({ value, label }, i) => (
                        <MenuItem
                          key={i}
                          h="44px"
                          ps={4}
                          textStyle={
                            sortState.value === value ? 'subhead-1' : 'body-1'
                          }
                          fontWeight={
                            sortState.value === value ? '500' : 'normal'
                          }
                          letterSpacing="-0.011em"
                          bg="white"
                          _hover={
                            sortState.value === value
                              ? { bg: 'primary.200' }
                              : { bg: 'primary.100' }
                          }
                          onClick={() => {
                            setSortState(options[i])
                          }}
                        >
                          {label}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </>
                )}
              </Menu>
            </Flex>
            <PetitionGridComponent sort={sortState.value} />
          </Box>
        </Flex>
      </HStack>
      <Spacer />
    </Flex>
  )
}

export default HomePage
