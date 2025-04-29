import img from "../../assets/images/image.jpg";
import { BiHeart } from "react-icons/bi";
import { SlShuffle } from "react-icons/sl";
import {
  PiPause,
  PiPlay,
  PiShuffleFill,
  PiSpeakerHighBold,
  PiSpeakerHighFill,
  PiSpeakerSimpleHighThin,
  PiSpeakerSlashFill,
} from "react-icons/pi";
import { ImNext2, ImPrevious2 } from "react-icons/im";
import { RiRepeat2Fill } from "react-icons/ri";
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
import { FaMosque, FaPause, FaPlay } from "react-icons/fa";
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
import { SiYoutubemusic } from "react-icons/si";
const cookies = new Cookies();





const Player = () => {
  const [showFull, setShowFull] = useState(false);
  const [mute, setMute] = useState(false);
  const token = cookies.get("auth-token");
  // Add a ref to store previous volume
  const previousVolumeRef = useRef(1); // Default to max volume
  const dispatch = useDispatch();
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
  const lang = useSelector((state)=> state.lang);


  // Initialize audio service
  useEffect(() => {
    audioService.initialize(store);
  }, []);



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
    setCurrentTime(time);
    audioService.seekTo(time);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    dispatch(setVolume(newVolume));
    audioService.setVolume(newVolume);
  };

  if (!currentSurah) return null;
  if(!token) return null;

  return (
    
   <>
   {
    isPlayerShown ? 
    (
      <>
      {/* on large screens */}
      <div className="player flex items-center bg-search-dark h-[110px] fixed bottom-0 left-0 w-full px-14 py-5 gap-14 z-40 max-sm:flex-col max-sm:hidden">
        <IoIosArrowDown onClick={()=> setIsPlayerShown(!isPlayerShown)}  className="size-5 text-white absolute right-4 cursor-pointer top-2 z-10" />
        <div className="surah-info flex items-center gap-4 max-sm:hidden ">
          <div className="img w-[90px] h-[90px] overflow-hidden rounded-lg  ">
            {currentSurah?.imgUrl ? (<img src={currentSurah?.imgUrl} alt="" className="max-w-full" /> ): (
              <div className="max-w-full h-full bg-gray animate-pulse"></div>
            )}
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
            <HeartFavorite song={currentSurah} />
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
                <TbPlayerSkipBackFilled className="size-5 cursor-pointer text-gray-100" />
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
                <TbPlayerSkipForwardFilled className="size-5 cursor-pointer text-gray-100" />
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
                  <LuRepeat1 className={`size-5 cursor-pointer text-green`} />
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
      
       ${lang === 'eng' ? 'group-hover:bg-[linear-gradient(to_right,#1DB954_var(--progress),#535353_var(--progress))]': 'group-hover:bg-[linear-gradient(to_left,#1DB954_var(--progress),#535353_var(--progress))]'}
       ${lang === 'eng' ? 'bg-[linear-gradient(to_right,#fff_var(--progress),#535353_var(--progress))]': 'bg-[linear-gradient(to_left,#fff_var(--progress),#535353_var(--progress))]'}`}
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
      ${lang === 'eng' ? 'group-hover:bg-[linear-gradient(to_right,#1DB954_var(--progress),#535353_var(--progress))]' : 'group-hover:bg-[linear-gradient(to_left,#1DB954_var(--progress),#535353_var(--progress))]'}
     ${lang === 'eng' ? ' bg-[linear-gradient(to_right,#fff_var(--progress),#535353_var(--progress))]' : ' bg-[linear-gradient(to_left,#fff_var(--progress),#535353_var(--progress))]'}`}
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
          showFull ? "h-screen flex-col justify-between" : 'h-[80px]'
        }`}
      >
        
        {/* mini show  */}
       <div className={`minishow relative w-full h-full ${showFull ? 'hidden' : 'block'}`}>
       <div className={`flex items-center gap-3 px-4 mt-1 w-full ${showFull ? 'hidden' : 'flex'}`}>
          <div onClick={()=> setShowFull(!showFull)} className={`one cursor-pointer  items-center gap-3  grow flex`}>
          {
            currentSurah?.imgUrl ?
            (
              <img src={currentSurah?.imgUrl} alt="" className="w-[60px]  rounded-lg h-[60px] "/>
            )
            : (
              <div className="text-gray w-[60px] bg-main-black rounded-lg h-[60px] animate-pulse flex items-center justify-center">
            {currentSurah?.makkia ? (
              <LiaKaabaSolid className="size-7" />
            ) : (
              <FaMosque className="size-7" />
            )}
          </div>
            )
          }
          <div className="block overflow-hidden">
            <div className="surah-title text-heading text-lg flex items-center justify-center ">
              {currentSurah?.name}
            <IoIosArrowDown onClick={()=> setIsPlayerShown(!isPlayerShown)}  className="size-5 text-white ml-2 cursor-pointer  z-10" />
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
        <div className={`down absolute left-0 bottom-0 w-full ${showFull ? 'hidden' : 'block'}  `}>
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
      ${lang === 'eng' ? 'group-hover:bg-[linear-gradient(to_right,#1DB954_var(--progress),#535353_var(--progress))]' : 'group-hover:bg-[linear-gradient(to_left,#1DB954_var(--progress),#535353_var(--progress))]'}
      ${lang === 'eng' ? 'bg-[linear-gradient(to_right,#fff_var(--progress),#535353_var(--progress))]' : 'bg-[linear-gradient(to_left,#fff_var(--progress),#535353_var(--progress))]'}`}
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

        <div
          className={`surah-info grow w-full p-5 transition-all duration-500 flex flex-col items-center gap-4 ${
            showFull ? "block" : "max-sm:hidden"
          }` }
        >
         
         <div className="flex items-center justify-between w-full my-2">
          <IoIosArrowDown onClick={()=> setShowFull(!showFull)} className="text-white cursor-pointer size-6 " />
          <GoKebabHorizontal className="text-white cursor-pointer size-6 " />
         </div>
              <div className="text-gray w-full h-[400px] bg-main-black rounded-lg  animate-pulse flex items-center justify-center">
            {currentSurah?.makkia ? (
              <LiaKaabaSolid className="size-18" />
            ) : (
              <FaMosque className="size-18" />
            )}
          </div>
          <div className={`info flex items-center justify-between mt-2 w-full`}>
            <div className="block overflow-hidden">
              <div className="surah-title text-heading text-lg">
                {currentSurah?.name}
              </div>
              <div className="reciter-name text-gray text-xs ">
                {currentSurah?.reciter?.name}
              </div>
            </div>
            <HeartFavorite song={currentSurah}/>
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
      ${lang === 'eng' ? 'group-hover:bg-[linear-gradient(to_right,#1DB954_var(--progress),#535353_var(--progress))]' : 'group-hover:bg-[linear-gradient(to_left,#1DB954_var(--progress),#535353_var(--progress))]'}
      ${lang === 'eng' ? 'bg-[linear-gradient(to_right,#fff_var(--progress),#535353_var(--progress))]' : 'bg-[linear-gradient(to_left,#fff_var(--progress),#535353_var(--progress))]'}`}
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
                  <LuRepeat1 className={`size-5 cursor-pointer text-green`} />
                )}
              </button>
            </div>
           
          </div>
        </div>
      </div>
    </>
    )
    :
    (
      <div onClick={()=> setIsPlayerShown(!isPlayerShown)} className="rounded-full  w-[80px] h-[80px] bg-gradient-to-l from-cyan-500 to-green cursor-pointer border-1 border-gray flex items-center justify-center  fixed bottom-9 right-6 sm:bottom-13 sm:right-13 ">
        <SiYoutubemusic className={`size-11 ${isPlaying && 'animate-spin'}  text-white`} />
      </div>
    )
   }
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
