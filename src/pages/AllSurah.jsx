// MainDisplay.tsx
import { Helmet } from "react-helmet-async";
import {   useMemo } from "react";
import { useGetAllSurahDetailsQuery } from "../rtk/Services/QuranApi";
import  SquarCard  from "../components/uncommen/SquarCard";
import { useSelector } from "react-redux";
import PageLoader from "../components/uncommen/PageLoader";


const AllSurah = () => {
  const lang = useSelector((state) => state.lang);
  const {data: suwarData, isFetching, isLoading , error, refetch} = useGetAllSurahDetailsQuery(lang);
  const loader = isLoading || isFetching ;
  
    const suwar = useMemo(()=> {
      if(suwarData?.suwar)
      {
        return suwarData?.suwar;
      }
      return [];
    }, [suwarData])

 if (error) {
     return (
       <div className="w-full bg-[#121212] flex items-center justify-center rounded-lg p-6 space-y-8 min-h-screen">
         <div className="cont">
           <button
             onClick={() => refetch()}
             className="px-7 py-3 rounded-full mx-auto  bg-white text-black cursor-pointer block w-fit font-bold"
           >
             Retry
           </button>
           {error && <p className="text-white mt-2 ">Trying to reconnect...</p>}
           {isFetching && <PageLoader />}
         </div>
       </div>
     );
   }


  return (
    <>
      <Helmet>
        <title>{lang === "eng" ? "All Chapters | Qurani" : "جميع السور | قرآني"}</title>
        <meta
          name="description"
          content={
            lang === "eng"
              ? "Browse all chapters (Surahs) of the Holy Quran. Listen, read, and learn with Qurani."
              : "تصفح جميع سور القرآن الكريم. استمع واقرأ وتعلم مع قرآني."
          }
        />
        <link rel="canonical" href="https://qurani-opal.vercel.app/chapters" />
        <meta name="robots" content="index, follow" />
        {/* Open Graph */}
        <meta property="og:title" content={lang === "eng" ? "All Surahs | Qurani" : "جميع السور | قرآني"} />
        <meta property="og:description" content={
          lang === "eng"
            ? "Browse all chapters (Surahs) of the Holy Quran. Listen, read, and learn with Qurani."
            : "تصفح جميع سور القرآن الكريم. استمع واقرأ وتعلم مع قرآني."
        } />
        <meta property="og:url" content="https://qurani-opal.vercel.app/chapters" />
        <meta property="og:image" content="/quranLogo.svg" />
      </Helmet>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {suwar.map((surah , i) => (
                <SquarCard key={i} isFetching={isFetching} isLoading={isLoading} surah={surah} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
    </>
  );
};

export default AllSurah;
