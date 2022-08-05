import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPaths } from "next";
import { Box, Text, Heading, Flex } from "@chakra-ui/react";
// [] for dynamic route
import axios from "axios";
import Image from "next/image";
import imageLoader from "../../imageLoader";
import { useState, useEffect } from "react";

import { useQuery, dehydrate, QueryClient } from "@tanstack/react-query";
// interfaces
import { GetCharacterResults, Info } from "../../types";

// rick and morty api is paginated defaults to 20 characters
/*
TODOS 
ssr (context.query.id) in ssg(context.params.id)
typescript crash course
https://www.youtube.com/watch?v=jrKcJxF0lAU
chakra ui practice
 todo add pagination more than 20 characters

*/
// array of id's
const getEpisodes = async (episodeIds) => {
  return await axios.get(
    `https://rickandmortyapi.com/api/episode/${episodeIds}`
  );
};

const CharacterPage = ({ character }) => {
  const router = useRouter();
  const paramID = router.query.id;

  if (!paramID) {
    return <div>Loading...</div>;
  }

  const {
    id,
    image,
    episode: episodes,
    location,
    name,
    origin,
    species,
    status,
  } = character;

  // episode ids are different
  console.log(episodes);

  const episodeIds = episodes.map((episode) => {
    return +episode.split("e/")[1];
  });

  const { isLoading, error, data } = useQuery(["episodes"], () =>
    getEpisodes(episodeIds)
  );

  const renderEpisodes = () => {
    if (
      typeof data === "object" &&
      typeof data !== null &&
      !Array.isArray(data.data)
    ) {
      return (
        <Box key={data.data.id}>
          <Heading my={4} fontWeight={500}>
            {data.data.name}
          </Heading>
          <Text fontSize="lg">{data.data.episode}</Text>
          <Text fontSize="lg">{data.data.air_date}</Text>
        </Box>
      );
    } else {
      return data?.data.map(({ id, name, air_date, episode, created }) => {
        return (
          <Box key={id}>
            <Heading my={4} fontWeight={500} fontSize="3xl">
              {name}
            </Heading>
            <Text fontSize="lg">Episode: {episode}</Text>
            <Text fontSize="lg">Air Date: {air_date}</Text>
          </Box>
        );
      });
    }
  };

  return (
    <Box my={20} p={10} className=" centerV mx-auto" key={id}>
      <Heading m={4} as="h2" fontWeight={400}>
        {name}
      </Heading>
      <Image
        width={300}
        height={300}
        className="rounded-lg"
        src={image}
        alt="alt-img"
        loader={imageLoader}
        unoptimized
        objectFit="cover"
      />
      <Flex
        mt={8}
        className="border-2 border-blue-500 px-8 pb-8 rounded-lg"
        flexDir="column"
        justifyContent="center"
        alignItems="flex-start"
      >
        <Text
          fontWeight={500}
          mt={8}
          fontSize="2xl"
          color="#2C73D2"
          className="font-bold"
        >
          <span className="text-black font-medium">Status:</span> {status}
        </Text>
        <Text
          fontWeight={500}
          fontSize="2xl"
          color="#2C73D2"
          className="font-bold"
        >
          <span className="text-black font-medium">Species:</span> {species}
        </Text>
        <Text
          fontWeight={500}
          fontSize="2xl"
          color="#2C73D2"
          className="font-bold"
        >
          <span className="text-black font-medium">Location:</span>{" "}
          {location.name}
        </Text>
        <Text
          fontWeight={500}
          fontSize="2xl"
          color="#2C73D2"
          className="font-bold"
        >
          <span className="text-black font-medium">Origin:</span> {origin.name}
        </Text>
        <Text
          fontWeight={500}
          fontSize="2xl"
          color="#2C73D2"
          className="font-bold"
        >
          <span className="text-black font-medium">Episode Appearances:</span>{" "}
        </Text>
        {renderEpisodes()}
      </Flex>
    </Box>
  );
};

export default CharacterPage;

export const getStaticPaths = async () => {
  const { data } = await axios.get("https://rickandmortyapi.com/api/character");

  //   const { results }: GetCharacterResults = await res.json();

  const results = data.results;
  const paths = results.map(({ id }) => {
    return { params: { id: id.toString() } };
  });
  return {
    paths,
    // for pagination need true
    fallback: true,
  };
};

export const getStaticProps = async ({
  params,
}: {
  params: { id: string };
}) => {
  const res = await fetch(
    `https://rickandmortyapi.com/api/character/${params.id}`
  );

  const character = await res.json();
  return {
    props: {
      character,
    },
  };
};
