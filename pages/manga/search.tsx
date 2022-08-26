import {
  useMediaQuery,
  Box,
  Flex,
  Heading,
  Input,
  Button,
  Grid,
  HStack,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMoreMangaSearch } from "../../utils/queries";
import imageLoader from "../../imageLoader";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { getSearchedManga } from "../../features/anime/animeSlice";
const search = () => {
  const dispatch = useDispatch();
  const [isSmallerThan1500, isSmallerThan1750, smaller550] = useMediaQuery([
    "(max-width: 1500px)",
    "(max-width: 1750px)",
    "(max-width: 550px)",
  ]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, refetch } = useQuery(
    ["getmoremangasearch", search, page],
    () => getMoreMangaSearch(search, page),
    {
      enabled: false,
      keepPreviousData: true,
    }
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    if (search && page) {
      // dispatch(getSearchedManga(data));
      queryClient.prefetchQuery(["getmoremangasearch", search, page], () =>
        getMoreMangaSearch(search, page)
      );
    }
  }, [data, page, queryClient]);

  const handleNext = (page) => {
    setPage(page + 1);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // dispatch(getSearchedManga(data))
    const dataParsed = await refetch();

    dispatch(getSearchedManga(dataParsed.data));
  };

  return (
    <Flex py={20} className="centerV">
      <form onSubmit={handleSubmit}>
        <HStack flexDir={smaller550 ? "column" : "row"}>
          <Input
            width={smaller550 ? 300 : 400}
            mb={smaller550 && 10}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="lg"
            placeholder="search manga..."
          />
          <Button type="submit" w={180} size="lg">
            Search
          </Button>
        </HStack>
      </form>

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
        {data?.map((anime, idx) => {
          return (
            <Link href={`/manga/${anime.mal_id}`} key={idx}>
              <Flex mx={20} mt={20} className="centerV cursor-pointer">
                <Heading
                  py={12}
                  fontSize="2xl"
                  fontWeight={500}
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
                  unoptimized
                  loader={imageLoader}
                  alt="image-loader"
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
    </Flex>
  );
};

export default search;
