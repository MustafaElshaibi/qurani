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
import { IoLocationSharp } from "react-icons/io5";
import { Helmet } from "react-helmet-async";

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
  const [reciterInfo, setReciterInfo] = useState({
    img: avatar,
    description: "",
    country: "",
    url: "",
  });
  const [isImgLoading, setIsImgLoading] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const maxDescLength = 250;

  const loadReciterInfo = useCallback(
    async (reciterName) => {
      setIsImgLoading(true);
      if (!reciterName) {
        setReciterInfo((prev) => ({ ...prev, img: avatar, description: "" }));
        setIsImgLoading(false);
        return;
      }
      try {
        const info = await requestManager.getReciterInfo(
          reciter.id,
          reciterName
        );
        if (!info?.img) {
          setReciterInfo((prev) => ({ ...prev, img: avatar }));
          setIsImgLoading(false);
          return;
        }
        if (!info.description) {
          setReciterInfo((prev) => ({ ...prev, description: "" }));
          setIsImgLoading(false);
          return;
        }
        setReciterInfo((prev) => ({
          ...prev,
          img: info?.img,
          description: info?.description,
          country: info?.country,
          url: info?.url,
        }));
        setIsImgLoading(false);
      } catch (err) {
        console.log(err);
        setReciterInfo((prev) => ({ ...prev, img: avatar, description: "" }));
        setIsImgLoading(false);
      } finally {
        setIsImgLoading(false);
      }
    },
    [reciter?.id]
  );
  // Set document title
  useEffect(() => {
    if (reciter?.name) {
      document.title = `${reciter?.name} - Quran App`;
      loadReciterInfo(reciter?.name);
    }
  }, [reciter?.name, loadReciterInfo]);

  // Handle sticky header on scroll (throttled)
  useEffect(() => {
    // Get the target element
    const reciterDiv = document.querySelector(".main-display ");
    if (!reciterDiv) return;

    const handleScroll = () => {
      // Get current scroll position (equivalent to window.scrollY for the element)
      const scrollTop = reciterDiv.scrollTop;
      setIsSticky(scrollTop > 200);
    };

    reciterDiv.addEventListener("scroll", handleScroll);
    return () => {
      // Cleanup: remove event listener and clear timeout
      reciterDiv.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
          imgUrl: reciterInfo?.img,
        },
      };
    });
  }, [moshaf, suwarData, reciter, reciterInfo?.img]);

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
    <>
      <Helmet>
        <title>
          {reciter?.name
            ? `${reciter.name} | Reciter | Qurani`
            : "Reciter | Qurani"}
        </title>
        <meta
          name="description"
          content={
            reciterInfo?.description
              ? `${reciter?.name} - ${reciterInfo.description.slice(0, 150)}`
              : `Listen to recitations and explore chapters by ${reciter?.name || "this reciter"} on Qurani.`
          }
        />
        <meta
          name="keywords"
          content={`Quran, Qurani, Reciter, ${reciter?.name || ""}, Quran Audio, Islamic, Islam, Qari, Elshaibi`}
        />
        <meta name="author" content="Elshaibi" />
        <link
          rel="canonical"
          href={`https://qurani-opal.vercel.app/reciter?q=${reciter?.id || ""}`}
        />
        <meta name="robots" content="index, follow" />
        {/* Open Graph */}
        <meta
          property="og:title"
          content={
            reciter?.name
              ? `${reciter.name} | Reciter | Qurani`
              : "Reciter | Qurani"
          }
        />
        <meta
          property="og:description"
          content={
            reciterInfo?.description
              ? `${reciter?.name} - ${reciterInfo.description.slice(0, 150)}`
              : `Listen to recitations and explore chapters by ${reciter?.name || "this reciter"} on Qurani.`
          }
        />
        <meta
          property="og:url"
          content={`https://qurani-opal.vercel.app/reciter?q=${reciter?.id || ""}`}
        />
        <meta property="og:image" content={reciterInfo?.img || "/quranLogo.svg"} />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={
            reciter?.name
              ? `${reciter.name} | Reciter | Qurani`
              : "Reciter | Qurani"
          }
        />
        <meta
          name="twitter:description"
          content={
            reciterInfo?.description
              ? `${reciter?.name} - ${reciterInfo.description.slice(0, 150)}`
              : `Listen to recitations and explore chapters by ${reciter?.name || "this reciter"} on Qurani.`
          }
        />
        <meta name="twitter:image" content={reciterInfo?.img || "/quranLogo.svg"} />
      </Helmet>
      <div className="flex reciter flex-col bg-second-black rounded-lg  w-full min-h-screen ">
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
                {reciterInfo?.country && (
                  <span className="text-sm font-normal flex items-center  text-gray-400 capitalize ml-2">
                    {reciterInfo?.country}{" "}
                    <span><IoLocationSharp className="text-pink-600 size-4" /></span>
                  </span>
                )}
              </span>
              <div className="reciter-name   capitalize text-9xl font-extrabold max-sm:text-5xl text-white mt-5 mb-7 text-wrap overflow-hidden text-ellipsis max-w-[900px] lg:w-fit lg:overflow-visible ">
                {reciter?.name}
              </div>
              <ViewsCount reciter={reciter} />
              <div className="description mt-3">
                <p className="text-white text-sm font-medium max-sm:text-sm">
                  {reciterInfo?.description
                    ? showFullDesc ||
                      reciterInfo?.description.length <= maxDescLength
                      ? reciterInfo?.description
                      : reciterInfo?.description.slice(0, maxDescLength) + "..."
                    : "No description available"}
                </p>
                {reciterInfo?.description &&
                  reciterInfo?.description.length > maxDescLength && (
                    <button
                      className="text-sky-400 underline text-xs mt-1"
                      onClick={() => setShowFullDesc((prev) => !prev)}
                    >
                      {showFullDesc ? "Show Less" : "Show More"}
                    </button>
                  )}
              </div>
            </div>
            <div className="down   bg-gradient-to-b from-blue-500/30 from-1% to-5%  to-second-black ">
              <div
                className={`actions flex items-center gap-4 sm:gap-6 py-3 sm:py-4 px-5 sticky top-[0px] z-20 backdrop-blur-lg  `}
              >
                <PlayButton surahQueue={surahUrls} />
                <button className="block py-1 px-3 max-sm:text-sm font-medium sm:py-2 sm:px-5 rounded-full cursor-pointer border-1 border-white text-white">
                  Follow
                </button>
                <button className="cursor-pointer ">
                  <IoIosMore className="text-white size-5 sm:size-7 font-bold " />
                </button>
              </div>
              <div className="list mt-4 px-2 sm:px-5 py-4">
                <h3 className=" text-lg max-sm:px-2 sm:text-3xl font-bold text-heading capitalize mb-4 sm:mb-6">
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
                    <div className="info relative w-[80%] max-sm:w-full overflow-hidden ">
                      <div className="bg-black absolute top-0 left-0 w-full h-full z-10 opacity-40"></div>
                      <div
                        className="img w-full h-[700px] max-sm:h-[300px]  rounded-lg overflow-hidden "
                        style={{
                          backgroundImage: `url(${reciterInfo?.img})`,
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                        }}
                      ></div>
                      <div className="txt  absolute left-5 bottom-5 z-20 p-5">
                        <div
                          title={reciterInfo?.description}
                          className="text-white capitalize max-h- text-lg max-sm:text-xs "
                        >
                          {reciterInfo?.description.slice(0, maxDescLength) +
                            "..."}
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
    </>
  );
}

export default ListSurahOfReciter;
