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

const CharacterPage = () => {
  const router = useRouter();
  const paramID = router.query.id;
  console.log(paramID);
  const [characterDetail, setCharacterDetail] = useState(null);

  if (!paramID) {
    return <div>Loading...</div>;
  }

  console.log("state...");
  console.log(characterDetail);
  // const {
  //   id,
  //   image,
  //   episode: episodes,
  //   location,
  //   name,
  //   origin,
  //   species,
  //   status,
  // } = character;

  // episode ids are different
  // console.log(episodes);

  // const episodeIds = episodes.map((episode) => {
  //   return +episode.split("e/")[1];
  // });
  // console.log("flkdsfksdlflsj");
  // console.log(episodeIds);

  const { isLoading, error, data } = useQuery(
    ["characterdetails", paramID],
    () => getCharacterDetails(paramID)
  );

  const {
    episode: episodes,
    gender,
    id,
    image,
    location,
    name,
    origin,
    species,
    status,
  } = data;

  console.log("under data");

  const episodeIds = episodes.map((e) => e.split("e/")[1]);
  console.log(episodeIds);

  useEffect(() => {
    apiData(episodeIds);
  }, []);

  const apiData = async (idArray) => {
    const { data } = await axios.get(
      `https://rickandmortyapi.com/api/episode/${idArray}`
    );

    setCharacterDetail(data);
  };

  if (!data) {
    return <div>loading...</div>;
  }

  /*
  const renderEpisodes = () => {

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

  */

  const renderEpisodes = () => {
    return characterDetail?.map((episode) => {
      return (
        <Box className="" key={episode.id}>
          <Heading py={4} fontWeight={400}>
            {episode.name}
          </Heading>
          <Text fontSize="lg">{episode.episode}</Text>
          <Text fontSize="lg">{episode.air_date}</Text>
        </Box>
      );
    });
  };

  return (
    <Box my={20} p={10} className=" centerV mx-auto">
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
          {/* <span className="text-black font-medium">Origin:</span> {origin.name} */}
        </Text>
        <Text
          fontWeight={500}
          fontSize="2xl"
          color="#2C73D2"
          className="font-bold"
        >
          {/* <span className="text-black font-medium">Episode Appearances:</span>{" "} */}
        </Text>
        {/* {renderEpisodes()} */}
      </Flex>
    </Box>
  );
};

export default CharacterPage;

const getCharacterDetails = async (id) => {
  const { data } = await axios.get(
    `https://rickandmortyapi.com/api/character/${id}`
  );
  return data;
};

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

export const getStaticProps = async ({ params }) => {
  // new client for each page request
  const queryClient = new QueryClient();
  const id = params?.id;

  await queryClient.prefetchQuery(["characterdetails", id], () =>
    //   we started page 1 so add another
    getCharacterDetails(id)
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
