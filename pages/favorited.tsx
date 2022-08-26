import {
  Box,
  Heading,
  Flex,
  HStack,
  Grid,
  GridItem,
  Button,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";
import Image from "next/image";
import imageLoader from "../imageLoader";
import { GetStaticProps } from "next";
import { wrapper } from "../utils/store";
import { addToFavorite, deleteFavorite } from "../features/anime/animeSlice";
import { useDispatch } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { useEffect } from "react";

const Favorited = () => {
  const dispatch = useDispatch();
  const { favorited } = useSelector((state: any) => state.animes);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites"));
    console.log(savedFavorites);
    dispatch(addToFavorite(savedFavorites));
  }, []);

  const handleDelete = (id: number) => {
    // console.log(id);
    dispatch(deleteFavorite(id));
  };

  return (
    <Box className="centerV">
      <Flex my={20} className="centerV">
        <HStack mb={20}>
          <Heading fontSize="7xl">Favorites</Heading>
          <StarIcon fontSize="5xl" />
        </HStack>

        <Grid
          alignContent="center"
          alignItems="center"
          justifyContent="center"
          justifyItems="center"
          gap={12}
          templateColumns="repeat(3, 1fr)"
        >
          {favorited?.map((fav, idx) => {
            return (
              <GridItem mx={2} className="centerV" key={idx}>
                <Heading
                  fontWeight={500}
                  my={8}
                  fontSize="2xl"
                  textAlign="center"
                >
                  {fav?.title}
                </Heading>
                {fav?.images && (
                  <Image
                    loader={imageLoader}
                    className="rounded-xl"
                    unoptimized
                    width={400}
                    height={400}
                    objectFit="cover"
                    src={fav?.images.jpg.large_image_url}
                  />
                )}
                <Button
                  my={12}
                  size="lg"
                  w={200}
                  py={7}
                  onClick={() => handleDelete(fav.mal_id)}
                  rightIcon={<FaTrash className="text-red-500" />}
                >
                  Remove
                </Button>
              </GridItem>
            );
          })}
        </Grid>
      </Flex>
    </Box>
  );
};

export default Favorited;
