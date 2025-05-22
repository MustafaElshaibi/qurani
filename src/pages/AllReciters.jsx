import {  useEffect,  useState } from "react";
import { useGetAllRecitersQuery } from "../rtk/Services/QuranApi";
import { RoundedCard } from "../components/uncommen/RoundedCard";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../rtk/Reducers/langSlice";
import PageLoader from "../components/uncommen/PageLoader";
import { requestManager } from "../utility/requestManager";



const AllReciters = () => {
  const lang = useSelector((state)=> state.lang);
  const { data, loading, error, refetch, isFetching } = useGetAllRecitersQuery(lang);
  const loader = loading || !data;
  const [reciters, setReciters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(20);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentReciters = reciters.slice(indexOfFirstPost, indexOfLastPost);
  const dispatch = useDispatch();


   // Handle cross-tab synchronization
    useEffect(() => {
      const handleStorageChange = (e) => {
        if (e.key === 'lang') {
          dispatch(setLanguage(e.newValue || 'eng'));
        }
      };
  
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }, [dispatch]);

  const PostReciters = ({reciters})=> {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-6">
            {reciters.map((reciter, i) => (
              <RoundedCard 
                key={reciter?.id || i} 
                reciter={reciter} 
                loading={loader}
                requestManager={requestManager}
              />
            ))}
          </div>
    )
  }




  useEffect(() => {
    try {
      if (data?.reciters) {
        // Create a new array to avoid mutating the original data
        const initialReciters = [...data.reciters];
        initialReciters.sort((a, b) =>
          a.name?.toLowerCase().localeCompare(b.name?.toLowerCase())
        );
        setReciters(initialReciters);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }, [data]);




  if (error) {
    return (
      <div className="w-full bg-[#121212] flex items-center justify-center rounded-lg p-6 space-y-8 min-h-screen">
       <div className="cont">
       <button 
          onClick={()=> refetch()} 
          className="px-7 py-3 rounded-full mx-auto  bg-white text-black cursor-pointer block w-fit font-bold"
        >
          Retry
        </button>
        {error  && <p className="text-white mt-2 ">Trying to reconnect...</p>}
        {isFetching && <PageLoader />}
       </div>
      </div>
    );
  }


  return (
    <div className="w-full bg-[#121212] rounded-lg  space-y-8 min-h-screen">
      {
        loader ? 
        (
          <>
                {/* Header Section */}
      <section className="space-y-6 p-3 sm:p-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-800 rounded w-48"></div>
          <div className="h-6 bg-gray-800 rounded w-20"></div>
        </div>
        
        {/* Reciters Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="space-y-3">
              {/* Image placeholder */}
              <div className="aspect-square w-full bg-gray-800 rounded-full"></div>
              {/* Text placeholders */}
              <div className="h-4 bg-gray-800 rounded w-3/4 mx-auto"></div>
              <div className="h-3 bg-gray-800 rounded w-1/2 mx-auto"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Pagination Skeleton */}
      <div className="border-t border-gray-200 w-full bg-second-black px-4 py-3 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div className="h-4 bg-gray-800 rounded w-48"></div>
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-gray-800 rounded"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 w-8 bg-gray-800 rounded"></div>
            ))}
            <div className="h-8 w-8 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>

          </>
        )
        :
        (
          <>
                <section className="space-y-6 p-3 sm:p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
            {lang === 'eng' ? 'All Reciters' : 'كل القراء'}
          </h2>
        </div>
        {
          <PostReciters reciters={currentReciters} />
        }
      </section>
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPosts={reciters.length} postsPerPage={postsPerPage} />
          </>
        )
      }

    </div>
  );
};









export default AllReciters;







const Pagination = ({ currentPage, setCurrentPage, postsPerPage, totalPosts }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber, e) => {
    e.preventDefault();
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getPageRange = () => {
    if (totalPages <= 6) {
      return pageNumbers;
    }
    
    if (currentPage <= 3) {
      return [...pageNumbers.slice(0, 4), '...', ...pageNumbers.slice(-2)];
    }
    
    if (currentPage >= totalPages - 2) {
      return [...pageNumbers.slice(0, 2), '...', ...pageNumbers.slice(-4)];
    }
    
    return [
      ...pageNumbers.slice(0, 1),
      '...',
      ...pageNumbers.slice(currentPage - 2, currentPage + 1),
      '...',
      ...pageNumbers.slice(-1)
    ];
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const adjustedIndexOfLastPost = Math.min(indexOfLastPost, totalPosts);

  return (
    <div className="flex items-center justify-between border-t border-gray-200 w-full bg-second-black px-4 py-3 sm:px-6">
      {/* Mobile view */}
      <div className="flex flex-1 justify-between sm:hidden w-full">
        <a
          href="#"
          onClick={(e) => paginate(currentPage - 1, e)}
          className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${
            currentPage === 1 
              ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Previous
        </a>
        <a
          href="#"
          onClick={(e) => paginate(currentPage + 1, e)}
          className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${
            currentPage === totalPages 
              ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Next
        </a>
      </div>

      {/* Desktop view */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between text-white">
        <div>
          <p className="text-sm text-white">
            Showing <span className="font-medium">{indexOfFirstPost + 1}</span> to{' '}
            <span className="font-medium">{adjustedIndexOfLastPost}</span> of{' '}
            <span className="font-medium">{totalPosts}</span> results
          </p>
        </div>
        <div>
          <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-xs bg-search-dark">
            <a
              href="#"
              onClick={(e) => paginate(currentPage - 1, e)}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                currentPage === 1 
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                  : 'text-white hover:bg-gray-50 hover:text-black'
              }`}
            >
              <span className="sr-only">Previous</span>
              <GrFormPrevious className="h-5 w-5" aria-hidden="true" />
            </a>

            {getPageRange().map((item, index) => (
              typeof item === 'number' ? (
                <a
                  key={index}
                  onClick={(e) => paginate(item, e)}
                  aria-current={currentPage === item ? "page" : undefined}
                  className={`relative transition-colors cursor-pointer duration-75 inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 ${
                    currentPage === item
                      ? 'bg-cyan-500 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500'
                      : 'text-white ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  {item}
                </a>
              ) : (
                <span key={index} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-50 ring-1 ring-inset ring-gray-300">
                  {item}
                </span>
              )
            ))}

            <a
              href="#"
              onClick={(e) => paginate(currentPage + 1, e)}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                currentPage === totalPages 
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                  : 'text-white hover:bg-gray-50 hover:text-black'
              }`}
            >
              <span className="sr-only">Next</span>
              <GrFormNext className="h-5 w-5" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};