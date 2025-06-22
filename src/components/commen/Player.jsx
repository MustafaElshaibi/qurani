import {
  PiShuffleFill,
  PiSpeakerHighFill,
  PiSpeakerSlashFill,
  PiVinylRecordFill,
} from "react-icons/pi";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  togglePlayPause,
  nextTrack,
  previousTrack,
  toggleShuffle,
  setRepeat,
  setVolume,
  setCurrentTime,
} from "../../rtk/Reducers/PlayerReducer";
import audioService from "../../services/audioService";
import { store } from "../../rtk/store";
import { FaMosque, FaPause, FaPlay, FaRecordVinyl } from "react-icons/fa";
import { TiMediaPause } from "react-icons/ti";
import { IoPlay } from "react-icons/io5";
import {
  TbPlayerSkipBackFilled,
  TbPlayerSkipForwardFilled,
} from "react-icons/tb";
import { LuRepeat1, LuRepeat2 } from "react-icons/lu";
import { GoKebabHorizontal, GoScreenNormal } from "react-icons/go";
import { LiaKaabaSolid } from "react-icons/lia";
import HeartFavorite from "../uncommen/HeartFavorite";
import { IoIosArrowDown } from "react-icons/io";
import Cookies from "universal-cookie";
import { useLocation } from "react-router-dom";
import { requestManager } from "../../utility/requestManager";
const cookies = new Cookies();

