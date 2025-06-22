import { useDispatch, useSelector } from "react-redux";
import { selectIsFavorite, toggleFavorite } from "../../rtk/Reducers/LibraryReducer";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { memo } from "react";

const HeartFavorite = ({ song, className }) => {
  console.log(song)
  const isFavorite = useSelector(state => selectIsFavorite(state, song.id));
  const dispatch = useDispatch();

  return (
    <button 
      onClick={() => dispatch(toggleFavorite(song))}
      className={`${isFavorite ? 'text-red-500' : 'text-gray-400'} hidden sm:block ${className}`}
    >
      {
        isFavorite ? <FaHeart className="text-pink-600 size-5" /> : <FaRegHeart className="text-white size-5" />
      }
    </button>
  );
};

export default memo(HeartFavorite);