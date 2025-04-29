import { useState, useEffect } from 'react';

const QuranReader = ({ data }) => {
  const [pages, setPages] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    // Extract and sort unique pages
    const uniquePages = data
      .filter(item => item.page)
      .map(item => item.page)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => {
        const numA = parseInt(a.split('/').pop().replace('.svg', ''));
        const numB = parseInt(b.split('/').pop().replace('.svg', ''));
        return numA - numB;
      });
    
    setPages(uniquePages);
  }, [data]);

  const handlePrevious = () => {
    setCurrentPageIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPageIndex(prev => Math.min(pages.length - 1, prev + 1));
  };

  if (!pages.length) return <div>Loading...</div>;

  return (
    <div className="min-h-screen sm:mx-14 bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        {/* Navigation Controls */}
        <div className="flex justify-between items-center p-4 bg-gray-100 rounded-t-lg">
          <button
            onClick={handlePrevious}
            disabled={currentPageIndex === 0}
            className={`px-4 py-2 rounded-md ${
              currentPageIndex === 0 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Previous
          </button>
          
          <span className="text-gray-700 font-medium">
            Page {currentPageIndex + 1} of {pages.length}
          </span>
          
          <button
            onClick={handleNext}
            disabled={currentPageIndex === pages.length - 1}
            className={`px-4 py-2 rounded-md ${
              currentPageIndex === pages.length - 1 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Next
          </button>
        </div>

        {/* Quran Page Image */}
        <div className="p-4 flex justify-center items-center min-h-[80vh]">
          <img 
            src={pages[currentPageIndex]} 
            alt={`Quran Page ${currentPageIndex + 1}`}
            className="max-w-full h-auto shadow-inner border rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default QuranReader;