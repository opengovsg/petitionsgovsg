import { Icon } from '@chakra-ui/react'
import { BiInfoCircle } from 'react-icons/bi'
import { Banner } from '../Banner/Banner.component'
import { Text, HStack, Button } from '@chakra-ui/react'
import PublishButton from '../PublishButton/PublishButton.component'

interface PublishButtonProps {
  postId: string | undefined
}

export const PreviewBanner = ({
  postId,
}: PublishButtonProps): JSX.Element | null => {
  return (
    <Banner>
      <HStack spacing="4">
        <HStack>
          <Icon as={BiInfoCircle} />
          <Text>
            This is a preview only. To proceed, click on publish petition. To
            edit, click on edit petition.
          </Text>
        </HStack>
        <Button
          bg="transparent"
          variant="outline"
          _hover={{ bg: 'primary.600' }}
        >
          Edit petition
        </Button>
        <PublishButton postId={postId} />
      </HStack>
    </Banner>
  )
}
