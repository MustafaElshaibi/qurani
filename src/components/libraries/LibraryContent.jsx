// LibraryContent.tsx
import { useDispatch, useSelector } from 'react-redux';
import { deleteLibrary, removeFromLibrary, selectActiveLibrary, selectActiveLibraryItems } from '../../rtk/Reducers/LibraryReducer';
import SurahListItem from '../uncommen/SurahListItem';

const LibraryContent = () => {
  const activeLibrary = useSelector(selectActiveLibrary);
  const items = useSelector(selectActiveLibraryItems);

  const dispatch = useDispatch();

  console.log(items)

  return (
    <>
     <div className="main-content  p-5 bg-second-black min-h-screen w-full transition-all duration-300">
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <h1 className="text-2xl font-bold text-white flex-1 text-ellipsis overflow-hidden">{activeLibrary?.name}</h1>
      {activeLibrary?.type === 'user' && (
        <div className="flex items-center gap-3 ">
          <button
            onClick={() => dispatch(deleteLibrary(activeLibrary.id))}
            className="text-red-500 max-sm:text-xs hover:text-red-400"
          >
            Delete Library
          </button>
        </div>
      )}
    </div>
          {/* // In LibraryContent component */}
          {activeLibrary?.type === "system" && activeLibrary.id === "favorites" && (
            <div className="mb-6 bg-hover-black p-4 rounded-lg">
              <h2 className="text-white text-lg font-semibold">
                Your Favorite Songs
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                All your liked songs appear here automatically
              </p>
            </div>
          )}
          <div className="grid gap-4">
            {activeLibrary?.items?.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                {activeLibrary.id === "favorites"
                  ? "No favorite songs yet"
                  : "This library is empty"}
              </div>
            ) : (
              items?.map((item, index) => (
                <SurahListItem key={index} index={index + 1} surahData={item} audioQueue={items} onFavorite={true} />
              ))
            )}
          </div>
        </div>
    </>
  );
};

export default LibraryContent;






// <div
//                 key={item.id}
//                 onMouseEnter={() => setIsHovered(true)}
//                 onMouseLeave={() => setIsHovered(false)}
//                       className="surah flex items-center justify-between gap-5 px-5 max-sm:px-2 py-2 transition-colors duration-300 hover:bg-hover-black rounded-lg"
//                     >
//                       <div className="flex items-center flex-1 transition-all duration-300 ">
//                         <div className="relative w-8 h-8 flex items-center justify-center">
                        
//                           <button
//                             className="relative z-10 flex items-center justify-center cursor-pointer"
//                           >
//                          {isHovered || ((currentSurah?.id === item?.id && item?.reciter?.id === currentSurah?.reciter?.id) && !isPlaying) ? (
//                                       (currentSurah?.id === item?.id && item?.reciter?.id === currentSurah?.reciter?.id) && isPlaying ? (
//                                         <FaPause className="text-green size-4" />
//                                       ) : (
//                                         <FaPlay
//                                           className={`${(currentSurah?.id === item?.id && item?.reciter?.id === currentSurah?.reciter?.id) ? "text-green" : "text-gray"} size-4`}
//                                         />
//                                       )
//                                     ) : (currentSurah?.id === item?.id && item?.reciter?.id === currentSurah?.reciter?.id) && isPlaying ? (
//                                       <FaPause className="text-green size-4" />
//                                     ) : (
//                                       <span className="text-gray font-bold text-lg">{index + 1}</span>
//                                     )}
                            
//                           </button>
//                         </div>
                
//                         <div className="flex items-center ml-4">
//                           <div className="w-[60px] h-[60px] mr-4 rounded-lg bg-gray-800 overflow-hidden">
//                             {/* Replace with actual image */}
//                             <div className="w-full h-full bg-gray-700 animate-pulse" />
//                           </div>
//                           <div
//                             className={`text-ellipsis overflow-hidden text-xl ${
//                               isCurrent ? "text-green" : "text-pink-500"
//                             }`}
//                           >
//                             {item?.name || "......."}
//                           <span className='text-gray text-xs block'>{item?.reciter.name}</span>
//                           </div>
//                         </div>
                       
//                       </div>
//                       <HeartFavorite song={item} />
//                       <div className="text-gray w-[50px] flex items-center justify-center max-sm:hidden">
                     
//                         {item?.makkia ? (
//                           <LiaKaabaSolid className="size-6" />
//                         ) : (
//                           <FaMosque className="size-4" />
//                         )}
//                       </div>
                
//                       <div className="text-gray font-bold">
//                         {item?.duration ? formatTime(item?.duration) :   "--:--"}
//                       </div>
//                     </div>