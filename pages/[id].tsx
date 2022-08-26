import { GetStaticPaths, GetStaticProps, GetServerSideProps } from "next";
import {
  getAnimeDetails,
  getPopularAnimes,
  getMoreAnimes,
} from "../utils/queries";
import { Flex, Box, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import imageLoader from "../imageLoader";
const AnimeDetails = () => {
  const router = useRouter();
  const id = router.query.id;
  const {
    data: animeDetails,
    error,
    isLoading,
  } = useQuery(["animedetails", id], () => getAnimeDetails(id));
  if (isLoading) {
    return <div>loading...</div>;
  }
  return (
    <Flex width="1000px" mx="auto" py={20} className="centerV">
      <Heading textAlign="center" fontSize="5xl" color="blue.500">
        {animeDetails.title}
      </Heading>
      <Text py={4} fontSize="3xl" color="gray.500">
        ID: {animeDetails.mal_id}
      </Text>
      <Flex className="centerH">
        <Heading py={4} px={4} fontSize="4xl" color="blue.500">
          Genres
        </Heading>
        {animeDetails.genres.map(({ mal_id, type, name }) => {
          return (
            <Box key={mal_id} px={1}>
              <Text fontSize="2xl">{name}, </Text>
            </Box>
          );
        })}
      </Flex>

      <Text py={4} fontSize="2xl">
        Members: {animeDetails.members}
      </Text>
      <Text color="purple.500" py={4} fontSize="4xl">
        Episodes: {animeDetails.episodes}
      </Text>
      <Image
        src={animeDetails.images.jpg.large_image_url}
        loader={imageLoader}
        unoptimized
        width={300}
        height={400}
        className="rounded-lg"
        alt="image-anime"
        objectFit="cover"
      />
    </Flex>
  );
};

export default AnimeDetails;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  let id = 1;
  if (query?.id) {
    id = +query?.id;
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["animedetails", id], async () =>
    getAnimeDetails(id)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

/*

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await getPopularAnimes();
  const animes = data.data;
  const paths = animes.map((a) => {
    return { params: { id: a.mal_id.toString() } };
  });
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const animeDetails = await getAnimeDetails(params.id);
  return {
    props: {
      animeDetails,
    },
  };
};

*/
