import { createSelector } from "@reduxjs/toolkit";
import { memo, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToLibrary, removeFromLibrary } from "../../rtk/Reducers/LibraryReducer";
import { MdFormatListBulletedAdd, MdOutlinePlaylistRemove } from "react-icons/md";
import { BsBookmarkFill, BsBookmarkXFill } from "react-icons/bs";

// Memoized selector outside the component
const makeIsInPlaylistSelector = (libraryId, surahId) => 
  createSelector(
    [state => state.libraries.libraries],
    (libraries) => {
      const lib = libraries.find(l => l.id === libraryId);
      return lib?.items.some(item => item.id === surahId) || false;
    }
  );

const LibraryItem = memo(({ library, surahId, onAdd }) => {
  const selector = useMemo(
    () => makeIsInPlaylistSelector(library.id, surahId),
    [library.id, surahId]
  );
  
  const isInPlaylist = useSelector(selector);

  return (
    <li 
      onClick={() => onAdd(library, isInPlaylist)}
      className="not-last:border-b-1 flex items-center justify-between gap-4 not-last:border-b-gray py-2 px-3 hover:bg-gray/20 transition-colors cursor-pointer"
    >
      {library.name}
      <span>
        {isInPlaylist ? (
          <BsBookmarkXFill />
        ) : (
          <BsBookmarkFill />
        )}
      </span>
    </li>
  );
});

const LibraryAvailable = memo(({ surahData, onClick }) => {
  const dispatch = useDispatch();
  const libraries = useSelector(state => state.libraries.libraries);
  const libs = libraries.filter(lib => lib.type === "user");
  const handleAddToLibrary = useCallback((library, isInPlaylist) => {
    if(isInPlaylist){
      dispatch(removeFromLibrary({
        libraryId: library.id,
        songId: surahData.id,
      }))
    } else {
      dispatch(addToLibrary({
        libraryId: library.id,
        song: surahData,
      }));
    }
    onClick();
  }, [dispatch, surahData]);

  return (
    <ul className="absolute w-fit px-3 py-2 rounded-lg bottom-5 right-3 bg-search-dark text-white">
      {libs.map(library => (
        <LibraryItem 
          key={library.id}
          library={library}
          surahId={surahData.id}
          onAdd={handleAddToLibrary}
        />
      ))}
    </ul>
  );
});


export default LibraryAvailable;