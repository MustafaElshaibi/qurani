const createRequestManager = () => {
  // Initialize cache from localStorage
  let cache = new Map();
  const cachedData = localStorage.getItem('reciterImageCache');
  if (cachedData) {
    try {
      cache = new Map(JSON.parse(cachedData));
    } catch (e) {
      console.error('Error loading cache from localStorage:', e);
    }
  }
  const queue = [];
  let isProcessing = false;
  const API_KEY = import.meta.env.VITE_NEXT_GOOGLE_SEARCH_API_KEY;
  const CX = "2495ccf136d074c04";
  const RATE_LIMIT = 1500; // Slightly longer delay for better rate limiting

   // Helper to persist cache
   const persistCache = () => {
    try {
      const serialized = JSON.stringify(Array.from(cache.entries()));
      localStorage.setItem('reciterImageCache', serialized);
    } catch (e) {
      console.error('Error persisting cache:', e);
    }
  };

  const processQueue = async () => {
    if (isProcessing || queue.length === 0) return;
    isProcessing = true;

    const { reciterName, reciterId, resolve, reject } = queue.shift();

    try {
      if (cache.has(reciterId)) {
        resolve(cache.get(reciterId));
        return;
      }

      const url = new URL("https://www.googleapis.com/customsearch/v1");
      url.searchParams.append("q", `${reciterName} -women`);
      url.searchParams.append("cx", CX);
      url.searchParams.append("key", API_KEY);
      url.searchParams.append("searchType", "image");
      // url.searchParams.append("imgSize", "xxlarge"); // Higher quality images
      url.searchParams.append("imgType", "face"); // Focus on face images
      url.searchParams.append("num", 10); // Get 3 results to find best match
      url.searchParams.append("safe", "active"); // Safe search
      url.searchParams.append("fileType", "jpg|png");

      const response = await fetch(url);
      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();
      // Find first square-shaped face image
      const validImage = data.items?.find((item) => {
        const img = item.image;
        return (
          item.link &&
          img?.width >= 400 &&
          img?.height >= 400 &&
          Math.abs(img.width - img.height) <= 100 && // Allow slight rectangle
          item.link.match(/\.(jpe?g|png)$/i) 
        );
      });

      const imageUrl = validImage?.link || null;
      cache.set(reciterId, imageUrl);
      persistCache();
      resolve(imageUrl);
    } catch (error) {
      console.error("Image search error:", error);
      reject(error);
      cache.set(reciterId, null);
      persistCache();
    } finally {
      setTimeout(() => {
        isProcessing = false;
        processQueue();
      }, RATE_LIMIT);
    }
  };

  return {
    getImage: (reciterId, reciterName) =>
      new Promise((resolve, reject) => {
        // Clean up reciter name for better search
        const cleanedName = reciterName
          .replace(/sheikh|imam|dr\.?/gi, "")
          .trim();

        // Check cache first
        if (cache.has(reciterId)) {
          resolve(cache.get(reciterId));
          return;
        }

        queue.push({ reciterId: reciterId, reciterName: cleanedName, resolve, reject });
        processQueue();
      }),
    cache,
    clearCache: () => {
      cache.clear();
      localStorage.removeItem('reciterImageCache');
    }
  };
};






export const requestManager = createRequestManager();