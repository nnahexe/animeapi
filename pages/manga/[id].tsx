import { Flex, Box, Text, Heading } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { getMangaDetails } from "../../utils/queries";
import { useRouter } from "next/router";
import Image from "next/image";
import imageLoader from "../../imageLoader";
import {
  useQuery,
  hydrate,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
// manga by id
const MangaDetails = () => {
  const router = useRouter();
  const id = router.query.id;
  const { data, isError, isLoading } = useQuery(["mangadetails", id], () =>
    getMangaDetails(id)
  );
  console.log(data);
  return (
    <Flex width="1200px" mx="auto" py={20} className="centerV">
      <Heading py={6} textAlign="center" fontSize="4xl" color="blue.500">
        {data?.title}
      </Heading>
      <Flex className="centerH border-4 my-10">
        <Heading
          px={4}
          py={6}
          textAlign="center"
          fontSize="4xl"
          color="gray.500"
        >
          Rank {data?.rank}
        </Heading>
        <Heading
          px={4}
          py={6}
          textAlign="center"
          fontSize="4xl"
          color="yellow.500"
        >
          Score {data?.score}
        </Heading>
        <Heading
          px={4}
          py={6}
          textAlign="center"
          fontSize="4xl"
          color="blue.500"
        >
          Chapters: {data?.chapters}
        </Heading>
      </Flex>

      <Image
        className="rounded-xl"
        src={data?.images.jpg.large_image_url}
        width={500}
        height={400}
        loader={imageLoader}
        unoptimized
        alt="image"
        objectFit="cover"
      />
      <Text fontWeight="bold" color="blue.500" py={8} fontSize="2xl">
        Members: {data?.members}
      </Text>
      <Text py={4} fontSize="xl">
        {data?.synopsis}
      </Text>
    </Flex>
  );
};

export default MangaDetails;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const id = query.id;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["mangadetails", id], () =>
    getMangaDetails(id)
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
