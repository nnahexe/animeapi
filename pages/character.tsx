import {
  Box,
  FormControl,
  Input,
  FormLabel,
  Heading,
  Container,
  InputLeftElement,
  InputRightAddon,
  InputGroup,
  Button,
  Text,
  InputRightElement,
  Grid,
  GridItem,
  SimpleGrid,
  Center,
  useMediaQuery,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import imageLoader from "../imageLoader";
import axios from "axios";
import Link from "next/link";

const CharacterSearch = () => {
  const [search, setSearch] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [isSmallerThan1500] = useMediaQuery("(max-width: 1500px)");

  const GETAPIDATA = async () => {
    const { data } = await axios.get(
      "https://rickandmortyapi.com/api/character"
    );
    setApiData(data.results);
  };
  useEffect(() => {
    GETAPIDATA();
  }, []);

  const handleChange = async (e) => {
    setSearch(e.target.value);
    const { data } = await axios.get(
      `https://rickandmortyapi.com/api/character/?name=${search}`
    );
    console.log(data);
    setPreviewData(data.results);
    console.log(previewData);
  };

  const handleFilterSearch = async (name) => {
    setSearch(name);
    try {
      const { data } = await axios.get(
        `https://rickandmortyapi.com/api/character/?name=${name}`
      );
      console.log(data);
      setApiData(data.results);
      setSearch("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(search);
    try {
      const { data } = await axios.get(
        `https://rickandmortyapi.com/api/character/?name=${search}`
      );
      console.log(data);
      setApiData(data.results);
      setSearch("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box bg="#242424" className="mx-auto  h-screen">
      <Container className="py-10 ">
        <Image
          width={500}
          height={400}
          loader={imageLoader}
          alt="my-img"
          unoptimized
          objectFit="contain"
          src="/img/mygif.gif"
          className="rounded-lg py-10"
        />

        <form onSubmit={handleSubmit}>
          <Box className="centerH" py={10}>
            <InputGroup size="lg" className="centerH">
              <InputLeftElement
                pointerEvents="none"
                children={<FaSearch color="gray.300" />}
                color="gray.300"
              />
              <Input
                className="relative"
                value={search}
                type="text"
                color="#fff"
                onChange={handleChange}
                size="lg"
                borderColor="gray.300"
                focusBorderColor="lime"
                placeholder="Search Character"
              />

              <InputRightElement width="6rem" cursor="pointer">
                <Button type="submit" size="lg" onClick={handleSubmit}>
                  Search...
                </Button>
              </InputRightElement>
            </InputGroup>
          </Box>
        </form>

        {/* preview filter search */}
        {search && (
          <Box
            sx={{ _onHover: { color: "red" } }}
            mt="-42px"
            py={10}
            px={4}
            className="
         border-2 
         border-slate.500 
         overflow-hidden
          overflow-y-auto
          "
          >
            {search &&
              previewData
                .map(({ name }, idx) => {
                  return (
                    <Text
                      key={idx}
                      onClick={() => handleFilterSearch(name)}
                      _hover={{
                        background: "white",
                        color: "teal.500",
                        cursor: "pointer",
                        padding: "4px 0",
                      }}
                      color="#fff"
                    >
                      {name}
                    </Text>
                  );
                })
                .slice(0, 10)}
          </Box>
        )}
      </Container>

      <Center className="centerH mx-auto overflow-hidden" bg="#242424">
        <SimpleGrid
          color="#fff"
          bg="#242424"
          alignContent="center"
          templateColumns={isSmallerThan1500 ? "1fr" : "repeat(3, 1fr)"}
          gap={12}
        >
          {apiData?.map(
            ({
              episode,
              image,
              gender,
              id,
              location,
              name,
              origin,
              species,
              status,
            }) => {
              return (
                <Link key={id} href={`/characters/${id}`}>
                  <GridItem className="cursor-pointer centerV">
                    <Heading py={4}>{name}</Heading>
                    <Image
                      src={image}
                      width={300}
                      height={300}
                      loader={imageLoader}
                      unoptimized
                      alt="my-img"
                      objectFit="contain"
                      className="rounded-lg"
                    />
                  </GridItem>
                </Link>
              );
            }
          )}
        </SimpleGrid>
      </Center>
    </Box>
  );
};

export default CharacterSearch;
