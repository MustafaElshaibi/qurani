import { MdDatasetLinked, MdVerified } from "react-icons/md";
import { IoIosMore } from "react-icons/io";
import PlayButton from "../components/commen/PlayButton";
import SurahListItem from "../components/uncommen/SurahListItem";
import { useParams } from "react-router-dom";
import {
  useGetAllSurahDetailsQuery,
  useGetReciterQuery,
} from "../rtk/Services/QuranApi";
import { useEffect, useState } from "react";
import { ErrorPage } from "./Error";
import avatar from '../assets/images/avtr.png';
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../rtk/Reducers/langSlice";





const createRequestManager = () => {
  const cache = new Map();
  const queue = [];
  let isProcessing = false;
  const API_KEY = 'AIzaSyC9ny6NRYl4dWQLNCzJy8atwkPjXfG99L0';
  const CX = '2495ccf136d074c04';
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

    

      const url = new URL('https://www.googleapis.com/customsearch/v1');
      url.searchParams.append('q', `${reciterName} photo`);
      url.searchParams.append('cx', CX);
      url.searchParams.append('key', API_KEY);
      url.searchParams.append('searchType', 'image');
      url.searchParams.append('imgSize', 'xxlarge'); // Higher quality images
      url.searchParams.append('imgType', 'face'); // Focus on face images
      // url.searchParams.append('rights', 'cc_publicdomain,cc_noncommercial'); // Usage rights
      url.searchParams.append('num', 5); // Get 3 results to find best match
      url.searchParams.append('safe', 'active'); // Safe search
      url.searchParams.append('fileType', 'jpg|png');

      const response = await fetch(url);
      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      // Find first square-shaped face image
      const validImage = data.items?.find(item =>{
        const img = item.image;
        return (
          item.link &&
          img?.width >= 400 &&
          img?.height >= 400 &&
          Math.abs(img.width - img.height) <= 100 && // Allow slight rectangle
          item.link.match(/\.(jpe?g|png)$/i) && // Valid image formats
          !item.link.includes('logo') // Filter out logos
        );
      });
      
      const imageUrl = validImage?.link || null;
      cache.set(reciterName, imageUrl);
      resolve(imageUrl);
    } catch (error) {
      console.error('Image search error:', error);
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
    getImage: (reciterName) => new Promise((resolve, reject) => {
      // Clean up reciter name for better search
      const cleanedName = reciterName
        .replace(/sheikh|imam|dr\.?/gi, '')
        .trim();
      
      // Check cache first
      if (cache.has(cleanedName)) {
        resolve(cache.get(cleanedName));
        return;
      }

      queue.push({ reciterName: cleanedName, resolve, reject });
      processQueue();
    }),
    cache
  };
};

const requestManager = createRequestManager();




