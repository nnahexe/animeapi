import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import axios from "axios";
import {
  Box,
  Text,
  Button,
  useMediaQuery,
  Grid,
  GridItem,
  Heading,
  Flex,
  Container,
} from "@chakra-ui/react";
import Link from "next/link";
// created interface imports
import { Character, GetCharacterResults } from "../types";
// npx create-next-app@latest --ts
// typescript props
import { GetStaticProps, NextPage } from "next";
// fix image on npm run buildy

import imageLoader from "../imageLoader";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  getPopularAnimes,
  getMoreAnimes,
  getAnimeDetails,
} from "../utils/queries";

const Home = ({ animes }) => {
  const [page, setPage] = useState(2);
  const [moreData, setMoreData] = useState(animes);
  const router = useRouter();
  const [isSmallerThan1500, isSmallerThan1750] = useMediaQuery([
    "(max-width: 1500px)",
    "(max-width: 1750px)",
  ]);

  const handleNext = async (page) => {
    setPage(page + 1);
    console.log(page);
    const moreAnimes = await getMoreAnimes(page);
    console.log(moreAnimes);
    setMoreData([...animes, ...moreAnimes]);
  };

  return (
    <>
      <Heading
        as="h2"
        fontSize="7xl"
        fontWeight={400}
        color="purple.500"
        py={20}
        textAlign="center"
      >
        Popular Anime
      </Heading>
      <Grid
        className="
        justify-items-center
         content-evenly
 "
        templateColumns={
          isSmallerThan1500
            ? "1fr"
            : isSmallerThan1750
            ? "repeat(2, 1fr)"
            : "repeat(3, 1fr)"
        }
      >
        {moreData.map((anime, idx) => {
          return (
            <Link href={`/${anime.mal_id}`} key={idx}>
              <Flex className="centerV cursor-pointer">
                <Heading
                  py={4}
                  fontSize="3xl"
                  textAlign="center"
                  color="blue.500"
                >
                  {anime.title}
                </Heading>
                <Heading py={1} color="gray.600">
                  Rank {anime.rank}
                </Heading>
                <Image
                  className="rounded-xl"
                  src={anime?.images?.jpg.image_url}
                  loader={imageLoader}
                  unoptimized
                  width="400px"
                  height="400px"
                  objectFit="cover"
                />
              </Flex>
            </Link>
          );
        })}
      </Grid>

      <Box my={40} className="centerH">
        <Button
          disabled={+page === 1}
          _hover={{
            background: "#D65DB1",
          }}
          bg="#845EC2"
          color="#fff"
          p={6}
          w={200}
          mx={8}
          m={4}
        >
          Prev
        </Button>
        <Button
          _hover={{
            background: "#D65DB1",
          }}
          bg="#845EC2"
          color="#fff"
          p={6}
          w={200}
          mx={8}
          onClick={() => handleNext(page)}
        >
          Load More
        </Button>
      </Box>
    </>
  );
};

export default Home;

export const getStaticProps = async () => {
  const data = await getPopularAnimes();
  const animes = data.data;

  return {
    props: {
      animes,
    },
  };
};
