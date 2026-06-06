import React from 'react'
import {
  Button,
  useDisclosure,
  Text,
  Image,
  Flex,
  Box,
  VStack,
} from '@chakra-ui/react'
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog'
import { FaInfo } from 'react-icons/fa'

const UserProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <DialogRoot size="md" isOpen={isOpen} onClose={onClose} isCentered>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            borderRadius="xl"
            color="gray.600"
            _hover={{ bg: 'gray.100' }}
            _active={{ bg: 'gray.100' }}
            _focus={{ bg: 'gray.100' }}
            _expanded={{ bg: 'gray.100' }}
          >
            <FaInfo />
          </Button>
        </DialogTrigger>
        <DialogContent
          bg="white"
          borderRadius="2xl"
          maxW="400px"
          mx={4}
          boxShadow="0 20px 60px rgba(0, 0, 0, 0.12)"
        >
          <DialogHeader px={6} pt={6} pb={0}>
            <DialogTitle fontSize="xl" fontWeight="bold" color="gray.800" textAlign="center">
              Profil utilizator
            </DialogTitle>
          </DialogHeader>

          <DialogBody px={6} py={6}>
            <VStack gap={5}>
              <Box position="relative">
                <Image
                  borderRadius="full"
                  boxSize="120px"
                  src={user.pic}
                  alt="Profile Picture"
                  borderWidth="4px"
                  borderColor="blue.50"
                  objectFit="cover"
                />
              </Box>

              <VStack gap={1}>
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                  {user.name}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Membru activ
                </Text>
              </VStack>

              <Flex
                w="100%"
                direction="column"
                gap={1}
                bg="gray.50"
                borderRadius="xl"
                px={5}
                py={4}
                borderWidth="1px"
                borderColor="gray.100"
              >
                <Text fontSize="xs" fontWeight="semibold" color="gray.400" textTransform="uppercase" letterSpacing="0.05em">
                  Email
                </Text>
                <Text fontSize="sm" color="gray.700" fontWeight="medium">
                  {user.email}
                </Text>
              </Flex>
            </VStack>
          </DialogBody>

          <DialogFooter px={6} pb={6} pt={0}>
            <DialogActionTrigger asChild>
              <Button
                w="100%"
                borderRadius="xl"
                py={6}
                fontWeight="semibold"
                bg="gray.100"
                color="gray.700"
                _hover={{ bg: 'gray.200' }}
                onClick={onClose}
              >
                Închide
              </Button>
            </DialogActionTrigger>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </>
  )
}

export default UserProfileModal
