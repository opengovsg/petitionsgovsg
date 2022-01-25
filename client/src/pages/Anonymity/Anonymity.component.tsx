import {
  useMultiStyleConfig,
  Text,
  Box,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react'

const Anonymity = (): JSX.Element => {
  const styles = useMultiStyleConfig('Anonymity', {})

  return (
    <>
      <Box sx={styles.base}>
        <Text sx={styles.heading}>Anonymity on PetitionsSG</Text>
        <Text sx={styles.subheading}>
          How we protect the anonymity of signatories
        </Text>
        <Box sx={styles.sectionBox}>
          <Text sx={styles.text}>
            PetitionsSG offers the option to sign a petition anonymously,
            because we understand public civic participation in Singapore on
            certain topics could come with some social stigma attached. Open
            Government Products has engineered significant protections for
            anonymity on PetitionsSG, even in the event of a complete data
            breach of the platform.
          </Text>
          <Text sx={styles.text}>
            <b>
              These engineering features prevent anyone, including the
              government and Open Government Products, from personally
              identifying you if you have signed a petition anonymously.
            </b>
          </Text>
          <Text sx={styles.text}>
            They're broadly outlined below, while a link to our open-source
            codebase is available further down for anyone who would like to vet
            our engineering work:
          </Text>
          <UnorderedList sx={styles.text}>
            <ListItem sx={styles.listHeading}>
              Separation of Singpass data from PetitionsSG.
            </ListItem>
            <Text sx={styles.text}>
              Creating or signing a petition requires logging in with Singpass,
              to ensure the legitimacy of opinions and prevent trolling.
              PetitionsSG uses sgID, a privacy-preserving feature within
              Singpass, to retrieve your name, and an encrypted identifier
              unique to the PetitionsSG platform (this is <b>not</b> your NRIC).
            </Text>
            <Text sx={styles.text}>
              This identifier only proves your authenticity to allow you to sign
              or submit a petition, but is never stored in a database on
              PetitionsSG. Your identifier and Singpass name are stored in a
              private web token on the device you used to sign into PetitionsSG.
            </Text>
            <Text sx={styles.text}>
              Other details like your address and NRIC are{' '}
              <b>never retrieved</b> from Singpass, so can never be leaked from
              PetitionsSG.
            </Text>
          </UnorderedList>
          <UnorderedList sx={styles.text}>
            <ListItem sx={styles.listHeading}>
              Separation of anonymous signatures from public signatures and
              petition submissions
            </ListItem>
            <Text sx={styles.text}>
              If you submit or endorse a petition, or sign one{' '}
              <b>publicly using your full name</b>, we store two key details:
            </Text>
            <UnorderedList sx={styles.list}>
              <ListItem sx={styles.listItem}>Your name</ListItem>
              <ListItem sx={styles.listItem}>
                An anonymous encrypted digital signature (known as a{' '}
                <b>petition 'salt'</b>) unique to that petition
              </ListItem>
            </UnorderedList>
            <Text sx={styles.text}>
              If you then sign another petition <b>anonymously</b>, we only
              record:
            </Text>
            <UnorderedList sx={styles.list}>
              <ListItem sx={styles.listItem}>
                An anonymous encrypted digital signature (a{' '}
                <b>different petition 'salt'</b>) unique to that petition
              </ListItem>
              <ListItem sx={styles.listItem}>
                Why you signed the petition (only if you filled the optional
                field)
              </ListItem>
            </UnorderedList>
            <Text sx={styles.text}>
              Each petition has a different 'salt', so anonymous signatories
              cannot be linked across petitions. And since your sgID identifier
              isn't stored in the PetitionsSG database, your full name can never
              be connected to petitions you chose to sign anonymously, even if
              the platform database is compromised.
            </Text>
          </UnorderedList>
        </Box>

        <Text sx={styles.subheading}>Our open-source codebase</Text>
        <Box sx={styles.sectionBox}>
          <Text sx={styles.text}>
            In the interest of transparency, our code is openly available here,
            for members of the public to vet our engineering work.{' '}
          </Text>
          <Text sx={styles.text}>
            If you have ideas for how we could further improve anonymity
            protections on PetitionsSG, please get in touch.
          </Text>
        </Box>
      </Box>
    </>
  )
}

export default Anonymity
