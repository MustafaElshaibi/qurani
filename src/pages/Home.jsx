import {  useEffect,  useState } from "react";
import { useGetAllRecitersQuery, useGetAllSurahDetailsQuery } from "../rtk/Services/QuranApi";
import { RoundedCard } from "../components/uncommen/RoundedCard";
import  SquarCard  from "../components/uncommen/SquarCard";
import { FiChevronRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../rtk/Reducers/langSlice";
import PageLoader from "../components/uncommen/PageLoader";
import { requestManager } from "../utility/requestManager";




const Home = () => {
  const lang = useSelector((state) => state.lang);
  const { data, loading, error, isFetching , refetch } = useGetAllRecitersQuery(lang);
  const {data: suwarData, isFetching: fetchSuwar, isLoading: isLoadSuwar } = useGetAllSurahDetailsQuery(lang);
  const loader = loading || !data;
  const [reciters, setReciters] = useState([]);
  const dispatch = useDispatch();
    const [suwar, setSuwar] = useState([]);
  
    
    useEffect(()=> {
      if(suwarData?.suwar)
      {
        setSuwar(suwarData?.suwar);
      }
    }, [suwarData])



  // Handle cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'lang') {
        dispatch(setLanguage(e.newValue || 'eng'));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch]);

  // set initial reciters when data is available
  useEffect(() => {
    if (data?.reciters) {
      const initialReciters = data.reciters.slice(0, 6);
      setReciters(initialReciters);
    }
  }, [data]);

  // Handle Retry logic
  if(error) return (
        <div className="w-full bg-[#121212] flex items-center justify-center rounded-lg p-6 space-y-8 min-h-screen">
         <div className="cont">
         <button 
            onClick={()=> refetch()} 
            className="px-7 py-3 rounded-full mx-auto  bg-white text-black cursor-pointer block w-fit font-bold"
          >
            Retry
          </button>
          {error  && <p className="text-white mt-2 ">Trying to reconnect...</p>}
          {isFetching && <PageLoader />}
         </div>
        </div>
      );


  return (
    <div className="w-full bg-[#121212] rounded-lg p-6 space-y-8 min-h-screen">
      {loader || isFetching  ? (
        <>
          {/* Popular Reciters Skeleton */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="h-8 bg-gray-800 rounded w-48 animate-pulse"></div>
              <div className="h-6 bg-gray-800 rounded w-20 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="rounded-full bg-gray-800 aspect-square w-full"></div>
                  <div className="mt-3 space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

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
                {lang === "eng" ? "Popular Reciters" : "أشهر القراء"}
              </h2>
              <button className="text-gray-300 hover:text-white cursor-pointer text-sm font-bold flex items-center gap-1">
                See all <FiChevronRight className="text-lg " />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6   gap-6">
              {reciters.map((reciter, i) => (
                <RoundedCard
                  key={reciter?.id || i}
                  reciter={reciter}
                  loading={loader}
                  requestManager={requestManager}
                />
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
                {lang === "eng" ? "Popular Chapters" : "السور الشائعة"}
              </h2>
              <button className="text-gray-300 cursor-pointer hover:text-white text-sm font-bold flex items-center gap-1">
                See all <FiChevronRight className="text-lg" />
              </button>
             
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {suwar.slice(0, 6).map((surah , i) => (
                <SquarCard key={i} isFetching={fetchSuwar} isLoading={isLoadSuwar} surah={surah} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
