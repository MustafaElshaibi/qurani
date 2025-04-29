// MainDisplay.tsx
import {  useEffect,  useState } from "react";
import { useGetAllRecitersQuery, useGetAllSurahDetailsQuery } from "../rtk/Services/QuranApi";
import { RoundedCard } from "../components/uncommen/RoundedCard";
import  SquarCard  from "../components/uncommen/SquarCard";
import { FiChevronRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../rtk/Reducers/langSlice";
import { ErrorPage } from "./Error";

const createRequestManager = () => {
  const cache = new Map();
  const queue = [];
  let isProcessing = false;
  const API_KEY = "AIzaSyC9ny6NRYl4dWQLNCzJy8atwkPjXfG99L0";
  const CX = "2495ccf136d074c04";
  const RATE_LIMIT = 1500; // Slightly longer delay for better rate limiting

  const processQueue = async () => {
    if (isProcessing || queue.length === 0) return;
    isProcessing = true;

    const { reciterName, resolve, reject } = queue.shift();

    try {
      if (cache.has(reciterName)) {
        resolve(cache.get(reciterName));
        return;
      }

      const url = new URL("https://www.googleapis.com/customsearch/v1");
      url.searchParams.append("q", `${reciterName} photo`);
      url.searchParams.append("cx", CX);
      url.searchParams.append("key", API_KEY);
      url.searchParams.append("searchType", "image");
      url.searchParams.append("imgSize", "xxlarge"); // Higher quality images
      url.searchParams.append("imgType", "face"); // Focus on face images
      // url.searchParams.append('rights', 'cc_publicdomain,cc_noncommercial'); // Usage rights
      url.searchParams.append("num", 5); // Get 3 results to find best match
      url.searchParams.append("safe", "active"); // Safe search
      url.searchParams.append("fileType", "jpg|png");

      const response = await fetch(url);
      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();
      // Find first square-shaped face image
      const validImage = data.items?.find((item) => {
        const img = item.image;
        return (
          item.link &&
          img?.width >= 400 &&
          img?.height >= 400 &&
          Math.abs(img.width - img.height) <= 100 && // Allow slight rectangle
          item.link.match(/\.(jpe?g|png)$/i) && // Valid image formats
          !item.link.includes("logo") // Filter out logos
        );
      });

      const imageUrl = validImage?.link || null;
      cache.set(reciterName, imageUrl);
      resolve(imageUrl);
    } catch (error) {
      console.error("Image search error:", error);
      reject(error);
      cache.set(reciterName, null);
    } finally {
      setTimeout(() => {
        isProcessing = false;
        processQueue();
      }, RATE_LIMIT);
    }
  };

  return {
    getImage: (reciterName) =>
      new Promise((resolve, reject) => {
        // Clean up reciter name for better search
        const cleanedName = reciterName
          .replace(/sheikh|imam|dr\.?/gi, "")
          .trim();

        // Check cache first
        if (cache.has(cleanedName)) {
          resolve(cache.get(cleanedName));
          return;
        }

        queue.push({ reciterName: cleanedName, resolve, reject });
        processQueue();
      }),
    cache,
  };
};






const requestManager = createRequestManager();


const Home = () => {
  const lang = useSelector((state) => state.lang);
  const { data, loading, error, isFetching  } = useGetAllRecitersQuery(lang);
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


  useEffect(() => {
    if (data?.reciters) {
      const initialReciters = data.reciters.slice(0, 6);
      setReciters(initialReciters);

      // Pre-warm cache with initial requests
      initialReciters.forEach((reciter) => {
        const getImageWithRetry = async (name, retries = 0) => {
          try {
            return await requestManager.getImage(name);
          } catch (error) {
            if (retries > 0) {
              await new Promise((resolve) => setTimeout(resolve, 3000));
              return getImageWithRetry(name, retries - 1);
            }
            return null;
          }
        };
        getImageWithRetry(reciter?.name);
      });
    }
  }, [data]);

  if(error) <ErrorPage />

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
                Popular Reciters
              </h2>
              <button className="text-gray-300 hover:text-white cursor-pointer text-sm font-bold flex items-center gap-1">
                See all <FiChevronRight className="text-lg " />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-6">
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
                Popular Chapters
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
