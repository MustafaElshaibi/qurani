// RoundedCard.tsx
import { memo, useEffect, useState } from "react";
import avatar from '../../assets/images/avtr.png';
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LazyLoadImage} from 'react-lazy-load-image-component';
 import 'react-lazy-load-image-component/src/effects/blur.css';

export const RoundedCard = memo(({reciter, loading,  requestManager }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [img, setImg] = useState(avatar);
  const [isLoading, setIsLoading] = useState(true);
      const dispatch = useDispatch();




  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchImage = async () => {
      if (!reciter?.name || img !== avatar) return;

      try {
        const reciterObj = await requestManager.getReciterInfo(
          reciter.id,
          reciter.name,
          { signal: controller.signal }
        );
        if (isMounted && reciterObj?.img) {
          setImg(reciterObj.img);
        }
      } catch (error) {
        if (isMounted) setImg(avatar);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [reciter?.id, requestManager, dispatch]);

  

  return (
    <Link
    to={`/reciter?q=${reciter?.id}`} 
      className={`group p-4  rounded-lg hover:bg-hover-black  transition-all duration-200 cursor-pointer ${loading && 'pointer-events-none'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {
        loading ?
        (
          <>
          <div className="relative  mb-4 shadow-lg animate-pulse">
        <div className="relative pb-[100%] rounded-full overflow-hidden bg-gray-700 ">
        <div className="absolute inset-0 bg-gray-600 opacity-20" />
        </div>
      </div>

      <div className="min-h-[62px] space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-700 animate-pulse"></div>
        <div className="h-3 w-1/2 rounded bg-gray-700 animate-pulse"></div>
      </div>
          </>
        )
        :
        (
          <>
          <div className="relative mb-4 shadow-lg">
        <div className="relative pb-[100%] rounded-full overflow-hidden ">
           {isLoading && (
              <div className="absolute inset-0 bg-gray-700 animate-pulse" />
            )}
            <img
              src={img}
              loading="lazy"
              alt={reciter?.name}
              className={`absolute inset-0 w-full h-full object-cover ${
                isHovered ? "scale-105" : "scale-100"
              } transition-transform duration-200 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setIsLoading(false)}
              onError={() => setImg(avatar)}
            />
          <div className={`absolute inset-0  bg-gradient-to-b from-transparent to-black/40 ${
            isHovered ? "opacity-100" : "opacity-0"
          } transition-opacity`} />
          
        </div>
          <button className={`absolute cursor-pointer bottom-2 right-2 w-10 h-10 z-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-105`}>
            <span className="text-2xl">▶</span>
          </button>
      </div>

      <div className="min-h-[62px]">
        <h3 className="text-heading font-bold truncate mb-1">{reciter?.name}</h3>
        <p className="text-sm text-gray truncate">Quran Reciter</p>
      </div>
          </>
        )
      }
    </Link>
  );
});


