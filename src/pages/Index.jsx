import { Box, Container, Flex, Text, VStack, Link, IconButton, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { useEvents } from "../integrations/supabase/index.js";
import { FaHome, FaInfoCircle } from "react-icons/fa";

const Index = () => {
  const { data: events, error, isLoading } = useEvents();
  return (
    <Container maxW="container.xl" p={0}>
      <Flex as="nav" bg="blue.500" color="white" p={4} justifyContent="space-between" alignItems="center">
        <Text fontSize="xl" fontWeight="bold">MyApp</Text>
        <Flex>
          <Link href="/" p={2}>
            <IconButton aria-label="Home" icon={<FaHome />} size="lg" variant="ghost" color="white" />
          </Link>
          <Link href="/about" p={2}>
            <IconButton aria-label="About" icon={<FaInfoCircle />} size="lg" variant="ghost" color="white" />
          </Link>
        </Flex>
      </Flex>
      <Box as="main" p={4}>
        <VStack spacing={4}>
          <Text fontSize="2xl">Your Blank Canvas</Text>
          <Text>Chat with the agent to start making edits.</Text>
        {isLoading && <Spinner />}
          {error && (
            <Alert status="error">
              <AlertIcon />
              {error.message}
            </Alert>
          )}
          {events && events.map(event => (
            <Box key={event.id} p={4} shadow="md" borderWidth="1px">
              <Text fontSize="xl">{event.name}</Text>
              <Text>{event.description}</Text>
              <Text>{new Date(event.date).toLocaleDateString()}</Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </Container>
  );
};

export default Index;