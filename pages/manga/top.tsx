import {
  Box,
  Flex,
  Heading,
  Text,
  Grid,
  GridItem,
  useColorMode,
  Button,
  useMediaQuery,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { getTopManga, getMoreManga } from "../../utils/queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import imageLoader from "../../imageLoader";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToFavorite, getManga } from "../../features/anime/animeSlice";
import { wrapper } from "../../utils/store";
import { getMoreMangas } from "../../utils/queries";
import { getMangaPage } from "../../features/anime/animeSlice";
// client render react query
const top = ({ mangas }) => {
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(2);
  const [isSmallerThan1500, isSmallerThan1750] = useMediaQuery([
    "(max-width: 1500px)",
    "(max-width: 1750px)",
  ]);
  const { data: mangaPaginatedDatas, error: loadErr } = useQuery(
    ["moremanga", page],
    () => getMoreManga(page)
  );

  const [moreMangas, setMoreMangas] = useState(mangas);

  useEffect(() => {
    queryClient.prefetchQuery(["moremanga", page], () => getMoreManga(page));
  }, [mangaPaginatedDatas, page, queryClient]);

  const handlePrev = () => {
    setPage(page - 1);
  };

  const handleNext = async () => {
    setPage(page + 1);
    dispatch(getManga(mangaPaginatedDatas));
    dispatch(getMangaPage(page));
  };

  // console.log(page);

  const addMangaFavorites = (animeId) => {
    const match = mangaPaginatedDatas.filter(
      (manga) => manga.mal_id === animeId
    );
    const uniqueIds = [];
    const unique = mangaPaginatedDatas.filter((anime) => {
      const duplicateId = uniqueIds.includes(match[0].mal_id);
      if (!duplicateId) {
        uniqueIds.push(anime.mal_id);
        return true;
      }

      return false;
    });

    console.log(unique);

    dispatch(addToFavorite({ favorited: unique }));
  };

  return (
    <Flex py={10} className="centerV">
      <Heading py={20} fontWeight={500} fontSize="6xl" color="blue.500">
        Top Manga
      </Heading>
      <Grid
        justifyContent="center"
        alignItems="center"
        alignContent="center"
        justifyItems="center"
        templateColumns={
          isSmallerThan1500
            ? "1fr"
            : isSmallerThan1750
            ? "repeat(2, 1fr)"
            : "repeat(3, 1fr)"
        }
        gap={10}
      >
        {mangaPaginatedDatas?.map((manga) => {
          return (
            <Flex className="centerV" key={manga.mal_id}>
              <Link href={`/manga/${manga.mal_id}`}>
                <Flex className="centerV cursor-pointer">
                  <Heading
                    py={4}
                    fontSize="3xl"
                    textAlign="center"
                    color="blue.500"
                  >
                    {manga.title}
                  </Heading>
                  <Heading
                    py={2}
                    textAlign="center"
                    color={colorMode === "dark" ? "#ffffff" : "gray.500"}
                  >
                    Rank {manga.rank}
                  </Heading>
                  <Image
                    className="rounded-xl"
                    src={manga?.images?.jpg.image_url}
                    loader={imageLoader}
                    unoptimized
                    width="400px"
                    height="400px"
                    objectFit="cover"
                  />
                </Flex>
              </Link>
            </Flex>
          );
        })}
      </Grid>

      <Box my={40} className="centerH">
        <Button
          disabled={+page === 1}
          onClick={handlePrev}
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
          onClick={handleNext}
          disabled={+page === 1655}
        >
          Load More
        </Button>
      </Box>
    </Flex>
  );
};

export default top;

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  const data = await getTopManga();
  const mangas = data;
  store.dispatch(getManga(mangas));
  return {
    props: {
      mangas,
    },
  };
});

/*

export const getStaticProps = wrapper.getStaticProps(
  (store) => async (): Promise<any> => {
    const data = await getTopManga();
    const mangas = data;
    store.dispatch(getManga(mangas));
    return {
      props: {
        mangas,
      },
    };
  }
);

*/
