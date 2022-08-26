import { RootState } from "../../utils/store";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { HYDRATE } from "next-redux-wrapper";
import {
  getPopularAnimes,
  getTopManga,
  getAnimeSearch,
  getMoreMangaSearch,
} from "../../utils/queries";

const initialState = {
  animes: [],
  mangas: [],
  searchedAnimes: [],
  searchedMangas: [],
  animePage: 1,
  mangaPage: 1,
  favorited:
    typeof window !== "undefined" && localStorage.getItem("favorites")
      ? JSON.parse(localStorage.getItem("favorites"))
      : [],
};

export const animeSlice = createSlice({
  name: "animes",
  initialState,
  reducers: {
    getAnime: (state, action) => {
      state.animes = [...action.payload.animes];
    },
    getManga: (state, action) => {
      state.mangas.push(action.payload);
    },
    getSearchedAnime: (state, action) => {
      state.searchedAnimes.push(action.payload);
    },
    getSearchedManga: (state, action) => {
      state.searchedMangas.push(action.payload);
    },
    getAnimePage: (state, action) => {
      state.animePage += action.payload;
    },
    getMangaPage: (state, action) => {
      state.mangaPage += action.payload;
    },
    addToFavorite: (state, action) => {
      console.log(action.payload);
      // this can be configured client adding object
      // ex action.payload.favorited
      state.favorited = action.payload;
      localStorage.setItem("favorites", JSON.stringify(action.payload));
    },
    deleteFavorite: (state, action) => {
      const filtered = state.favorited.filter(
        (anime) => anime.mal_id !== action.payload
      );

      state.favorited = filtered;
      localStorage.setItem("favorites", JSON.stringify(filtered));
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      // server side console logs
      // console.log("serverside");
      // console.log(action.payload);

      // return saved state to client
      if (!action.payload) {
        return state;
      }

      // each payload for different properties
      state.animes = action.payload.animes;
      state.favorited = action.payload.favorited;
      state.mangas = action.payload.mangas;
      state.searchedAnimes = action.payload;
      state.searchedMangas = action.payload;
      state.animePage = action.payload.animePage;
      state.mangaPage = action.payload.mangaPage;
    },
  },
});

// export const animeClientData = (state: RootState) => state.animes;

// action export functions reducer actions
export const {
  getAnime,
  getManga,
  getAnimePage,
  getMangaPage,
  getSearchedAnime,
  getSearchedManga,
  addToFavorite,
  deleteFavorite,
} = animeSlice.actions;

export default animeSlice.reducer;
