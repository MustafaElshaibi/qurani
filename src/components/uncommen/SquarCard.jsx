

import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
  const  SquarCard = ({isLoading, isFetching, surah }) => {
    const lang = useSelector((state) => state.lang);
  const [isHovered, setIsHovered] = useState(false);


  return (
    <Link
    to={`/surah/${surah?.id}`} 
      className={`group p-4  rounded-md hover:bg-hover-black transition-all duration-200 cursor-pointer ${isLoading && 'pointer-events-none'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      { isFetching || isLoading ? (
    /* Skeleton Loading State */
    <>
      <div className="relative mb-4 shadow-lg animate-pulse">
        <div className="relative pb-[100%] rounded-md overflow-hidden bg-gray-700">
          <div className="absolute inset-0 bg-gray-600 opacity-20" />
        </div>
      </div>

      <div className="min-h-[62px] space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse" />
      </div>
    </>
  ) : (
    /* Actual Content */
    <>
      <div className="relative mb-4 shadow-lg" >
        <div  className="relative pb-[100%] bg-gradient-to-b from-search-dark to-cyan-400/30  rounded-md overflow-hidden">
          <div
            className={`absolute inset-0 w-full h-full flex items-center justify-center text-2xl p-5 text-white  font-extrabold  ${
              isHovered ? "scale-105" : "scale-100"
            } transition-transform duration-200`}
          >
            {surah?.name}
          </div>
          
        </div>
      </div>

      <div className="min-h-[62px]">
        <h3 className="text-white font-bold font-qurani truncate mb-1">{surah?.name || '.......'}</h3>
        <p className="text-sm overflow-hidden text-[#b3b3b3] text-ellipsis text-nowrap"> {surah?.makkia ? (lang === 'ar' ? 'سورة مكية' : 'a Makkah chapter'): (lang === 'ar' ? 'سورة مدنية' : 'a Medinite chapter')} </p>
      </div>
    </>
  )}
    </Link>
  );
};

export default memo(SquarCard);