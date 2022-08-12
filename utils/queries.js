import axios from "axios";

export const getPopularAnimes = async () => {
  const { data } = await axios.get(
    `https://api.jikan.moe/v4/top/anime/?limit=50`
  );
  return data;
};

export const getMoreAnimes = async (page = 2) => {
  const { data } = await axios.get(
    `https://api.jikan.moe/v4/top/anime?page=${page}`
  );
  return data.data;
};

export const getAnimeDetails = async (id) => {
  const { data } = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
  console.log(data);
  return data.data;
};