const Player = () => {
  const [showFull, setShowFull] = useState(false);
  const [mute, setMute] = useState(false);
  const token = cookies.get("auth-token");
  // Add a ref to store previous volume
  const previousVolumeRef = useRef(1); // Default to max volume
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    currentSurah,
    isPlaying,
    currentTime,
    duration,
    volume,
    repeat,
    shuffle,
    queue,
    history,
  } = useSelector((state) => state.player);
  const [isPlayerShown, setIsPlayerShown] = useState(true);
  const lang = useSelector((state) => state.lang);

  // Initialize audio service
  useEffect(() => {
    audioService.initialize(store);
  }, []);

  //  Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT') return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          dispatch(togglePlayPause());
          break;
        case 'ArrowLeft':
          e.preventDefault();
          dispatch(setCurrentTime(+currentTime - 5));
          audioService.seekTo(+currentTime - 5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          dispatch(setCurrentTime(+currentTime + 5));
          audioService.seekTo(+currentTime + 5);
          break;
        case 'ArrowUp':
          e.preventDefault();
          dispatch(setVolume(volume + 0.1));
          audioService.setVolume(volume + 0.1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          dispatch(setVolume(volume - 0.1));
          audioService.setVolume(volume - 0.1);
          break;
        case 'm':
        case 'M':
          setMute(!mute);
          break;
      }
    };

    window.addEventListener('popstate', ()=> setShowFull(false))

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  });

  // Handle play/pause
  useEffect(() => {
    if (!currentSurah) return;

    const controller = new AbortController();

    const handlePlayback = async () => {
      try {
        if (isPlaying) {
          await audioService.play(currentSurah);
        } else {
          await audioService.pause();
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Playback error:", error);
          dispatch(togglePlayPause());
        }
      }
    };

    handlePlayback();

    return () => {
      controller.abort();
    };
  }, [currentSurah, isPlaying, dispatch]);

  // handel mute and unmute
  useEffect(() => {
    if (mute) {
      // store the volume
      previousVolumeRef.current = volume;
      dispatch(setVolume(0));
      audioService.setVolume(0);
    } else {
      // new volume
      const newVolume =
        previousVolumeRef.current > 0 ? previousVolumeRef.current : 1;
      dispatch(setVolume(newVolume));
      audioService.setVolume(newVolume);
    }
  }, [mute, dispatch]);

  // Handle track change
  useEffect(() => {
    if (currentSurah) {
      document.title = `${currentSurah?.name} - ${currentSurah?.reciter?.name}`;
    }
  }, [currentSurah]);

  const handlePlayPause = () => {
    dispatch(togglePlayPause());
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    dispatch(setCurrentTime(time));
    audioService.seekTo(time);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    dispatch(setVolume(newVolume));
    audioService.setVolume(newVolume);
  };

  const handleImg = ()=> {
    try {
      const data = requestManager.getReciterInfo(currentSurah?.reciter?.id, currentSurah?.reciter?.name);
      const img = data?.img ? data.img : currentSurah?.reciter?.imgUrl;
      console.log(img)
      return img;
    } catch (error) {
      console.error("Error fetching reciter image:", error);
      return currentSurah?.reciter?.imgUrl;
    }
  }

  if ((!currentSurah && location.pathname === "/") ) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-second-black border-t border-gray/20 h-21">
    <div className="container mx-auto px-4 h-full flex items-center">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="w-12 h-12 bg-gray/20 rounded-lg animate-shimmer"></div>
        <div className="min-w-0 flex-1">
          <div className="h-4 bg-gray/20 rounded mb-2 w-1/2 animate-shimmer"></div>
          <div className="h-3 bg-gray/20 rounded w-1/3 animate-shimmer"></div>
        </div>
      </div>
      <div className="flex items-center gap-4 mx-8">
        <div className="w-8 h-8 bg-gray/20 rounded-full animate-shimmer"></div>
        <div className="w-10 h-10 bg-gray/20 rounded-full animate-shimmer"></div>
        <div className="w-8 h-8 bg-gray/20 rounded-full animate-shimmer"></div>
      </div>
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="w-10 h-3 bg-gray/20 rounded animate-shimmer"></div>
        <div className="flex-1 h-1 bg-gray/20 rounded animate-shimmer"></div>
        <div className="w-10 h-3 bg-gray/20 rounded animate-shimmer"></div>
      </div>
    </div>
  </div>
    )
  }
  if(!currentSurah) return null;
  if (!token) return null;

  return (
    <>
      {isPlayerShown ? (
        <>
          {/* on large screens */}
          <div className="player flex items-center  bg-search-dark h-[110px] fixed bottom-0 left-0 w-full px-12 py-4 gap-14 z-40 max-sm:flex-col max-sm:hidden">
            <IoIosArrowDown
              onClick={() => setIsPlayerShown(!isPlayerShown)}
              className="size-5 text-white absolute right-4 cursor-pointer top-2 z-10"
            />
            <div className="surah-info flex items-center gap-4 max-sm:hidden ">
              <div className="img w-[90px] h-[90px] overflow-hidden rounded-lg   ">
                
                  <img
                    src={handleImg()}
                    alt=""
                    className=" w-[90px] h-[90px] object-cover rounded-lg"
                  />
               
              </div>
              <div className="info overflow-hidden flex-1/3">
                <div className="surah-title text-heading text-lg">
                  {currentSurah?.name}
                </div>
                <div className="reciter-name text-gray text-xs ">
                  {currentSurah?.reciter?.name}
                </div>
              </div>
              <div className="detailes">
                {currentSurah && <HeartFavorite song={currentSurah} />}
              </div>
            </div>

            <div className="player-cont flex-1 ">
              <div className="flex flex-col ">
                <div className="top mb-2 text-white flex items-center gap-5 justify-center">
                  <button onClick={() => dispatch(toggleShuffle())}>
                    <PiShuffleFill
                      className={`size-5 cursor-pointer ${
                        shuffle ? "text-green" : "text-gray"
                      }`}
                    />
                  </button>
                  <button
                    disabled={history.length === 0 && currentTime < 3}
                    onClick={() => dispatch(previousTrack())}
                  >
                    <TbPlayerSkipBackFilled className={`size-5 cursor-pointer ${history.length === 0 ? 'text-gray' : 'text-gray-100'} `} />
                  </button>
                  <button
                    onClick={handlePlayPause}
                    className="rounded-full  bg-white w-[50px] h-[50px] cursor-pointer flex items-center justify-center"
                  >
                    {isPlaying ? (
                      <TiMediaPause className="text-main-black size-8 " />
                    ) : (
                      <IoPlay className="text-main-black size-6 " />
                    )}
                  </button>
                  <button
                    disabled={queue.length === 0 && repeat === "none"}
                    onClick={() => dispatch(nextTrack())}
                  >
                    <TbPlayerSkipForwardFilled className={`size-5 cursor-pointer ${queue.length === 0 && repeat === "none" ? 'text-gray' : 'text-gray-100'} `} />
                  </button>
                  <button onClick={() => dispatch(setRepeat())}>
                    {repeat === "none" || repeat === "playlist" ? (
                      <LuRepeat2
                        className={`size-5 cursor-pointer  ${
                          repeat === "playlist"
                            ? "text-green"
                            : repeat === "none" && "text-gray"
                        }`}
                      />
                    ) : (
                      <LuRepeat1
                        className={`size-5 cursor-pointer text-green`}
                      />
                    )}
                  </button>
                </div>
                <div className="down flex items-center gap-3">
                  <span className="text-xs text-gray font-bold ">
                    {formatTime(currentTime)}
                  </span>
                  <div className="prog flex-1">
                    <div className="group flex items-center justify-center relative w-full">
                      {" "}
                      {/* Add wrapper for hover effects */}
                      <input
                        type="range"
                        className={`w-full h-1   bg-gray-400 rounded-full appearance-none cursor-pointer transition-all
      [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
      [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full
      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
      [&::-webkit-slider-thumb]:hidden 
      [&::-webkit-slider-thumb]:scale-0 group-hover:[&::-webkit-slider-thumb]:scale-100
      group-hover:[&::-webkit-slider-thumb]:block
      [&::-webkit-slider-thumb]:transition-all [&::-moz-range-thumb]:w-3
      [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full
      [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:scale-0
      [&::-moz-range-thumb]:group-hover:scale-100 [&::-moz-range-thumb]:transition-all
      
       ${
         lang === "eng"
           ? "group-hover:bg-[linear-gradient(to_right,#1DB954_var(--progress),#535353_var(--progress))]"
           : "group-hover:bg-[linear-gradient(to_left,#1DB954_var(--progress),#535353_var(--progress))]"
       }
       ${
         lang === "eng"
           ? "bg-[linear-gradient(to_right,#fff_var(--progress),#535353_var(--progress))]"
           : "bg-[linear-gradient(to_left,#fff_var(--progress),#535353_var(--progress))]"
       }`}
                        style={{
                          "--progress": `${(currentTime / duration) * 100}%`,
                        }}
                        min={0}
                        max={duration}
                        value={currentTime}
                        onChange={handleSeek}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray font-bold ">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>
            <div className="volum-info flex justify-center items-center max-sm:order-2 max-sm:hidden">
              <div className="volume flex  items-center gap-3">
                <div
                  className="icon flex items-center justify-center cursor-pointer"
                  onClick={() => setMute(!mute)}
                >
                  {volume > 0 ? (
                    <PiSpeakerHighFill className="text-white size-4" />
                  ) : (
                    <PiSpeakerSlashFill className="text-white size-4" />
                  )}
                </div>
                <div className="group flex items-center justify-center relative w-full">
                  {" "}
                  {/* Add wrapper for hover effects */}
                  <input
                    type="range"
                    className={`w-full h-1   bg-gray-400 rounded-full appearance-none cursor-pointer transition-all
      [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
      [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full
      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
      [&::-webkit-slider-thumb]:scale-0 group-hover:[&::-webkit-slider-thumb]:scale-100
      [&::-webkit-slider-thumb]:transition-all [&::-moz-range-thumb]:w-3
      [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full
      [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:scale-0
      [&::-moz-range-thumb]:group-hover:scale-100 [&::-moz-range-thumb]:transition-all
      ${
        lang === "eng"
          ? "group-hover:bg-[linear-gradient(to_right,#1DB954_var(--progress),#535353_var(--progress))]"
          : "group-hover:bg-[linear-gradient(to_left,#1DB954_var(--progress),#535353_var(--progress))]"
      }
     ${
       lang === "eng"
         ? " bg-[linear-gradient(to_right,#fff_var(--progress),#535353_var(--progress))]"
         : " bg-[linear-gradient(to_left,#fff_var(--progress),#535353_var(--progress))]"
     }`}
                    style={{
                      "--progress": `${(volume / 1) * 100}%`,
                    }}
                    min={0}
                    max={1}
                    step={0.001}
                    value={volume}
                    onChange={handleVolumeChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* on small screens  */}
          <div
            className={`player transition-all   duration-300 flex items-center  bg-search-dark  fixed bottom-0 left-0 w-full   z-40  sm:hidden ${
              showFull ? "h-screen flex-col justify-between" : "h-[70px]"
            }`}
          >
            {/* small bar in bottom   */}
            <div
              className={`minishow relative w-full h-full ${
                showFull ? "hidden" : "block"
              }`}
            >
              <div
                className={`flex items-center gap-3 px-4 mt-1 w-full ${
                  showFull ? "hidden" : "flex"
                }`}
              >
                <div
                  onClick={() => setShowFull(!showFull)}
                  className={`one cursor-pointer  items-center gap-3  grow flex`}
                >
                
                    <img
                      src={handleImg()}
                      alt={currentSurah?.reciter?.name}
                      className="w-[60px]  rounded-lg object-cover h-[60px] "
                    />
                  <div className="block overflow-hidden">
                    <div className="surah-title text-heading text-lg flex items-center justify-center ">
                      {currentSurah?.name}
                      <IoIosArrowDown
                        onClick={() => setIsPlayerShown(!isPlayerShown)}
                        className="size-5 text-white ml-2 cursor-pointer  z-10"
                      />
                    </div>
                    <div className="reciter-name text-gray text-xs ">
                      {currentSurah?.reciter?.name}
                    </div>
                  </div>
                </div>
                <HeartFavorite song={currentSurah} />
                <button
                  onClick={handlePlayPause}
                  className="rounded-full  w-[40px] h-[40px] cursor-pointer flex items-center justify-center"
                >
                  {isPlaying ? (
                    <TiMediaPause className="text-white size-8 " />
                  ) : (
                    <IoPlay className="text-white size-6 " />
                  )}
                </button>
              </div>
              <div
                className={`down absolute left-0 bottom-0 w-full ${
                  showFull ? "hidden" : "block"
                }  `}
              >
                <div className="prog flex-1">
                  <div className="group flex items-center justify-center relative w-full">
                    {" "}
                    {/* Add wrapper for hover effects */}
                    <input
                      type="range"
                      className={`w-full h-[3px]   bg-gray-400 rounded-full appearance-none cursor-pointer transition-all
      [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
      [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full
      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
      [&::-webkit-slider-thumb]:scale-0 
      [&::-webkit-slider-thumb]:transition-all [&::-moz-range-thumb]:w-3
      [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full
      [&::-moz-range-thumb]:border-none
   [&::-moz-range-thumb]:transition-all
      ${
        lang === "eng"
          ? "group-hover:bg-[linear-gradient(to_right,#1DB954_var(--progress),#535353_var(--progress))]"
          : "group-hover:bg-[linear-gradient(to_left,#1DB954_var(--progress),#535353_var(--progress))]"
      }
      ${
        lang === "eng"
          ? "bg-[linear-gradient(to_right,#fff_var(--progress),#535353_var(--progress))]"
          : "bg-[linear-gradient(to_left,#fff_var(--progress),#535353_var(--progress))]"
      }`}
                      style={{
                        "--progress": `${(currentTime / duration) * 100}%`,
                      }}
                      min={0}
                      max={duration}
                      value={currentTime}
                      onChange={handleSeek}
                    />
                  </div>
                </div>
              </div>
            </div>


            {/* full player for mobile */}
            <div
              className={`surah-info grow w-full p-5 transition-all duration-500 flex flex-col items-center justify-center gap-19 ${
                showFull ? "block" : "max-sm:hidden"
              }`}
            >
            <div className="w-full">
                <div className="flex items-center justify-between w-full mb-7 mt-8">
                <IoIosArrowDown
                  onClick={() => setShowFull(!showFull)}
                  className="text-white cursor-pointer size-6 "
                />
                <GoKebabHorizontal className="text-white cursor-pointer size-6 " />
              </div>
                <img
                  src={handleImg()}
                  alt={currentSurah?.reciter?.name}
                  className="w-full h-[300px] rounded-lg object-cover mb-4 shadow-lg"
                />
             
              <div
                className={`info flex items-center justify-between px-5 mt-2 w-full`}
              >
                <div className="block overflow-hidden">
                  <div className="surah-title text-heading text-lg">
                    {currentSurah?.name}
                  </div>
                  <div className="reciter-name text-gray text-xs ">
                    {currentSurah?.reciter?.name}
                  </div>
                </div>
                <HeartFavorite song={currentSurah}  className={'!block'}/>
              </div>
            </div>

              <div
              className={`player-cont mb-2 p-2 w-full cursor-pointer ${
                showFull ? "block" : "hidden"
              }`}
            >
              <div className="flex flex-col ">
                <div className="down flex mb-5 items-center gap-3">
                  <span className="text-xs text-gray font-bold ">
                    {formatTime(currentTime)}
                  </span>
                  <div className="prog flex-1">
                    <div className="group flex items-center justify-center relative w-full">
                      {" "}
                      {/* Add wrapper for hover effects */}
                      <input
                        type="range"
                        className={`w-full h-1   bg-gray-400 rounded-full appearance-none cursor-pointer transition-all
      [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
      [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full
      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
      [&::-webkit-slider-thumb]:scale-0 group-hover:[&::-webkit-slider-thumb]:scale-100
      [&::-webkit-slider-thumb]:transition-all [&::-moz-range-thumb]:w-3
      [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full
      [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:scale-0
      [&::-moz-range-thumb]:group-hover:scale-100 [&::-moz-range-thumb]:transition-all
      ${
        lang === "eng"
          ? "group-hover:bg-[linear-gradient(to_right,#1DB954_var(--progress),#535353_var(--progress))]"
          : "group-hover:bg-[linear-gradient(to_left,#1DB954_var(--progress),#535353_var(--progress))]"
      }
      ${
        lang === "eng"
          ? "bg-[linear-gradient(to_right,#fff_var(--progress),#535353_var(--progress))]"
          : "bg-[linear-gradient(to_left,#fff_var(--progress),#535353_var(--progress))]"
      }`}
                        style={{
                          "--progress": `${(currentTime / duration) * 100}%`,
                        }}
                        min={0}
                        max={duration}
                        value={currentTime}
                        onChange={handleSeek}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray font-bold ">
                    {formatTime(duration)}
                  </span>
                </div>

                <div className="top  text-white flex items-center gap-5 justify-center">
                  <button onClick={() => dispatch(toggleShuffle())}>
                    <PiShuffleFill
                      className={`size-6 cursor-pointer ${
                        shuffle ? "text-green" : "text-gray"
                      }`}
                    />
                  </button>
                  <button
                    disabled={history.length === 0 && currentTime > 3}
                    onClick={() => dispatch(previousTrack())}
                  >
                    <TbPlayerSkipBackFilled className="size-6 cursor-pointer text-gray-100" />
                  </button>
                  <button
                    onClick={handlePlayPause}
                    className="rounded-full  bg-white w-[70px] h-[70px] cursor-pointer flex items-center justify-center"
                  >
                    {isPlaying ? (
                      <TiMediaPause className="text-main-black size-10 " />
                    ) : (
                      <IoPlay className="text-main-black size-8 " />
                    )}
                  </button>
                  <button
                    disabled={queue.length === 0 && repeat === "none"}
                    onClick={() => dispatch(nextTrack())}
                  >
                    <TbPlayerSkipForwardFilled className="size-6 cursor-pointer text-gray-100" />
                  </button>
                  <button onClick={() => dispatch(setRepeat())}>
                    {repeat === "none" || repeat === "playlist" ? (
                      <LuRepeat2
                        className={`size-6 cursor-pointer  ${
                          repeat === "playlist"
                            ? "text-green"
                            : repeat === "none" && "text-gray"
                        }`}
                      />
                    ) : (
                      <LuRepeat1
                        className={`size-5 cursor-pointer text-green`}
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
            </div>

            
          </div>
        </>
      ) : (
        <div
          onClick={() => setIsPlayerShown(!isPlayerShown)}
          className="rounded-full w-[80px] h-[80px] cursor-pointer border-2 border-amber-900/20 flex items-center justify-center fixed bottom-9 right-6 sm:bottom-13 sm:right-13 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900"
        >
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-amber-900/30 to-amber-900/50" />

          <PiVinylRecordFill
            className={`size-11 text-amber-50/90 transition-all ${
              isPlaying ? "animate-[spin_2s_linear_infinite]" : "animate-pulse"
            }`}
            style={{
              animationPlayState: isPlaying ? "running" : "paused",
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
            }}
          />

          {/* Center label */}
          <div className="absolute w-6 h-6 rounded-full bg-amber-100/80 border border-amber-200/50 shadow-inner" />
        </div>
      )}
    </>
  );
};

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

export default Player;










// import { useState, useEffect, useRef, useCallback } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { 
//   BiPlay, 
//   BiPause, 
//   BiSkipNext, 
//   BiSkipPrevious,
//   BiVolumeFull,
//   BiVolumeMute,
//   BiShuffle,
//   BiRepeat,
//   BiDownload,
//   BiExpand,
//   BiCollapse
// } from 'react-icons/bi';
// import { RiSpeedLine } from 'react-icons/ri';

// const Player = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [volume, setVolume] = useState(1);
//   const [isMuted, setIsMuted] = useState(false);
//   const [playbackRate, setPlaybackRate] = useState(1);
//   const [isMinimized, setIsMinimized] = useState(false);
//   const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  
//   const audioRef = useRef(null);
//   const progressRef = useRef(null);
//   const speedMenuRef = useRef(null);
  
//   const { currentTrack, queue, isShuffled, repeatMode } = useSelector(state => state.player);
//   const lang = useSelector(state => state.lang);
//   const dispatch = useDispatch();

//   // Playback speed options
//   const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

//   // Keyboard shortcuts
//   useEffect(() => {
//     const handleKeyPress = (e) => {
//       if (e.target.tagName === 'INPUT') return;
      
//       switch (e.key) {
//         case ' ':
//           e.preventDefault();
//           togglePlayPause();
//           break;
//         case 'ArrowLeft':
//           e.preventDefault();
//           seekBackward();
//           break;
//         case 'ArrowRight':
//           e.preventDefault();
//           seekForward();
//           break;
//         case 'ArrowUp':
//           e.preventDefault();
//           adjustVolume(0.1);
//           break;
//         case 'ArrowDown':
//           e.preventDefault();
//           adjustVolume(-0.1);
//           break;
//         case 'm':
//         case 'M':
//           toggleMute();
//           break;
//       }
//     };

//     document.addEventListener('keydown', handleKeyPress);
//     return () => document.removeEventListener('keydown', handleKeyPress);
//   }, []);

//   // Audio event handlers
//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     const updateTime = () => setCurrentTime(audio.currentTime);
//     const updateDuration = () => setDuration(audio.duration);
//     const handleEnded = () => {
//       setIsPlaying(false);
//       // Handle next track logic here
//     };

//     audio.addEventListener('timeupdate', updateTime);
//     audio.addEventListener('loadedmetadata', updateDuration);
//     audio.addEventListener('ended', handleEnded);

//     return () => {
//       audio.removeEventListener('timeupdate', updateTime);
//       audio.removeEventListener('loadedmetadata', updateDuration);
//       audio.removeEventListener('ended', handleEnded);
//     };
//   }, [currentTrack]);

//   const togglePlayPause = useCallback(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     if (isPlaying) {
//       audio.pause();
//     } else {
//       audio.play();
//     }
//     setIsPlaying(!isPlaying);
//   }, [isPlaying]);

//   const seekBackward = () => {
//     const audio = audioRef.current;
//     if (audio) {
//       audio.currentTime = Math.max(0, audio.currentTime - 10);
//     }
//   };

//   const seekForward = () => {
//     const audio = audioRef.current;
//     if (audio) {
//       audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
//     }
//   };

//   const adjustVolume = (delta) => {
//     const newVolume = Math.max(0, Math.min(1, volume + delta));
//     setVolume(newVolume);
//     if (audioRef.current) {
//       audioRef.current.volume = newVolume;
//     }
//   };

//   const toggleMute = () => {
//     setIsMuted(!isMuted);
//     if (audioRef.current) {
//       audioRef.current.muted = !isMuted;
//     }
//   };

//   const handleProgressClick = (e) => {
//     const audio = audioRef.current;
//     const progressBar = progressRef.current;
//     if (!audio || !progressBar) return;

//     const rect = progressBar.getBoundingClientRect();
//     const clickX = e.clientX - rect.left;
//     const newTime = (clickX / rect.width) * duration;
//     audio.currentTime = newTime;
//   };

//   const changePlaybackSpeed = (speed) => {
//     setPlaybackRate(speed);
//     if (audioRef.current) {
//       audioRef.current.playbackRate = speed;
//     }
//     setShowSpeedMenu(false);
//   };

//   const formatTime = (time) => {
//     if (isNaN(time)) return '0:00';
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds.toString().padStart(2, '0')}`;
//   };

//   if (!currentTrack) return null;

//   return (
//     <>
//       <audio
//         ref={audioRef}
//         src={currentTrack.audioUrl}
//         onPlay={() => setIsPlaying(true)}
//         onPause={() => setIsPlaying(false)}
//       />
      
//       <div className={`fixed bottom-0 left-0 right-0 bg-second-black border-t border-gray/20 transition-all duration-300 z-40 ${
//         isMinimized ? 'h-16' : 'h-24'
//       }`}>
//         <div className="container mx-auto px-4 h-full flex items-center">
//           {/* Track Info */}
//           <div className="flex items-center gap-4 min-w-0 flex-1">
//             <div className="w-12 h-12 bg-search-dark rounded-lg flex items-center justify-center flex-shrink-0">
//               <BiPlay className="text-green text-xl" />
//             </div>
//             <div className="min-w-0 flex-1">
//               <h4 className="text-heading font-medium truncate">
//                 {currentTrack.title}
//               </h4>
//               <p className="text-gray text-sm truncate">
//                 {currentTrack.reciter}
//               </p>
//             </div>
//           </div>

//           {/* Controls */}
//           <div className="flex items-center gap-4 mx-8">
//             <button
//               onClick={() => {/* Previous track logic */}}
//               className="text-gray hover:text-heading transition-colors"
//               aria-label="Previous track"
//             >
//               <BiSkipPrevious className="text-2xl" />
//             </button>
            
//             <button
//               onClick={togglePlayPause}
//               className="w-10 h-10 bg-green rounded-full flex items-center justify-center hover:bg-green/90 transition-colors"
//               aria-label={isPlaying ? 'Pause' : 'Play'}
//             >
//               {isPlaying ? (
//                 <BiPause className="text-black text-xl" />
//               ) : (
//                 <BiPlay className="text-black text-xl ml-0.5" />
//               )}
//             </button>
            
//             <button
//               onClick={() => {/* Next track logic */}}
//               className="text-gray hover:text-heading transition-colors"
//               aria-label="Next track"
//             >
//               <BiSkipNext className="text-2xl" />
//             </button>
//           </div>

//           {/* Progress Bar */}
//           {!isMinimized && (
//             <div className="flex items-center gap-4 flex-1 max-w-md">
//               <span className="text-gray text-sm min-w-[40px]">
//                 {formatTime(currentTime)}
//               </span>
//               <div
//                 ref={progressRef}
//                 onClick={handleProgressClick}
//                 className="flex-1 h-1 bg-gray/30 rounded-full cursor-pointer group"
//               >
//                 <div
//                   className="h-full bg-green rounded-full relative group-hover:bg-green/80 transition-colors"
//                   style={{ width: `${(currentTime / duration) * 100}%` }}
//                 >
//                   <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-green rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
//                 </div>
//               </div>
//               <span className="text-gray text-sm min-w-[40px]">
//                 {formatTime(duration)}
//               </span>
//             </div>
//           )}

//           {/* Additional Controls */}
//           <div className="flex items-center gap-2 ml-4">
//             {/* Speed Control */}
//             <div className="relative" ref={speedMenuRef}>
//               <button
//                 onClick={() => setShowSpeedMenu(!showSpeedMenu)}
//                 className="text-gray hover:text-heading transition-colors p-2"
//                 aria-label="Playback speed"
//               >
//                 <RiSpeedLine className="text-xl" />
//                 <span className="text-xs absolute -bottom-1 left-1/2 transform -translate-x-1/2">
//                   {playbackRate}x
//                 </span>
//               </button>
              
//               {showSpeedMenu && (
//                 <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-search-dark border border-gray/20 rounded-lg shadow-xl py-2 min-w-[80px]">
//                   {speedOptions.map(speed => (
//                     <button
//                       key={speed}
//                       onClick={() => changePlaybackSpeed(speed)}
//                       className={`w-full px-4 py-2 text-sm hover:bg-hover-black transition-colors ${
//                         speed === playbackRate ? 'text-green' : 'text-gray'
//                       }`}
//                     >
//                       {speed}x
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Volume Control */}
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={toggleMute}
//                 className="text-gray hover:text-heading transition-colors"
//                 aria-label={isMuted ? 'Unmute' : 'Mute'}
//               >
//                 {isMuted || volume === 0 ? (
//                   <BiVolumeMute className="text-xl" />
//                 ) : (
//                   <BiVolumeFull className="text-xl" />
//                 )}
//               </button>
//               <input
//                 type="range"
//                 min="0"
//                 max="1"
//                 step="0.1"
//                 value={isMuted ? 0 : volume}
//                 onChange={(e) => {
//                   const newVolume = parseFloat(e.target.value);
//                   setVolume(newVolume);
//                   setIsMuted(newVolume === 0);
//                   if (audioRef.current) {
//                     audioRef.current.volume = newVolume;
//                     audioRef.current.muted = newVolume === 0;
//                   }
//                 }}
//                 className="w-20 h-1 bg-gray/30 rounded-full appearance-none cursor-pointer slider"
//               />
//             </div>

//             {/* Minimize/Expand */}
//             <button
//               onClick={() => setIsMinimized(!isMinimized)}
//               className="text-gray hover:text-heading transition-colors"
//               aria-label={isMinimized ? 'Expand player' : 'Minimize player'}
//             >
//               {isMinimized ? (
//                 <BiExpand className="text-xl" />
//               ) : (
//                 <BiCollapse className="text-xl" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Player;