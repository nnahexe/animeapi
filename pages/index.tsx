import Image from "next/image";
import { getAnime } from "../features/anime/animeSlice";
import {
  Box,
  Text,
  Button,
  useMediaQuery,
  Grid,
  Heading,
  Flex,
  useColorMode,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import Link from "next/link";
// created interface imports
import { Character, GetCharacterResults } from "../types";
import { GetStaticProps, NextPage } from "next";
import imageLoader from "../imageLoader";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { wrapper } from "../utils/store";
import { Store } from "@reduxjs/toolkit";
import { addToFavorite } from "../features/anime/animeSlice";
import { FaPlus } from "react-icons/fa";

import {
  getPopularAnimes,
  getMoreAnimes,
  getAnimeDetails,
} from "../utils/queries";

const Home = ({ animes }) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(2);
  const [moreData, setMoreData] = useState(animes);
  const [favorites, setFavorites] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const router = useRouter();
  const [isSmallerThan1500, isSmallerThan1750] = useMediaQuery([
    "(max-width: 1500px)",
    "(max-width: 1750px)",
  ]);
  const { colorMode } = useColorMode();

  useEffect(() => {
    const uniqueFavorites = [...(new Set(favorites) as any)];
    console.log(uniqueFavorites);
    dispatch(addToFavorite(uniqueFavorites));
  }, [favorites, dispatch]);

  const handleNext = async (page) => {
    setPage(page + 1);
    console.log(page);
    const moreAnimes = await getMoreAnimes(page);
    console.log(moreAnimes);
    setMoreData([...animes, ...moreAnimes]);
  };

  const addToFavorites = (animeId) => {
    // moreData client side render
    const match = moreData.find((anime) => anime.mal_id === animeId);

    // setCurrentId(animeId);
    // console.log(currentId);
    // console.log(match);
    // setFavorites((prevFavorites) => [...prevFavorites, match]);
    // console.log(favorites);
    // dispatch(addToFavorite({ favorited: favorites }));

    // router.push("/favorited");
  };

  const handleSubmit = (e, animeId) => {
    e.preventDefault();
    const match = moreData.find((anime) => anime.mal_id === animeId);
    console.log(match);
    setFavorites([...favorites, match]);
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
        Top Anime
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
            <Box className="centerV" key={idx}>
              <form
                className="centerV"
                onSubmit={(e) => handleSubmit(e, anime.mal_id)}
              >
                <Link href={`/${anime.mal_id}`}>
                  <Flex className="centerV cursor-pointer">
                    <Heading
                      py={4}
                      fontSize="3xl"
                      textAlign="center"
                      color="blue.500"
                    >
                      {anime.title}
                    </Heading>
                    <Heading
                      py={2}
                      color={colorMode === "dark" ? "#ffffff" : "gray.500"}
                    >
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

                <HStack
                  onClick={() => addToFavorites(anime.mal_id)}
                  cursor="pointer"
                  gap={2}
                  my={8}
                >
                  {/* <Heading fontSize="2xl">Add to Favorites</Heading> */}
                  <Button my={4} size="lg" type="submit">
                    Add to favorites
                  </Button>
                  {/* <IconButton aria-label="add" icon={<FaPlus />} /> */}
                </HStack>
              </form>
            </Box>
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

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  const data = await getPopularAnimes();
  const animes = data;
  store.dispatch(getAnime({ animes: animes }));

  return {
    props: {
      animes,
    },
  };
});

/*
export const getStaticProps = async () => {

  const data = await getPopularAnimes();
  const animes = data.data;

  return {
    props: {
      animes,
    },
  };
};

*/
