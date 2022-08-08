import axios from "axios";

export const getMoreCharacters = async (page = 1) => {
  const { data } = await axios.get(
    `https://rickandmortyapi.com/api/character/?page=${page}`
  );

  // console.log(data);

  return data;
};

export const getCharacterDetails = async (id) => {
  // console.log(id);
  const { data } = await axios.get(
    `https://rickandmortyapi.com/api/character/${id}`
  );
  return data;
};
