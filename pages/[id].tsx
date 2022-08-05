import axios from "axios";
import { getMoreCharacters } from "../utils/queries";
import { useQuery, dehydrate, QueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import Image from "next/image";
import imageLoader from "../imageLoader";
import Link from "next/link";

import React from "react";

const NextCharacters = () => {
  const router = useRouter();
  //   defaults string value

  let pageID = typeof router.query.id === "string" && router.query.id;
  console.log(pageID);

  const [nextPage, setNextPage] = useState(+pageID);
  const { data, isPreviousData } = useQuery(
    ["morecharacters", pageID],
    //  // in dynamic route we start back at 1 so we add another to go page 2
    () => getMoreCharacters(pageID + 1),
    // refetch
    { enabled: pageID.length > 1 }
  );

  console.log(nextPage);

  console.log(`page number ${nextPage}`);
  return (
    <>
      <Box mt={20} className="centerH w-[1400px] mx-auto">
        <Button
          disabled={+nextPage === 1}
          onClick={() => {
            setNextPage(+nextPage - 1);
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
        >
          Prev
        </Button>
        <Button
          disabled={+nextPage === 42}
          onClick={() => {
            setNextPage(+nextPage + 1);
            router.push(`/${nextPage + 1}`);
          }}
          _hover={{
            background: "#D65DB1",
          }}
          bg="#845EC2"
          color="#fff"
          p={6}
          w={200}
        >
          Next
        </Button>
      </Box>
      <div className="centerH w-[1400px] mt-20 mx-auto flex-wrap">
        {data?.results.map(({ name, id, image }) => {
          return (
            <Link key={id} href={`/characters/${id}`}>
              <Box
                my={8}
                mx={10}
                p={10}
                w={500}
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
              </Box>
            </Link>
          );
        })}
      </div>
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
    fallback: false,
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
