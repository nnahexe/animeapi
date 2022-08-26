import React from "react";
import {
  Box,
  Container,
  Text,
  Heading,
  Icon,
  useMediaQuery,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FaGithubAlt } from "react-icons/fa";
import Link from "next/link";
const Header = () => {
  const [isSmallerThan400, isSmaller800] = useMediaQuery([
    "(max-width: 400px)",
    "(max-width: 800px)",
  ]);
  const { colorMode, toggleColorMode } = useColorMode();

  console.log(isSmaller800);
  const handleColorMode = () => {
    toggleColorMode();
  };
  return (
    <Box>
      <Box
        className="flex justify-between items-center"
        px={10}
        as="nav"
        h="8vh"
        py={4}
        bgGradient="linear(to-l, #7928CA, #FF0080)"
      >
        <Box color="#fff" className={isSmallerThan400 ? "centerV" : "centerH"}>
          <Link href="/">
            <Heading cursor="pointer" mx={2} textAlign="center" as="h2">
              AnimeList API
            </Heading>
          </Link>

          <Icon
            style={{ display: isSmallerThan400 ? "none" : "block" }}
            mx={4}
            fontSize={isSmallerThan400 ? "1.6rem" : "3rem"}
            as={FaGithubAlt}
          />
        </Box>
        <Box className="centerH">
          {colorMode === "dark" ? (
            <IconButton
              onClick={handleColorMode}
              aria-label="light-mode"
              icon={<SunIcon />}
            />
          ) : (
            <IconButton
              onClick={handleColorMode}
              aria-label="dark-mode"
              icon={<MoonIcon />}
            />
          )}
        </Box>
      </Box>

      <Container
        width="100%"
        className={isSmaller800 ? "centerV text-2xl" : "centerH text-2xl"}
        my={14}
        py={4}
        fontWeight={300}
      >
        <Text py={4} className="font-bold" fontWeight={400} mx={6}>
          <Link href="/anime/search">Search Anime</Link>
        </Text>
        <Text py={4} className="font-bold" fontWeight={400} mx={6}>
          <Link href="/manga/top">Top Manga</Link>
        </Text>
        <Text py={4} className="font-bold" fontWeight={400} mx={6}>
          <Link href="/manga/search">Search Manga</Link>
        </Text>
        <Text py={4} className="font-bold" fontWeight={400} mx={6}>
          <Link href="/favorited">Favorites</Link>
        </Text>
      </Container>
    </Box>
  );
};

export default Header;
