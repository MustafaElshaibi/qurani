import { MdVerified } from "react-icons/md";
import { IoIosMore } from "react-icons/io";
import PlayButton from "../components/commen/PlayButton";
import SurahListItem from "../components/uncommen/SurahListItem";
import { useSearchParams } from "react-router-dom";
import {
  useGetAllSurahDetailsQuery,
  useGetReciterQuery,
} from "../rtk/Services/QuranApi";
import { useEffect, useState, useMemo, useCallback } from "react";
import avatar from "../assets/images/avtr.png";
import { useSelector } from "react-redux";
import ViewsCount from "../components/commen/ViewsCount";
import { requestManager } from "../utility/requestManager";
import PageLoader from "../components/uncommen/PageLoader";
import { fetchReciterDescription } from "../utility/gemini";

function ListSurahOfReciter() {
  const [searchParams] = useSearchParams();
  const qurey = searchParams.get("q") || "";
  const [isSticky, setIsSticky] = useState(false);
  const lang = useSelector((state) => state.lang);
  const { data, isLoading, isFetching, error, refetch } = useGetReciterQuery({
    id: qurey,
    lang,
  });
  const { data: suwarData } = useGetAllSurahDetailsQuery(lang);
  const reciter = data?.reciters?.[0] || null;
  const moshaf = reciter?.moshaf?.[0];
  const [reciterImg, setReciterImg] = useState(avatar);
  const [isImgLoading, setIsImgLoading] = useState(true);
  const [discription, setDiscription] = useState("");

  const loadReciterInfo = async (reciterName) => {
    try {
      const info = await fetchReciterDescription(reciterName);
      setDiscription(info);
    } catch (err) {
      setDiscription('');
    } 
  };
  // Set document title
  useEffect(() => {
    if (reciter?.name) {
      document.title = `${reciter?.name} - Quran App`;
      loadReciterInfo(reciter?.name);
    }
  }, [reciter?.name]);
  // Handle sticky header on scroll (throttled)
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch reciter image only when reciter changes
  useEffect(() => {
    let isMounted = true;
    setIsImgLoading(true);
    if (!reciter?.name) {
      setReciterImg(avatar);
      setIsImgLoading(false);
      return;
    }
    requestManager
      .getImage(reciter.id, reciter.name)
      .then((imageUrl) => {
        if (isMounted) setReciterImg(imageUrl || avatar);
      })
      .catch(() => {
        if (isMounted) setReciterImg(avatar);
      })
      .finally(() => {
        if (isMounted) setIsImgLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [reciter?.id, reciter?.name]);

  // Memoize surahUrls for performance
  const surahUrls = useMemo(() => {
    if (!moshaf?.surah_list || !moshaf?.server || !suwarData) return [];
    return moshaf.surah_list.split(",").map((num) => {
      const surahDetail = suwarData?.suwar.find((surah) => surah.id == num);
      const formatted = num.padStart(3, "0");
      const url = `${moshaf.server}${formatted}`;
      return {
        id: `${reciter?.id}-${num}`,
        surahId: `${surahDetail?.id}`,
        url: `${url}.mp3`,
        number: parseInt(num, 10),
        name: surahDetail?.name || "Unknown Surah",
        makkia: surahDetail?.makkia || 0,
        reciter: {
          id: `${reciter?.id}`,
          name: reciter?.name,
          moshaf: moshaf?.name,
          imgUrl: reciterImg,
        },
      };
    });
  }, [moshaf, suwarData, reciter, reciterImg]);

  // PlayButton handler (memoized)
  const handlePlayAll = useCallback(() => {
    // Implement play all logic if needed
  }, [surahUrls]);

  // Handle Retry Logic
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
    <div className="flex flex-col bg-second-black rounded-lg  w-full min-h-screen ">
      {isLoading || isFetching ? (
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
        <>
          <div
            className={`top relative  min-h-[300px] px-5 py-7 ${
              isSticky &&
              "bg-gradient-to-b from-blue-500/30 to-blue-500/20 transition-colors"
            }`}
          >
            <span className="flex items-center gap-2 text-white text-lg font-medium ">
              <span>
                <MdVerified className="size-7 text-sky-400" />
              </span>{" "}
              Good Reciter
            </span>
            <div className="reciter-name   capitalize text-9xl font-extrabold max-sm:text-5xl text-white mt-5 mb-7 text-wrap overflow-hidden text-ellipsis max-w-[900px] lg:w-fit lg:overflow-visible ">
              {reciter?.name}
            </div>
            <ViewsCount reciter={reciter} />
          </div>
          <div className="down   bg-gradient-to-b from-blue-500/30 from-1% to-5%  to-second-black ">
            <div
              className={`actions flex items-center gap-4 sm:gap-6 py-3 sm:py-4 px-5 ${
                isSticky && "sticky top-[90px] z-20 backdrop-blur-lg "
              }`}
            >
              <PlayButton
                onClick={handlePlayAll}
                surahQueue={surahUrls}
              />
              <button className="block py-1 px-3 max-sm:text-sm font-medium sm:py-2 sm:px-5 rounded-full cursor-pointer border-1 border-white text-white">
                Follow
              </button>
              <button className="cursor-pointer ">
                <IoIosMore className="text-white size-5 sm:size-7 font-bold " />
              </button>
            </div>
            <div className="list mt-4 px-5 py-4">
              <h3 className="text-3xl font-bold text-heading capitalize mb-6">
                {lang === "eng" ? "Chapters" : "السور"}
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
                  {lang === "eng" ? "About" : "حول"}
                </h3>
                {isImgLoading ? (
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
                ) : (
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
                      <ViewsCount reciter={reciter} />
                      <div className="text-white capitalize text-lg max-sm:text-xs ">
                        {discription}
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Sapiente optio voluptatem voluptas veritatis
                        excepturi possimus beatae voluptatibus cumque ipsam,
                        laboriosam corrupti dicta eos! Veniam repellat dicta
                        impedit dolorum, porro harum.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ListSurahOfReciter;