function ListSurahOfReciter() {
  const { id } = useParams();
  const [isSticky, setIsSticky] = useState(false);
  const lang = useSelector((state)=> state.lang);
  const { data, isLoading, error } = useGetReciterQuery({id, lang});
  const { data: suwarData } = useGetAllSurahDetailsQuery(lang);
  const [surahUrls, setSurahUrls] = useState([]);
  const reciter = data?.reciters?.[0] || null;
  const moshaf = reciter?.moshaf?.[0];
  const [reciterImg, setReciterImg] = useState(null);
  const [isImgLoading, setIsImgLoading] = useState(true);
  const dispatch = useDispatch();



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

  // handel grandinat on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



      // get reciter img
      useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
    
        const fetchImage = async () => {
          if (!reciter?.name) return;
          
          try {
            const imageUrl = await requestManager.getImage(reciter.name);
            if (isMounted && imageUrl) {
              setReciterImg(imageUrl);
            }
          } catch (error) {
            if (isMounted) setReciterImg(avatar);
          } finally {
            if (isMounted) setIsImgLoading(false);
          }
        };
    
        fetchImage();
    
        return () => {
          isMounted = false;
          controller.abort();
        };
      }, [reciter,  data]);

      


  // make reciter object
  useEffect(() => {
    const generateSurahData = async () => {
      if (!moshaf?.surah_list || !moshaf?.server || !suwarData) return;


      const surahPromises = moshaf.surah_list.split(",").map(async (num) => {
        const surahDetail = suwarData?.suwar.find((surah) => surah.id == num);
        const formatted = num.padStart(3, "0");
        const url = `${moshaf.server}/${formatted}`;

        try {
          // const duration = await getAudioDuration(url);
          return {
            id: `${reciter?.name}-${surahDetail?.name}-${num}`,
            url: `${url}.mp3`,
            number: parseInt(num, 10),
            name: surahDetail?.name || "Unknown Surah",
            makkia: surahDetail?.makkia || 0,
            // duration,
            reciter: {
              id: `${reciter?.name}-${reciter?.id}`,
              name: reciter?.name,
              moshaf: moshaf?.name,
              imgUrl: reciterImg,
            },
          };
        } catch (error) {
          console.error("Error loading audio duration:", error);
          return null;
        }
      });

      const surahData = (await Promise.all(surahPromises)).filter(Boolean);
      setSurahUrls(surahData);
    };

    generateSurahData();
  }, [moshaf, suwarData, reciter]);



  if(error) return <ErrorPage />;

  return (
    <div className="flex flex-col bg-second-black rounded-lg  w-full min-h-screen ">
      {isLoading ? (
        /* Skeleton Loading State */
        <>
          <div className="top relative min-h-[300px] px-5 py-7 animate-pulse">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-7 h-7 bg-gray-700 rounded-full" />
              <div className="h-5 bg-gray-700 rounded w-32" />
            </div>
            <div className="h-20 bg-gray-700 rounded-full w-3/4 mb-7 max-sm:w-full" />
            <div className="h-4 bg-gray-700 rounded w-48" />
          </div>

          <div className="down">
            <div className="actions flex items-center gap-2 sm:gap-6 p-2 sm:p-5">
              <div className="w-[70px] h-[70px] bg-gray-700 rounded-full" />
              <div className="w-24 h-10 bg-gray-700 rounded-full" />
              <div className="w-7 h-7 bg-gray-700 rounded-full" />
            </div>

            <div className="list mt-4 px-5 py-4">
              <div className="h-8 bg-gray-700 rounded w-48 mb-6" />
              <div className="surah-list flex flex-col gap-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-14 bg-gray-700 rounded" />
                ))}
              </div>

              <div className="about flex flex-col mb-5 mt-14">
                <div className="h-8 bg-gray-700 rounded w-48 mb-6" />
                <div className="info relative w-[80%] max-sm:w-full">
                  <div className="w-full h-[700px] max-sm:h-[300px] bg-gray-700 rounded-lg" />
                  <div className="absolute left-5 bottom-5 p-5 w-[90%]">
                    <div className="h-4 bg-gray-600 rounded w-48 mb-3" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-600 rounded w-full" />
                      <div className="h-3 bg-gray-600 rounded w-4/5" />
                      <div className="h-3 bg-gray-600 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Actual Content */
        <>
          {/* Original content here */}
          <div className={`top relative  min-h-[300px] px-5 py-7 ${isSticky && 'bg-gradient-to-b from-blue-500/30 to-blue-500/20 transition-colors'}`} >
            <span className="flex items-center gap-2 text-white text-lg font-medium ">
              <span>
                <MdVerified className="size-7 text-sky-400" />
              </span>{" "}
              Good Reciter
            </span>
            <div className="reciter-name capitalize text-9xl font-extrabold max-sm:text-5xl text-white mt-5 mb-7 text-wrap overflow-hidden text-ellipsis max-w-[900px] lg:w-fit lg:overflow-visible ">
              {reciter?.name}
            </div>
            <div className="text-white capitalize text-lg max-sm:text-sm ">
              12,45,3,55 monthly listners
            </div>
          </div>
          <div className="down   bg-gradient-to-b from-blue-500/30 from-1% to-5%  to-second-black ">
            <div className={`actions flex items-center gap-6 p-5 ${isSticky && 'sticky top-[100px] z-20 backdrop-blur-sm '}`} >
              <PlayButton onClick={onclick} surahQueue={surahUrls} w={"70px"} h={"70px"} p={"27px"} />
              <button className="block py-2 px-5 rounded-full cursor-pointer border-1 border-white text-white">
                Follow
              </button>
              <button className="cursor-pointer ">
                <IoIosMore className="text-white size-7 font-bold " />
              </button>
            </div>
            <div className="list mt-4 px-5 py-4">
              <h3 className="text-3xl font-bold text-heading capitalize mb-6">
                the surah's
              </h3>
              <div className="surah-list flex flex-col gap-3  ">
                {surahUrls.map((surah, i) => (
                  <SurahListItem
                    key={surah.id}
                    index={i + 1}
                    surahData={surah}
                    audioQueue={surahUrls}
                  />
                ))}
              </div>
              <div className="about flex flex-col  mb-5 mt-14">
                <h3 className="text-3xl font-bold text-heading capitalize mb-6">
                  About
                </h3>
                {
                  isImgLoading ? 
                  (
                    <div className="info relative w-[80%] max-sm:w-full">
                    <div className="w-full h-[700px] max-sm:h-[300px] bg-gray-700 rounded-lg" />
                    <div className="absolute left-5 bottom-5 p-5 w-[90%]">
                      <div className="h-4 bg-gray-600 rounded w-48 mb-3" />
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-600 rounded w-full" />
                        <div className="h-3 bg-gray-600 rounded w-4/5" />
                        <div className="h-3 bg-gray-600 rounded w-3/4" />
                      </div>
                    </div>
                  </div>
                  )
                  : 
                  (
                    <div className="info relative w-[80%] max-sm:w-full ">
                    <div className="bg-black absolute top-0 left-0 w-full h-full z-10 opacity-40"></div>
                    <div
                      className="img w-full h-[700px] max-sm:h-[300px]  rounded-lg overflow-hidden "
                      style={{
                        backgroundImage: `url(${reciterImg})`,
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                      }}
                    ></div>
                    <div className="txt absolute left-5 bottom-5 z-20 p-5">
                      <div className="text-white capitalize text-lg max-sm:text-xs mb-3 ">
                        12,45,3,55 monthly listners
                      </div>
                      <div className="text-white capitalize text-lg max-sm:text-xs ">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        Sapiente optio voluptatem voluptas veritatis excepturi
                        possimus beatae voluptatibus cumque ipsam, laboriosam
                        corrupti dicta eos! Veniam repellat dicta impedit dolorum,
                        porro harum.
                      </div>
                    </div>
                  </div>
                  )
                }
               
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ListSurahOfReciter;
