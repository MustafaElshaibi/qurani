import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useGetAllRecitersQuery, useGetAllSurahDetailsQuery } from "../../rtk/Services/QuranApi";
import { useLocation } from "react-router-dom";

const SearchInput = ({ onSearch, className, refSe, setSearch, mobile, onFocus }) => {
  const [query, setQuery] = useState("");
  const { data: AllRecitersEng } = useGetAllRecitersQuery("eng");
  const { data: AllRecitersAr } = useGetAllRecitersQuery("ar");
  const { data: AllSurahAr } = useGetAllSurahDetailsQuery("ar");
  const { data: AllSurahEng } = useGetAllSurahDetailsQuery("eng");
  const [data, setData] = useState([]);
  const [filterdData, setFilterdData] = useState([]);
  const timeoutRef = useRef(null);
  const blurTimeout = useRef(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const loacation = useLocation();

  useEffect(()=> {
    console.log(location.pathname.includes("/search"))
    if (!loacation.pathname.includes("/search") && !location.pathname.includes("/surah")) {
      setQuery("");
    }
  }, [loacation.pathname])

  useEffect(()=> {
    onFocus(isInputFocused);
  }, [isInputFocused, onFocus])

  // Handle input focus
  const handleFocus = () => {
    clearTimeout(blurTimeout.current);
    setIsInputFocused(true);
  };

  // Handle input blur with slight delay to allow click on list items
  const handleBlur = () => {
    blurTimeout.current = setTimeout(() => {
      setIsInputFocused(false);
    }, 200);
  };

  // Handle item selection
  const handleItemClick = (item) => {
    onSearch(item);
    setIsInputFocused(false);
    refSe.current.blur()
    setQuery(item.name)
  };

  // Cleanup timeout
  useEffect(() => {
    return () => clearTimeout(blurTimeout.current);
  }, []);

  // Fetch and merge data on mount or when API data changes
  useEffect(() => {
    try {
      let mergedData = [];
      if (AllRecitersAr?.reciters) mergedData = mergedData.concat(AllRecitersAr.reciters);
      if (AllRecitersEng?.reciters) mergedData = mergedData.concat(AllRecitersEng.reciters);
      if (AllSurahAr?.suwar) mergedData = mergedData.concat(AllSurahAr.suwar);
      if (AllSurahEng?.suwar) mergedData = mergedData.concat(AllSurahEng.suwar);

      // Remove duplicates by id (if exists)
      const uniqueData = Array.from(
        new Map(mergedData.map(item => [item.name, item])).values()
      );

      setData(uniqueData);
      setFilterdData(uniqueData);
    } catch (error) {
      console.error(error);
      setData([]);
      setFilterdData([]);
    }
  }, [AllRecitersEng, AllRecitersAr, AllSurahAr, AllSurahEng]);

  // filter the data on user query change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!query.trim()) {
        setFilterdData(data); // Show all data when search is empty
        return;
      }

      const lowercasedSearch = query.toLowerCase();
      const filtered = data.filter((item) =>
        // Customize this based on your data structure
        item.name.toLowerCase().includes(lowercasedSearch)
      );
      setFilterdData(filtered);
    }, 300); // Debounce for 300ms
    return () => clearTimeout(delayDebounce);
  }, [data, query]);

  ///send the data when the user press enter
  const handleSubmit = (e) => {
    e.preventDefault();
    if (filterdData.length > 0) onSearch(filterdData?.[0]);
    else onSearch(null);
  };

  // Action to perform after user stops typing
  const handleUserStoppedTyping = useCallback(() => {
    if (filterdData.length > 0 && query.length > 3) onSearch(filterdData?.[0]);
    else onSearch(null);
  }, [filterdData, query, onSearch]);

  // Debounce effect
  useEffect(() => {
    // if (query.trim() === '') return;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      if(mobile) return;
      handleUserStoppedTyping();
    }, 300);

    // Cleanup on unmount or value change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, handleUserStoppedTyping, mobile]);



  return (
    <form onSubmit={(e) => handleSubmit(e)} className={`relative ${className}`}>
      <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray text-xl" />
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSearch(e.target.value);
        }}
        placeholder="What do you want to play?"
        className="w-full  pl-12 pr-4 py-3 bg-search-dark rounded-full text-gray placeholder-gray/80 focus:outline-none focus:ring-2 focus:ring-heading/50"
        ref={refSe}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      { isInputFocused && query && (
        <div
          className={`list-filterd absolute top-14 z-50 left-4 bg-search-dark rounded-lg p-2 w-[400px] sm:w-[400px] md:w-[500px] lg:w-[600px] min-h-6 max-h-[calc(100vh-100px)] overflow-y-auto [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:bg-gray-300
  [&::-webkit-scrollbar-thumb]:bg-blue-500
  [&::-webkit-scrollbar-thumb]:rounded-full `}
        >
          <ul className="list flex flex-col ">
            {filterdData.length === 0 && (
              <div
                className={`skeletone py-2 w-full rounded-lg bg-gray-500/80  ${
                  filterdData.length == 0 ? "animate-pulse" : ""
                }`}
              ></div>
            )}
            {filterdData.map((item, index) => (
              <li
                onMouseDown={(e) => e.preventDefault()}
                key={`${index}${item.id}`}
                onClick={() => handleItemClick(item)}
                className="w-full text-white flex items-center gap-3 text-lg not-last:border-b-1 not-last:border-gray-300  py-3.5 cursor-pointer font-medium hover:bg-gray/20 px-4  "
              >
                <div>{index + 1 }</div>
                <div className="capitalize">{item?.name}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default memo(SearchInput);
