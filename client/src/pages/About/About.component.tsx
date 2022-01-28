import { useMultiStyleConfig, Text, Box, Link } from '@chakra-ui/react'
import { InfoBox } from '../../components/InfoBox/InfoBox.component'
import { Link as RouterLink } from 'react-router-dom'
import HowItWorksBanner from '../../components/HowItWorks/HowItWorksBanner.component'

const About = (): JSX.Element => {
  const styles = useMultiStyleConfig('About', {})

  return (
    <>
      <Box sx={styles.base}>
        <Text sx={styles.heading}>About Petitions</Text>
        <Text sx={styles.subheading}>
          A platform for citizens to push for change that matters
        </Text>
        <Box sx={styles.sectionBox}>
          <Text sx={styles.text}>
            PetitionsSG is a collaborative initiative by{' '}
            <b>Open Government Products</b> and the{' '}
            <b>Ministry of Culture, Community, and Youth</b>.
          </Text>
          <Text sx={styles.text}>
            The aim is to give you – the residents of Singapore – a platform to
            transparently and legitimately have your voices heard by those who
            can help effect meaningful change. Petitions are addressed to the
            Singapore government, and can be about changes to policy or law, or
            to bring pressing local or private concerns to light.{' '}
          </Text>
          <Text sx={styles.text}>
            Petitions with 10,000 or more signatures will be brought to the
            relevant ministry by the Ministry of Culture, Community, and Youth
            (MCCY) for a government response.
          </Text>
        </Box>
        <Box sx={styles.sectionBox}>
          <Text sx={styles.subheading}>Who can submit or sign a petition?</Text>
          <Text sx={styles.text}>
            Any member of the public can submit or sign a petition, as long as
            they are eligible for a Singpass account. This includes Singapore
            citizens, Permanent Residents, and pass holders in Singapore above
            the age of 15.
          </Text>
        </Box>
        <Box sx={styles.sectionBox}>
          <Text sx={styles.subheading}>
            What is the process to submit a petition?
          </Text>
          <Text sx={styles.text}>
            Once you’ve drafted your petition, you’ll need 3 endorsers to back
            your petition non-anonymously before it can be published to gather
            signatures from the public. When the petition has collected 10,000
            or more signatures, it will be submitted to the relevant ministry.
          </Text>
          <Text sx={styles.text}>
            To get started, please refer to the{' '}
            <RouterLink to="/guidelines">
              <Text
                _hover={{
                  color: 'primary.600',
                }}
                as="u"
              >
                detailed process to submit a petition, and petition guidelines.
              </Text>
            </RouterLink>
          </Text>
          <Box mt="48px" mb="96px">
            <HowItWorksBanner isMaxThreeInGrid={true} />
          </Box>
        </Box>
        <Box sx={styles.sectionBox}>
          <Text sx={styles.subheading}>
            What happens when a petition reaches 10,000 signatures?
          </Text>
          <Text sx={styles.text}>
            Petitions will be brought to the relevant ministry by the Ministry
            of Culture, Community, and Youth (MCCY) within 30 days of it
            gathering 10,000 signatures. Once submitted, the relevant ministry
            will have 90 days to respond to the petition.
          </Text>
          <Text sx={styles.text}>
            The petitioner’s and endorsers’ names and email addresses will be
            provided to the ministry and the MCCY for any follow-ups that may be
            required.
          </Text>
        </Box>
        <Box sx={styles.sectionBox}>
          <Text sx={styles.subheading}>
            Can petitions be submitted anonymously?
          </Text>
          <Text sx={styles.text}>
            Petitioners and the 3 endorsers must submit a petition using their
            names, to help ensure accountability and transparency. Other
            signatories can choose to sign publicly or anonymously.
          </Text>
          <InfoBox>
            <Box>
              <Text>
                <b>How we protect anonymity:</b>
              </Text>
              <Text>
                We understand the potential social stigma associated with public
                civic participation in Singapore on certain topics. Open
                Government Products has engineered significant protections to
                protect your anonymity, even in the event of a complete data
                breach of PetitionsSG. We detail our engineering efforts{' '}
                <RouterLink to="/anonymity">
                  <Text
                    _hover={{
                      color: 'primary.600',
                    }}
                    as="u"
                  >
                    here
                  </Text>
                </RouterLink>
                , and our open source codebase is publicly available{' '}
                <Link
                  href="https://github.com/opengovsg/petitionsgovsg"
                  isExternal
                >
                  <Text
                    _hover={{
                      color: 'primary.600',
                    }}
                    as="u"
                  >
                    here
                  </Text>
                </Link>
                .
              </Text>
            </Box>
          </InfoBox>
        </Box>
        <Box sx={styles.sectionBox}>
          <Text sx={styles.subheading}>
            How long will it take for my petition to be considered?{' '}
          </Text>
          <Text sx={styles.text}>
            The time taken by a ministry to review and consider your petition
            once they receive it can vary. The ministry may reach out to the
            petitioner, endorsers, or other relevant organisations to request
            more information regarding a petition.
          </Text>
          <Text sx={styles.text}>
            Petitions with 10,000 or more signatures will receive a response
            within 90 days of it being submitted to the relevant ministry.
          </Text>
        </Box>
        <Box sx={styles.sectionBox}>
          <Text sx={styles.subheading}>
            Can my petition be considered in parliament?
          </Text>
          <Text sx={styles.text}>
            Currently, petitions with the required number of signatures cannot
            be guaranteed a debate in parliament, only submission to the
            relevant ministry for a response. If you would like your cause to be
            presented to Parliament, you can approach a Member of Parliament
            separately to sponsor and submit a written petition.
          </Text>
        </Box>
      </Box>
    </>
  )
}

export default About
