// MainDisplay.tsx
import {  useEffect,  useState } from "react";
import { useGetAllRecitersQuery, useGetAllSurahDetailsQuery } from "../rtk/Services/QuranApi";
import  SquarCard  from "../components/uncommen/SquarCard";
import { FiChevronRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../rtk/Reducers/langSlice";
import { ErrorPage } from "./Error";


const AllSurah = () => {
  const lang = useSelector((state) => state.lang);
  const { data, loading, error, isFetching  } = useGetAllRecitersQuery(lang);
  const {data: suwarData, isFetching: fetchSuwar, isLoading: isLoadSuwar } = useGetAllSurahDetailsQuery(lang);
  const loader = loading || !data;
  const dispatch = useDispatch();
    const [suwar, setSuwar] = useState([]);
  
    useEffect(()=> {
      if(suwarData?.suwar)
      {
        setSuwar(suwarData?.suwar);
      }
    }, [suwarData])



  if(error) <ErrorPage />


  return (
    <div className="w-full bg-[#121212] rounded-lg p-6 space-y-8 min-h-screen">
      {loader || isFetching  ? (
        <>

          {/* Popular Chapters Skeleton */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="h-8 bg-gray-800 rounded w-48 animate-pulse"></div>
              <div className="h-6 bg-gray-800 rounded w-20 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-800 aspect-square rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/30 to-transparent animate-shimmer"></div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
                {lang === "eng" ? "Chapters" : "جميع السور"}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {suwar.map((surah , i) => (
                <SquarCard key={i} isFetching={fetchSuwar} isLoading={isLoadSuwar} surah={surah} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AllSurah;
