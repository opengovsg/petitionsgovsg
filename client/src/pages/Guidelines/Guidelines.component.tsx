import {
  useMultiStyleConfig,
  Text,
  Box,
  List,
  ListItem,
  OrderedList,
  UnorderedList,
} from '@chakra-ui/react'

const Guidelines = (): JSX.Element => {
  const styles = useMultiStyleConfig('About', {})

  return (
    <>
      <Box sx={styles.base}>
        <Text sx={styles.heading}>Submission Process and Guidelines</Text>
        <Text sx={styles.subheading}>How to submit a petition</Text>
        <Box sx={styles.sectionBox}>
          <OrderedList sx={styles.text}>
            <ListItem sx={styles.listHeading}>Start a petition</ListItem>
            <Text sx={styles.text}>
              Follow the Guidelines for Petitions below to draft your petition –
              it helps to have a clear objective, and to know which agency you
              would like to submit it to. You will be given a private link you
              can use to edit your petition, or share with endorsers. Remember,
              your name will be publicly visible on the petition once it is
              published.
            </Text>
            <ListItem sx={styles.listHeading}>
              Formalise it with 3 endorsers
            </ListItem>
            <Text sx={styles.text}>
              Get 3 people to back your petition as endorsers. They will need to
              sign non-anonymously, and their names will also appear on the
              petition once it is published. A petition can’t be edited once it
              has at least one endorser, so it helps to have a final version
              ready before you share it.
            </Text>
            <ListItem sx={styles.listHeading}>Publish your petition</ListItem>
            <Text sx={styles.text}>
              Your petition will automatically be published and publicly visible
              on the PetitionsSG platform once it has 3 endorsers.
            </Text>
            <ListItem sx={styles.listHeading}>Gather signatures</ListItem>
            <Text sx={styles.text}>
              Once published, a petition is ready for public support – you will
              need to gather 10,000 signatures before it closes in 90 days.
              Signatories will need to log in via Singpass before they can sign,
              but can choose to sign anonymously.
            </Text>
          </OrderedList>
          <Text sx={styles.text}>
            Petitions that reach 10,000 signatures will submitted to the
            relevant ministry within 30 days for their consideration, and they
            will have 90 days to respond to it.
          </Text>
          <Text sx={styles.text}>
            Petitions that do not reach 10,000 signatures within 90 days, as
            well as petitions that are rejected because they received
            significant reports against them, will be stored in an archive that
            is available for public discourse.
          </Text>
        </Box>
        <Box sx={styles.sectionBox}>
          <Text sx={styles.subheading}>Guidelines</Text>
          <Text sx={styles.text}>
            These guidelines are meant to help petitioners draft an effective
            petition, so the relevant ministry can understand the issue at hand,
            and decide how best to respond to it.
          </Text>
          <Text sx={styles.text}>
            Following these guidelines does not guarantee that the petition’s
            cause will necessarily be actioned or implemented by a ministry.
          </Text>
          <Text sx={styles.listHeading}>Petitions must:</Text>
          <UnorderedList sx={styles.text}>
            <ListItem>Be written in English</ListItem>
            <ListItem>Use respectful language</ListItem>
            <ListItem>Be serious in intent, and focus on a solution</ListItem>
            <ListItem>
              Not include statements that cannot be authenticated, such as
              defamatory information or unfounded allegations
            </ListItem>
            <ListItem>
               As a reminder, the petitioner’s and endorsers’ names will be
              visible on a petition once it is published.  
            </ListItem>
          </UnorderedList>
          <Text sx={styles.listHeading}>Petitions should not:</Text>
          <UnorderedList sx={styles.text}>
            <ListItem>
              Attack, criticise, or negatively focus on an individual or group
              of people because of characteristics such as their age,
              disability, ethnic identity, gender, medical condition,
              nationality, race, religion, sex, or sexual orientation
            </ListItem>
            <ListItem>
              Be an advertisement, spam, or promote a specific product or
              service
            </ListItem>
            <ListItem>
              Be a duplicate of an existing petition that is already open
            </ListItem>
            <ListItem>
              Cause personal distress or loss to a member of the public; this
              includes petitions that could cause grief or shock to a member of
              the public without their consent
            </ListItem>
            <ListItem>Contain swearing or other offensive language</ListItem>
            <ListItem>
              Include statements that cannot be authenticated, such as
              defamatory information, or unfounded allegations
            </ListItem>
            <ListItem>
              Name individual officials of public or private bodies, unless they
              are senior managers
            </ListItem>
          </UnorderedList>
          <Text sx={styles.text}>
            The PetitionsSG platform is designed to give the public a way to
            call for meaningful change, and is built on a foundation of trust,
            transparency, and accountability. If you are a petitioner or an
            endorser, consider how you frame your cause so it can be understood
            by the public, as well as the relevant ministry.
          </Text>

          <Text sx={styles.text}>
            While there is no active moderation or approval process, if a
            petition gathers significant reports against it, a committee will
            convene to deliberate whether to reject the petition based on the
            petition guidelines. All rejected petitions will still be publicly
            accessible on PetitionsSG with the reason for rejection. 
          </Text>
        </Box>
      </Box>
    </>
  )
}

export default Guidelines
