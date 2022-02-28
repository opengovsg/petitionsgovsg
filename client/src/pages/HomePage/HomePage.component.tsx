import {
  Box,
  Flex,
  Spacer,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from '@chakra-ui/react'
import PageTitle from '@/components/PageTitle/PageTitle.component'
import PetitionGridComponent from '@/components/PetitionGrid/PetitionGrid.component'
import Hero from '@/components/Hero/Hero.component'
import HowItWorks from '@/components/HowItWorks/HowItWorks.component'
import { AnonymityBanner } from '@/components/AnonymityBanner/AnonymityBanner.component'
import { useState } from 'react'
import { BiChevronDown } from 'react-icons/bi'
import { SortType } from '~shared/types/base'

const HomePage = (): JSX.Element => {
  // dropdown options
  const options = [
    { value: SortType.MostSignatures, label: 'Most signatures' },
    { value: SortType.LeastSignatures, label: 'Least signatures' },
    { value: SortType.Newest, label: 'Newest petitions' },
    { value: SortType.Oldest, label: 'Oldest petitions' },
  ]
  // dropdown state, default popular
  const [sortState, setSortState] = useState(options[0])

  return (
    <Flex direction="column" height="100%" id="home-page" mb="88px" px="24px">
      <PageTitle title="Petitions" description="Petitions in SG" />
      <Hero />
      <HowItWorks />
      <AnonymityBanner />
      <Flex id="petitions" m="auto">
        <Box flex="3">
          <Spacer h="80px" />
          {/* List of Posts*/}
          <Flex m="auto" flexWrap="wrap">
            <Text textStyle={'display-2'} color={'secondary.500'}>
              View petitions
            </Text>
            <Menu matchWidth autoSelect={false} offset={[0, 0]}>
              {() => (
                <>
                  <MenuButton
                    as={Button}
                    bg="white"
                    border="1px"
                    borderColor="#C9CCCF"
                    my="16px"
                    marginStart={{ md: 'auto' }}
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
      <Spacer />
    </Flex>
  )
}

export default HomePage
