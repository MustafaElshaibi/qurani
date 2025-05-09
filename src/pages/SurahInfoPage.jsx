
import SurahListItem from "../components/uncommen/SurahListItem";
import { useSearchParams } from "react-router-dom";
import {
  useGetAllRecitersQuery,
  useGetAllSurahDetailsQuery,
  useGetSvgSurahQuery,
} from "../rtk/Services/QuranApi";
import {  useEffect,  useMemo,  useState } from "react";
import { ErrorPage } from "./Error";
import {  useSelector } from "react-redux";
import { CiMusicNote1 } from "react-icons/ci";
import QuranReader from "../components/uncommen/QuranReader";
import avatar from '../assets/images/avtr.png';
import PlayButton from "../components/commen/PlayButton";
import { IoIosMore } from "react-icons/io";
import { requestManager } from "../utility/requestManager";






function SurahInfoPage() {
  const [surahParms] = useSearchParams();
  const query = surahParms.get('q').split('_') || '';
  const id = query?.[0];
  const [isSticky, setIsSticky] = useState(false);
  const lang = useSelector((state)=> state.lang);
  const { data: recitersData, error, refetch, isLoading, isFetching } = useGetAllRecitersQuery(lang);
  const {data: quranTxt} = useGetSvgSurahQuery(id);
    const { data: suwarData } = useGetAllSurahDetailsQuery(lang);
  const [reciterObj, setReciterObj] = useState([]);






  // handel grandinat on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);





// make surah and reciter obj
useEffect(() => {
  let isMounted = true;
  const abortController = new AbortController();

  const fetchReciterSurahData = async () => {
    if (!recitersData?.reciters?.length || !suwarData?.suwar?.length || !id) return;

    const currentSurah = suwarData.suwar.find((surah) => surah.id == id);
    if (!currentSurah) return;

    // Initial data with placeholder images
    const initialData = recitersData.reciters
      .filter(reciter => {
        const moshaf = reciter?.moshaf?.[0];
        return moshaf?.surah_list?.split(',').map(s => s.trim()).includes(id.toString());
      })
      .map(reciter => {
        const moshaf = reciter.moshaf[0];
        const formattedId = id.toString().padStart(3, '0');
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
          const imageUrl = await requestManager.getImage(
            item.reciter.id,
            item.reciter.name,
            { signal: abortController.signal }
          );

          if (isMounted && imageUrl) {
            setReciterObj(prev => prev.map(prevItem => 
              prevItem.id === item.id
                ? { 
                    ...prevItem, 
                    reciter: { 
                      ...prevItem.reciter, 
                      imgUrl: imageUrl 
                    } 
                  }
                : prevItem
            ));
          }
        } catch (error) {
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
}, [recitersData, id, suwarData]);


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

  return (
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
           <div className={`actions flex items-center gap-6 px-5 py-4 ${isSticky && 'sticky top-[100px] z-20 backdrop-blur-sm '}`} >
                        <PlayButton onClick={onclick} surahQueue={reciterObj} w={"70px"} h={"70px"} p={"27px"} />
                        <button className="cursor-pointer ">
                          <IoIosMore className="text-white size-7 font-bold " />
                        </button>
                      </div>
                      <div className="mt-5">
          {quranTxt && <QuranReader data={quranTxt} />}
          </div>
            <div className="list mt-4 px-5 py-4">
              <h3 className="text-3xl font-bold text-heading capitalize mb-6">
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
                                    />
                ))}
              </div>
            </div>
          
          </div>
        </>
      )}
    </div>
  );
}

export default SurahInfoPage;
