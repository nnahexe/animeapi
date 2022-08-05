import React from "react";
import {
  Box,
  Container,
  Text,
  Heading,
  Icon,
  useMediaQuery,
} from "@chakra-ui/react";
import { FaGithubAlt } from "react-icons/fa";
import Link from "next/link";
const Header = () => {
  const [isSmallerThan400] = useMediaQuery("(max-width: 400px)");
  return (
    <Box>
      <Box
        className="centerV"
        h="5vh"
        py={4}
        bgGradient="linear(to-l, #7928CA, #FF0080)"
      >
        <Box color="#fff" className={isSmallerThan400 ? "centerV" : "centerH"}>
          <Heading mx={2} textAlign="center" as="h2">
            Rick and Morty API
          </Heading>
          <Icon
            style={{ display: isSmallerThan400 ? "none" : "block" }}
            mx={4}
            fontSize={isSmallerThan400 ? "1.6rem" : "3rem"}
            as={FaGithubAlt}
          />
        </Box>
      </Box>

      <Container
        my={14}
        py={4}
        fontWeight={300}
        className={isSmallerThan400 ? "centerV text-2xl" : "centerH text-2xl"}
      >
        <Text className="font-bold" mx={6} color="#2C73D2">
          <Link href="/">Home</Link>
        </Text>

        <Text className="font-bold" fontWeight={400} mx={6}>
          <Link href="/character">Search Character</Link>
        </Text>
      </Container>
    </Box>
  );
};

export default Header;
