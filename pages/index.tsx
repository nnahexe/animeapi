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
  Container,
} from "@chakra-ui/react";
import Link from "next/link";
// created interface imports
import { Character, GetCharacterResults } from "../types";
// npx create-next-app@latest --ts
// typescript props
import { GetStaticProps, NextPage } from "next";
// fix image on npm run build
import imageLoader from "../imageLoader";
import { useState } from "react";
import { useQuery, dehydrate, QueryClient } from "@tanstack/react-query";
import { getMoreCharacters } from "../utils/queries";
import { useRouter } from "next/router";

// next page proper types in SSG, SSR, ISR
const Home = ({ characters }) => {
  // console.log(characters);
  const [page, setPage] = useState(1);
  const router = useRouter();
  console.log(router);
  const [isSmallerThan1500, isSmallerThan1750] = useMediaQuery([
    "(max-width: 1500px)",
    "(max-width: 1750px)",
  ]);

  console.log(`page number ${page}`);
  return (
    <>
      <Box className="centerH">
        <Button
          onClick={() => router.push(`/${page - 1}`)}
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
          onClick={() => router.push(`/${page + 1}`)}
        >
          Next
        </Button>
      </Box>

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
        {characters.map(({ name, id, image }) => {
          return (
            <Link key={id} href={`/characters/${id}`}>
              <GridItem
                my={8}
                py={10}
                px={8}
                w={isSmallerThan1500 ? 300 : 480}
                className="cursor-pointer border-2 centerV rounded-lg border-violet-500"
              >
                <Text fontSize="2xl" m={6}>
                  {name}
                </Text>
                {/* unoptimized = true already hosted api's */}
                <Image
                  className="rounded-lg"
                  loader={imageLoader}
                  unoptimized
                  width={300}
                  height={300}
                  src={image}
                  alt="api-img"
                  objectFit="cover"
                />
              </GridItem>
            </Link>
          );
        })}
      </Grid>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  const { data } = await axios.get("https://rickandmortyapi.com/api/character");
  return {
    props: {
      characters: data.results,
    },
  };
};
