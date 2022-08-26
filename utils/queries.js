import axios from "axios";

export const getPopularAnimes = async () => {
  const { data } = await axios.get(
    `https://api.jikan.moe/v4/top/anime/?limit=50`
  );
  return data.data;
};

export const getMoreAnimes = async (page = 2) => {
  const { data } = await axios.get(
    `https://api.jikan.moe/v4/top/anime?page=${page}`
  );
  return data.data;
};

export const getMoreMangas = async (page = 2) => {
  const { data } = await axios.get(
    `https://api.jikan.moe/v4/top/manga?page=${page}`
  );
  return data.data;
};

export const getAnimeDetails = async (id) => {
  const { data } = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
  console.log(data);
  return data.data;
};

export const getAnimeSearch = async (title) => {
  const { data } = await axios.get(`https://api.jikan.moe/v4/anime?q=${title}`);
  return data.data;
};

export const getMoreAnimeSearch = async (title, page) => {
  console.log(title);
  const { data } = await axios.get(
    `https://api.jikan.moe/v4/anime?q=${title}&page=${page}`
  );
  return data.data;
};

export const getTopManga = async () => {
  const { data } = await axios.get("https://api.jikan.moe/v4/top/manga");

  return data.data;
};

export const getMoreMangaSearch = async (title, page) => {
  console.log(title);
  const { data } = await axios.get(
    `https://api.jikan.moe/v4/manga?q=${title}&page=${page}`
  );
  return data.data;
};

export const getMoreManga = async (page = 1) => {
  const { data } = await axios.get(
    `https://api.jikan.moe/v4/top/manga?page=${page}`
  );
  return data.data;
};

export const getMangaDetails = async (id) => {
  const { data } = await axios.get(`https://api.jikan.moe/v4/manga/${id}`);
  console.log(data);
  return data.data;
};
