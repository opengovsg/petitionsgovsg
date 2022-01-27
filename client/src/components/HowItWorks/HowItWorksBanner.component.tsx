import { Text, SimpleGrid, GridItem } from '@chakra-ui/react'
import { ReactComponent as StepOne } from '../../assets/how-step-1.svg'
import { ReactComponent as StepTwo } from '../../assets/how-step-2.svg'
import { ReactComponent as StepThree } from '../../assets/how-step-3.svg'
import { ReactComponent as StepFour } from '../../assets/how-step-4.svg'
import { ReactComponent as StepFive } from '../../assets/how-step-5.svg'

interface HowItWorksBannerProps {
  isMaxThreeInGrid?: boolean
  // pageSize: number
  // footerControl?: JSX.Element
}

const HowItWorksBanner = ({
  isMaxThreeInGrid,
}: HowItWorksBannerProps): JSX.Element => {
  return (
    <SimpleGrid
      templateColumns={
        isMaxThreeInGrid
          ? 'repeat(3,1fr)'
          : {
              base: '1fr',
              md: 'repeat(3,1fr)',
              lg: 'repeat(5,1fr)',
            }
      }
      spacing="35px"
    >
      <GridItem maxW={{ sm: '100%', md: '176px' }}>
        <StepOne />
        <Text textStyle="h3" color="secondary.500" mt="16px" mb="8px">
          Create a petition
        </Text>
        <Text textStyle="body1" color="secondary.500">
          Draft a compelling petition for a cause you think needs the
          government's attention - you'll be petitioning publicly!
        </Text>
      </GridItem>
      <GridItem maxW={{ sm: '100%', md: '176px' }}>
        <StepTwo />
        <Text textStyle="h3" color="secondary.500" mt="16px" mb="8px">
          Get 3 endorsers
        </Text>
        <Text textStyle="body1" color="secondary.500">
          Find endorsers to formalise your petition. Your endorsers will also be
          backing the petition publicly.
        </Text>
      </GridItem>
      <GridItem maxW={{ sm: '100%', md: '176px' }}>
        <StepThree />
        <Text textStyle="h3" color="secondary.500" mt="16px" mb="8px">
          Publish and share
        </Text>
        <Text textStyle="body1" color="secondary.500">
          Your petition is published automatically once 3 individuals endorse
          your petition.
        </Text>
      </GridItem>
      <GridItem maxW={{ sm: '100%', md: '176px' }}>
        <StepFour />
        <Text textStyle="h3" color="secondary.500" mt="16px" mb="8px">
          Gather signatures
        </Text>
        <Text textStyle="body1" color="secondary.500">
          Get 10,000 signatures before the petition closes in 180 days, so your
          petition can be brought to the relevant ministry.
        </Text>
      </GridItem>
      <GridItem maxW={{ sm: '100%', md: '176px' }}>
        <StepFive />
        <Text textStyle="h3" color="secondary.500" mt="16px" mb="8px">
          Ministry responds
        </Text>
        <Text textStyle="body1" color="secondary.500">
          MCCY Singapore will submit the petition to the relevant ministry, who
          will then have 90 days to respond.
        </Text>
      </GridItem>
    </SimpleGrid>
  )
}

export default HowItWorksBanner
