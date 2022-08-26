import { animeSlice } from "./../features/anime/animeSlice";
import {
  Action,
  AnyAction,
  combineReducers,
  configureStore,
  createStore,
  Store,
  ThunkAction,
} from "@reduxjs/toolkit";
// the reduce ris the slice
import animeReducer from "../features/anime/animeSlice";
import { createWrapper, Context, HYDRATE } from "next-redux-wrapper";
import { useDispatch } from "react-redux";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, animeReducer);

export const makeStore = () =>
  configureStore({
    reducer: {
      // animes: animeReducer,
      animes: persistedReducer,
    },
    devTools: true,
    middleware: [thunk],
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const wrapper = createWrapper<AppStore>(makeStore, {
  debug: true,
});

export const persistor = persistStore(makeStore());
