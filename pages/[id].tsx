import axios from "axios";
import { getMoreCharacters } from "../utils/queries";
import { useQuery, dehydrate, QueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  useMediaQuery,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import Image from "next/image";
import imageLoader from "../imageLoader";
import Link from "next/link";
import React from "react";

const NextCharacters = () => {
  const router = useRouter();
  const [isSmallerThan1500, isSmallerThan1750] = useMediaQuery([
    "(max-width: 1500px)",
    "(max-width: 1750px)",
  ]);

  let pageID = typeof router.query.id === "string" && router.query.id;
  const [nextPage, setNextPage] = useState(parseInt(pageID));
  const { data, isPreviousData } = useQuery(
    ["morecharacters", +pageID],
    //  // in dynamic route we start back at 1 so we add another to go page 2
    () => getMoreCharacters(+pageID + 1)
  );

  console.log(data);

  if (!data) {
    return <div>Loading...</div>;
  }
  // console.log(`the next page is ${nextPage}`);

  return (
    <>
      <Box className="centerH">
        <Button
          disabled={nextPage === 1}
          onClick={() => {
            setNextPage(nextPage - 1);
            router.push(`/${nextPage - 1}`);
          }}
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
          onClick={() => {
            setNextPage(nextPage + 1);
            router.push(`/${nextPage + 1}`);
          }}
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
        {data?.results.map(({ name, id, image }) => {
          return (
            <Link key={id} href={`/characters/${id}`}>
              <GridItem
                my={8}
                mx={10}
                p={10}
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

export default NextCharacters;

export const getStaticPaths = async () => {
  const { data } = await axios.get("https://rickandmortyapi.com/api/character");

  const paths = data.results.map(({ id }) => {
    return { params: { id: id.toString() } };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  // new client for each page request
  const queryClient = new QueryClient();
  //   string id
  //  this file named [page]
  const id = params.id;
  await queryClient.prefetchQuery(["morecharacters", id], () =>
    //   we started page 1 so add another
    getMoreCharacters(+id + 1)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
