

import { memo, useMemo, useState } from "react";
import { FaPause, FaPlay, FaMosque } from "react-icons/fa";
import { LiaKaabaSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import { playTrack, togglePlayPause } from "../../rtk/Reducers/PlayerReducer";
import Cookies from "universal-cookie";
import ModualSignIn from "./ModualSignIn";
import {  Link, useNavigate } from "react-router-dom";
import HeartFavorite from "./HeartFavorite";
import { TbCirclePlus } from "react-icons/tb";
import LibraryAvailable from "../libraries/LibrariesAvailable";


const cookies = new Cookies();

function SurahListItem({ index, surahData, audioQueue , onFavorite, onSurah}) {
  const lang = useSelector((state)=> state.lang);
  const { isPlaying, currentSurah, currentTime, duration } = useSelector(
    (state) => state.player
  );
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showLib, setShowLib] = useState(false);
  const token = cookies.get('auth-token');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isCurrent =
    currentSurah?.id === surahData?.id &&
    surahData?.reciter?.id === currentSurah?.reciter?.id;
  const showPlayIcon = isHovered || (isCurrent && !isPlaying);


   // Memoize progress calculation
   const progress = useMemo(() => 
    isCurrent && duration > 0 ? (currentTime / duration) * 100 : 0,
    [isCurrent, currentTime, duration]
  );

  // play/pause track when clicked
  const handlePlayClick = () => {
    if(!token) {
      setShowSignInModal(true);
      return;
    } 
    if (isCurrent) {
      // Toggle play/pause for current track
      dispatch(togglePlayPause());
    } else {
      // Play new track with proper queue handling
      dispatch(
        playTrack({
          surah: surahData,
          queue: audioQueue,
          context: "surah",
        })
      );
    }
  };




 



  return (
   <>
     <ModualSignIn
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSignIn={() => navigate('/login')}
      />
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="surah flex items-center justify-between gap-1 sm:gap-5 px-5 max-sm:px-1 py-2 transition-colors duration-300 hover:bg-hover-black rounded-lg"
    >
      <div className="flex items-center flex-1 transition-all duration-300 ">
        <div className="relative w-8 h-8 flex items-center justify-center">
          {isCurrent && (
            <svg
              className="absolute top-0 left-0 w-full h-full transform -rotate-90"
              viewBox="0 0 35 35"
            >
              <circle
                cx="17"
                cy="17"
                r="16"
                className="stroke-current text-gray-800"
                fill="none"
                strokeWidth="2"
              />
              <circle
                cx="17"
                cy="17"
                r="16"
                className={`stroke-current ${isPlaying  ? (onFavorite ? 'text-pink-600' : 'text-green') : 'text-white'}`}
                fill="none"
                strokeWidth="2"
                strokeDasharray={`${progress} 100`}
                strokeLinecap="round"
              />
            </svg>
          )}

          <button
            onClick={handlePlayClick}
            className="relative z-10 flex items-center justify-center cursor-pointer"
          >
            {showPlayIcon ? (
              isCurrent && isPlaying ? (
                <FaPause className={` size-4 ${isCurrent ? isPlaying  ? (onFavorite ? 'text-pink-600' : 'text-green') : 'text-white' : "text-gray"}`} />
              ) : (
                <FaPlay
                  className={`${isCurrent ? isPlaying  ? (onFavorite ? 'text-pink-600' : 'text-green') : 'text-white' : "text-gray"} size-4`}
                />
              )
            ) : isCurrent && isPlaying ? (
              <FaPause className={` size-4 ${isCurrent ? isPlaying  ? (onFavorite ? 'text-pink-600' : 'text-green') : 'text-white': "text-gray"}`} />
            ) : (
              <span className="text-gray font-bold text-lg">{index}</span>
            )}
          </button>
        </div>

        <div className="flex items-center ml-1 sm:ml-4 ">
          <div className={`w-[60px] h-[60px] ${lang === 'eng' ? 'mr-4': 'ml-4'} rounded-lg bg-gray-800 overflow-hidden`}>
            {/* Replace with actual image */}
            {
              onSurah && surahData?.reciter?.imgUrl ? (
                <img
                  src={surahData?.reciter?.imgUrl}
                  alt={surahData?.reciter?.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                
              )
              : 
              (
                <div className="w-full h-full bg-gray-700 animate-pulse" />
              )
            }
          </div>
         <div className="txt">
         {
          onSurah ? 
          (
            <div
            className={`text-ellipsis overflow-hidden sm:text-xl ${
              isCurrent ? (onFavorite ? 'text-pink-600' : "text-green" ): "text-heading"
            }`}
          >
            {surahData?.reciter?.name || "......."}
          </div>
          )
          :
          (
            <Link
            to={`/surah?q=${surahData?.surahId}`} 
            className={`text-ellipsis overflow-hidden sm:text-xl ${
              isCurrent ? (onFavorite ? 'text-pink-600' : "text-green" ): "text-heading"
            }`}
          >
            { surahData?.name || "......."}
          </Link>
          )
         }
          {
          
            onFavorite || onSurah && (
              <div className={`reciter-name text-ellipsis overflow-hidden text-xs ${isCurrent ? (onSurah ? 'text-green' : 'text-pink-600') : 'text-white'} `}> {onSurah ? surahData?.name : surahData?.reciter?.name} </div>
            )
          }
         </div>
        </div>
       
      </div>
      <div className=" relative">
      {
        showLib && isHovered && 
        (
          <LibraryAvailable surahData={surahData} onClick={()=> setShowLib(!showLib)} />
        )
      }
      <TbCirclePlus onClick={()=> setShowLib(!showLib)} className={`text-gray   ${isHovered ? 'sm:block' : 'hidden'} cursor-pointer size-5`} />
      </div>
       <HeartFavorite song={surahData} />
      <div className="text-gray w-[50px] flex items-center justify-center max-sm:hidden">
     
        {surahData?.makkia ? (
          <LiaKaabaSolid className="size-6" />
        ) : (
          <FaMosque className="size-4" />
        )}
      </div>

      <div className="text-gray font-bold max-sm:hidden">
        {isCurrent ? formatTime(duration) : surahData?.duration || "--:--"}
      </div>
    </div>
   </>
  );
}


// // Helper function to format time
const formatTime = (seconds) => {
  const remainingSecondsAfterHours = seconds % 3600;
  const minutes = Math.floor(remainingSecondsAfterHours / 60);
  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${hours > 0 ? `${hours.toString().padStart(2, "0")}:` : ""}${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export default memo(SurahListItem);




