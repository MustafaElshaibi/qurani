
import SurahListItem from "../components/uncommen/SurahListItem";
import { useSearchParams } from "react-router-dom";
import {
  useGetAllSurahDetailsQuery,
  useGetSurahRecitersQuery,
  useGetSvgSurahQuery,
} from "../rtk/Services/QuranApi";
import { useEffect, useState } from "react";
import { ErrorPage } from "./Error";
import {  useSelector } from "react-redux";
import { CiMusicNote1 } from "react-icons/ci";
import QuranReader from "../components/uncommen/QuranReader";







function SurahInfoPage() {
  const [surahParms] = useSearchParams();
  const query = surahParms.get('q').split('_') || '';
  const id = query?.[0];
  const name = query?.[1];
  const [isSticky, setIsSticky] = useState(false);
  const lang = useSelector((state)=> state.lang);
  const { data, isLoading, error } = useGetSurahRecitersQuery({id, lang});
  const {data: quranTxt} = useGetSvgSurahQuery(id);
    const { data: suwarData } = useGetAllSurahDetailsQuery(lang);
  const [surahObj, setSurahObj] = useState([]);
  const [reciterObj, setReciterObj] = useState([]);






  // handel grandinat on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);




  // make reciter object
  useEffect(() => {
    const generateSurahData = async () => {

      const surah = suwarData?.suwar.filter((surah)=> surah.id == id );

      setSurahObj(surah?.[0]);

      const surahPromises = data?.reciters.map((reciter)=> {
        const moshaf = reciter?.moshaf?.[0];
        const num = moshaf?.surah_list.split(',').find((i)=> i == id);
          const formatted = id.padStart(3, '0');
          const url = `${moshaf.server}${formatted}`;
          try {
                return {
                  id: `${reciter?.name}-${surah?.[0]?.name}-${num}`,
                  url: `${url}.mp3`,
                  number: parseInt(num, 10),
                  name: surah?.[0]?.name || "Unknown Surah",
                  makkia:  surah?.[0]?.makkia || 0,
                  reciter: {
                    id: `${reciter?.name}-${reciter?.id}`,
                    name: reciter?.name,
                    moshaf: moshaf?.name,
                  },
                };
              } catch (error) {
                console.error("Error loading audio duration:", error);
                return null;
              }
        
      }
      );
      const surahData = (await Promise.all(surahPromises)).filter(Boolean);
      setReciterObj(surahData);
    };

    generateSurahData();
  }, [id, data, suwarData]);



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
                <CiMusicNote1 className="size-7 text-sky-400" />
              </span>{" "}
              Let's Dive In Peace
            </span>
            <div className="reciter-name capitalize text-9xl font-extrabold max-sm:text-5xl text-white mt-5 mb-7 text-wrap overflow-hidden text-ellipsis max-w-[900px] lg:w-fit lg:overflow-visible ">
              {surahObj?.name}
            </div>
            <div className="text-white capitalize text-lg max-sm:text-sm flex items-center gap-1.5 ">
              <span className="text-2xl  text-green font-bold">{reciterObj.length}</span> Surah Reciters
            </div>
          </div>
          <div className="down   bg-gradient-to-b from-blue-500/30 from-1% to-5%  to-second-black ">
            <div className="list mt-4 px-5 py-4">
              <h3 className="text-3xl font-bold text-heading capitalize mb-6">
                the surah's
              </h3>
              <div className="surah-list flex flex-col gap-3  ">
                {reciterObj.map((surah, i) => (
                  <SurahListItem
                                      key={surah.id}
                                      index={i + 1}
                                      surahData={surah}
                                      audioQueue={reciterObj}
                                      onFavorite={true}
                                    />
                ))}
              </div>
            </div>
          <div className="mt-5">
          {quranTxt && <QuranReader data={quranTxt} />}
          </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SurahInfoPage;
