import SurahListItem from "../components/uncommen/SurahListItem";
import { useParams } from "react-router-dom";
import {
  useGetAllRecitersQuery,
  useGetAllSurahDetailsQuery,
  useGetSvgSurahQuery,
} from "../rtk/Services/QuranApi";
import {   useEffect,    useState } from "react";
import {  useSelector } from "react-redux";
import { CiMusicNote1 } from "react-icons/ci";
import QuranReader from "../components/uncommen/QuranReader";
import avatar from '../assets/images/avtr.png';
import { requestManager } from "../utility/requestManager";
import { Helmet } from "react-helmet-async";
import SEO from "../components/uncommen/HelmetHeader";






function SurahInfoPage() {
  const {surahId} = useParams();
  const [isSticky, setIsSticky] = useState(false);
  const lang = useSelector((state)=> state.lang);
  const { data: recitersData, error, refetch, isLoading, isFetching } = useGetAllRecitersQuery(lang);
  const {data: quranTxt} = useGetSvgSurahQuery(surahId);
    const { data: suwarData } = useGetAllSurahDetailsQuery(lang);
  const [reciterObj, setReciterObj] = useState([]);


 




  // Handle sticky header on scroll (throttled)
  useEffect(() => {
    // Get the target element
    const reciterDiv = document.querySelector(".main-display ");
    if (!reciterDiv) return;

    const handleScroll = () => {
      // Get current scroll position (equivalent to window.scrollY for the element)
      const scrollTop = reciterDiv.scrollTop;
      setIsSticky(scrollTop > 100);
    };

    reciterDiv.addEventListener("scroll", handleScroll);
    return () => {
      // Cleanup: remove event listener and clear timeout
      reciterDiv.removeEventListener("scroll", handleScroll);
    };
  }, []);





// make surah and reciter obj
useEffect(() => {
  let isMounted = true;
  const abortController = new AbortController();

  const fetchReciterSurahData = async () => {
    if (!recitersData?.reciters?.length || !suwarData?.suwar?.length || !surahId) return;

    const currentSurah = suwarData.suwar.find((surah) => surah.id == surahId);
    if (!currentSurah) return;

    // Initial data with placeholder images
    const initialData = recitersData.reciters
      .filter(reciter => {
        const moshaf = reciter?.moshaf?.[0];
        return moshaf?.surah_list?.split(',').map(s => s.trim()).includes(surahId.toString());
      })
      .map(reciter => {
        const moshaf = reciter.moshaf[0];
        const formattedId = surahId.toString().padStart(3, '0');
        const baseUrl = moshaf.server.endsWith('/') ? moshaf.server : `${moshaf.server}/`;

        return {
          id: `${reciter.id}-${currentSurah.id}`,
          surahId: currentSurah.id.toString(),
          url: `${baseUrl}${formattedId}.mp3`,
          number: currentSurah.id,
          name: currentSurah.name,
          makkia: currentSurah.makkia,
          reciter: {
            id: reciter.id,
            name: reciter.name,
            moshaf: moshaf.name,
            imgUrl: avatar, // Placeholder image
          },
        };
      });

    if (isMounted) {
      setReciterObj(initialData);
      
      // Fetch images after initial render
      initialData.forEach(async (item) => {
        try {
          const reciter = await requestManager.getReciterInfo(
            item.reciter.id,
            item.reciter.name,
            { signal: abortController.signal }
          );

          if (isMounted && reciter?.img) {
            setReciterObj(prev => prev.map(prevItem => 
              prevItem.id === item.id
                ? { 
                    ...prevItem, 
                    reciter: { 
                      ...prevItem.reciter, 
                      imgUrl: reciter?.img || avatar,  
                    } 
                  }
                : prevItem
            ));
          }
        } catch (error) {
          console.log(error)
          if (!abortController.signal.aborted) {
            console.warn("Image fetch failed for:", item.reciter.name);
          }
        }
      });
    }
  };

  fetchReciterSurahData();

  return () => {
    isMounted = false;
    abortController.abort();
  };
}, [recitersData, surahId, suwarData]);


if (error) {
  return (
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
}

console.log(reciterObj)
  return (
    <>
    <SEO title={reciterObj?.[0]?.name ? `Chapter of ${reciterObj?.[0]?.name} | Qurani` : "Surah | Qurani"} description={ reciterObj?.[0]
              ? `Read and listen to Chapter(Surah) ${reciterObj?.[0]?.name} from the Holy Quran. Learn about its meaning, translation, and recitation.`
              : "Read and listen to any Surah from the Holy Quran. Learn about its meaning, translation, and recitation."} 
              type={"Chapter"}
              name={"Qurani"}
              candonical={`https://qurani-opal.vercel.app/surah/${reciterObj?.[0]?.surahId || ""}`}
              robots={"index, follow"}
              url={`https://qurani-opal.vercel.app/surah/${reciterObj?.[0]?.surahId || ""}`}
              img={'/quranLogo.png'} />
    <div className="flex flex-col bg-second-black rounded-lg  w-full min-h-screen ">
      {isLoading || isFetching || !reciterObj ? (
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
                <CiMusicNote1 className="size-7 text-sky-400" />
              </span>{" "}
              Let's Dive In Peace
            </span>
            <div className="reciter-name capitalize text-9xl font-extrabold max-sm:text-5xl text-white mt-5 mb-7 text-wrap overflow-hidden text-ellipsis max-w-[900px] lg:w-fit lg:overflow-visible ">
              {reciterObj?.[0]?.name}
            </div>
            <div className="text-white capitalize text-lg max-sm:text-sm flex items-center gap-1.5 ">
              <span className="text-2xl  text-green font-bold">{reciterObj.length}</span> {lang === 'eng' ? 'Reciters' : 'قراء'}
            </div>
          </div>
          <div className="down   bg-gradient-to-b from-blue-500/30 from-1% to-5%  to-second-black ">
                      <div className="mt-5">
          {quranTxt && <QuranReader data={quranTxt} />}
          </div>
            <div className="list mt-4 px-1 sm:px-5 py-4">
              <h3 className="text-lg sm:text-3xl max-sm:px-3 font-bold text-heading capitalize mb-4 sm:mb-6">
                {lang === 'eng' ? 'Surah Reciters' : ' قراء السورة'}
              </h3>
              <div className="surah-list flex flex-col gap-3  ">
                {reciterObj.map((surah, i) => (
                  <SurahListItem
                                      key={surah.id}
                                      index={i + 1}
                                      surahData={surah}
                                      audioQueue={reciterObj}
                                      onSurah={true}
                                      requestManager={requestManager}
                                    />
                ))}
              </div>
            </div>
          
          </div>
        </>
      )}
    </div>
    </>
  );
}

export default SurahInfoPage;
