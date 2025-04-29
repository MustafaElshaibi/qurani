import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const quranApi = createApi({
  reducerPath: "quranApi",
  refetchOnMountOrArgChange: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: "https://mp3quran.net/api/v3",
  }),
  endpoints: (builder) => ({
    getAllReciters: builder.query({
      query: (lang) => `/reciters?language=${lang}&reciter=168`,
    }),
    getReciter: builder.query({
      query: ({ id, lang }) => `/reciters?language=${lang}&reciter=${id}`,
    }),
    getSurahReciters: builder.query({
      query: ({ id, lang }) => `/reciters?language=${lang}&sura=${id}`,
    }),
    getAllSurahDetails: builder.query({ query: (lang) => `/suwar?language=${lang}` }),
    getSvgSurah: builder.query({ query: (id) => `/ayat_timing?surah=${id}&read=5` }),
  }),
});

export const {
  useGetAllRecitersQuery,
  useGetReciterQuery,
  useGetSurahRecitersQuery,
  useGetAllSurahDetailsQuery,
  useGetSvgSurahQuery,
} = quranApi;
