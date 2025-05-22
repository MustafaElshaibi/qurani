
// const createRequestManager = () => {
//   const queue = [];
//   let isProcessing = false;
//   const API_KEY = import.meta.env.VITE_NEXT_GOOGLE_SEARCH_API_KEY;
//   const WIKI_API = import.meta.env.VITE_WIKIPEDIA_API_KEY; // Add to your env
//   const CX = "2495ccf136d074c04";
//   const RATE_LIMIT = 2000;

//   // Default reciter template
//   const defaultReciterData = (name) => ({
//     name: name || "Unknown Reciter",
//     description: null,
//     age: null,
//     country: null,
//     img: null,
//     views: 0,
//     libraries: [],
//     timestamp: new Date().toISOString(),
//   });

//   const ensureReciterExists = async (reciterId, reciterName) => {
//     const docRef = doc(firestore, "reciters", String(reciterId));
//     const docSnap = await getDoc(docRef);

//     if (!docSnap.exists()) {
//       await setDoc(docRef, defaultReciterData(reciterName));
//       return false;
//     }
//     return true;
//   };

//   const extractCountryFromContent = (content) => {
//     const countries = [
//       "Egypt",
//       "Saudi Arabia",
//       "Syria",
//       "Morocco",
//       "Yemen",
//       "Kuwait",
//       "Algeria",
//       "Iraq",
//       "Sudan",
//       "Palestine",
//     ];
//     return (
//       countries.find((country) =>
//         content?.toLowerCase().includes(country.toLowerCase())
//       ) || null
//     );
//   };

//   const extractAgeFromContent = (content) => {
//     const ageMatch = content?.match(/(?:aged|age)\s+(\d{2})/i);
//     return ageMatch ? parseInt(ageMatch[1]) : null;
//   };

//   const fetchWikipediaInfo = async (reciterName) => {
//     try {
//       // Enhanced search query with Quran/recitation terms
//       // const searchQuery = `"${reciterName}" "Quran reciter" OR "Qari" OR "recitation" -filetype:pdf -intitle:disambiguation`;
//       const searchQuery = `
// SELECT ?item ?itemLabel WHERE {
//   ?item wdt:P106 wd:Q18123643;     # Occupation = Quran reciter
//         rdfs:label "${reciterName}"@en.
//   SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
// }
// `;

//       const searchResponse = await fetch(
//         `https://en.wikipedia.org/w/api.php?` +
//           new URLSearchParams({
//             action: "query",
//             format: "json",
//             list: "search",
//             srsearch: searchQuery,
//             srlimit: "3", // Check top 3 results for better accuracy
//             srprop: "snippet",
//             utf8: "",
//             origin: "*",
//           })
//       );

//       const searchData = await searchResponse.json();

//       if (searchData.query?.search?.length > 0) {
//         // Find the first result that mentions key terms in the snippet
//         const validResult = searchData.query.search.find(
//           (result) =>
//             result.snippet.toLowerCase().includes("quran") ||
//             result.snippet.toLowerCase().includes("recit") ||
//             result.snippet.toLowerCase().includes("islam")
//         );
//         if (validResult) {
//           return extractInfoFromTitle(validResult.title);
//         }
//       }
//       return null;
//     } catch (error) {
//       console.error("Wikipedia API error:", error);
//       return null;
//     }
//   };

//   const extractInfoFromTitle = async (title) => {
//     console.log(title);
//     try {
//       const response = await fetch(
//         `https://en.wikipedia.org/w/api.php?` +
//           new URLSearchParams({
//             action: "query",
//             format: "json",
//             prop: "extracts|pageprops|categories",
//             exintro: "true",
//             explaintext: "true",
//             clcategories: "Category:Quran_rectiers", // Example categories
//             titles: title,
//             origin: "*",
//           })
//       );

//       const data = await response.json();
//       const page = Object.values(data.query.pages)[0];

//       // Additional validation check
//       if (!isQuranReciterPage(page)) return null;

//       return {
//         description: page.extract || null,
//         country: extractCountryFromContent(page.extract),
//         age: extractAgeFromContent(page.extract),
//         wikipediaUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(
//           title
//         )}`,
//       };
//     } catch (error) {
//       console.error("Wikipedia content fetch error:", error);
//       return null;
//     }
//   };

//   // Validation function
//   const isQuranReciterPage = (page) => {
//     const content = `${page.title} ${page.extract}`.toLowerCase();
//     const validCategories = ["quran", "recit", "islam", "qari"];

//     return (
//       content.includes("quran") &&
//       (content.includes("recit") || content.includes("qari")) &&
//       !content.includes("disambiguation")
//     );
//   };

//   const updateReciterData = async (reciterId, updates) => {
//     const docRef = doc(firestore, "reciters", String(reciterId));
//     await setDoc(docRef, updates, { merge: true });
//   };

//   // Modified Google Image Search
//   const fetchGoogleImage = async (reciterName) => {
//     try {
//       const searchParams = new URLSearchParams({
//         q: `${reciterName} -women`,
//         cx: CX,
//         key: API_KEY,
//         searchType: "image",
//         imgType: "face",
//         num: "5",
//         safe: "active",
//       });

//       const response = await fetch(
//         `https://www.googleapis.com/customsearch/v1?${searchParams}`
//       );
//       const data = await response.json();
//       return (
//         data.items?.find((item) => item.link?.match(/\.(jpe?g|png|webp)$/i))
//           ?.link || null
//       );
//     } catch (error) {
//       console.error("Image search failed:", error);
//       return null;
//     }
//   };

//   const processQueue = async () => {
//     if (isProcessing || queue.length === 0) return;
//     isProcessing = true;

//     const { reciterName, reciterId, resolve, reject } = queue.shift();

//     try {
//       await ensureReciterExists(reciterId, reciterName);
//       const docRef = doc(firestore, "reciters", String(reciterId));
//       const docSnap = await getDoc(docRef);
//       const currentData = docSnap.data();

//       // Only search if data is missing or older than 30 days
//       const needsUpdate =
//         !currentData.description ||
//         !currentData.img ||
//         Date.now() - new Date(currentData.timestamp).getTime() > 2592000000;

//       if (needsUpdate) {
//         // Parallel fetching for image and info
//         if (!currentData.img && !currentData.description) {
//           const [imageUrl, wikiInfo] = await Promise.all([
//             fetchGoogleImage(reciterName),
//             fetchWikipediaInfo(reciterName),
//           ]);

//           const updates = {
//             ...(imageUrl && { img: imageUrl }),
//             ...(wikiInfo && {
//               description: wikiInfo.description,
//               country: wikiInfo.country,
//               age: wikiInfo.age,
//             }),
//             timestamp: new Date().toISOString(),
//           };

//           await updateReciterData(reciterId, updates);
//           resolve(updates);
//         } else if (!currentData.img) {
//           const imageUrl = await fetchGoogleImage(reciterName);
//           if (imageUrl) {
//             await updateReciterData(reciterId, { img: imageUrl });
//           }
//         } else if (!currentData.description) {
//           const wikiInfo = await fetchWikipediaInfo(reciterName);
//           if (wikiInfo) {
//             await updateReciterData(reciterId, {
//               description: wikiInfo.description,
//               country: wikiInfo.country,
//               age: wikiInfo.age,
//             });
//           }
//         } else {
//           resolve(currentData);
//         }
//       } else {
//         resolve(currentData);
//       }
//     } catch (error) {
//       console.error("Search error:", error);
//       reject(error);
//     } finally {
//       setTimeout(() => {
//         isProcessing = false;
//         processQueue();
//       }, RATE_LIMIT);
//     }
//   };

//   return {
//     getReciterInfo: (reciterId, reciterName) =>
//       new Promise((resolve, reject) => {
//         const cleanedName = String(reciterName)
//           .replace(/sheikh|imam|dr\.?/gi, "")
//           .trim()
//           .substring(0, 50);

//         queue.push({
//           reciterId: String(reciterId),
//           reciterName: cleanedName,
//           resolve,
//           reject,
//         });
//         processQueue();
//       }),
//   };
// };


import { doc, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { db as firestore } from "../services/firebase";


const createRequestManager = () => {
  const lang = localStorage.getItem("lang") || "en";
  const queue = [];
  let isProcessing = false;
  const API_KEY = import.meta.env.VITE_NEXT_GOOGLE_SEARCH_API_KEY;
  const CX = "2495ccf136d074c04";
  const RATE_LIMIT = 1500;
  const CACHE_TTL = 2592000000; // 30 days in ms

  // Memory cache layer
  const memoryCache = new Map();
  // Default reciter template
  const defaultReciterData = (name) => ({
    name: name || "Unknown Reciter",
    description: null,
    age: null,
    country: null,
    img: null,
    views: 0,
    libraries: [],
    timestamp: new Date().toISOString(),
  });

  // Batch Firestore operations
  const firestoreBatch = {
    pendingWrites: new Map(),
    timer: null,
    add: function (docRef, data) {
      this.pendingWrites.set(docRef, data);
      if (!this.timer) {
        this.timer = setTimeout(() => this.flush(), 5000);
      }
    },
    flush: async function () {
      const batch = writeBatch(firestore);
      for (const [docRef, data] of this.pendingWrites) {
        batch.set(docRef, data, { merge: true });
      }
      await batch.commit();
      this.pendingWrites.clear();
      this.timer = null;
    },
  };

  const getCachedData = async (reciterId, reciterName) => {
    // Check memory cache first
    if (memoryCache.has(reciterId)) {
      return memoryCache.get(reciterId);
    }

    const docRef = doc(firestore, "reciters", reciterId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      defaultReciterData(reciterName);
      await setDoc(docRef, defaultReciterData(reciterName));
      memoryCache.set(reciterId, defaultReciterData(reciterName)); // Populate memory cache
      return defaultReciterData(reciterName);
    }

    const data = docSnap.data();
    memoryCache.set(reciterId, data); // Populate memory cache
    return data;
  };

  const updateReciterData = async (reciterId, updates) => {
    const docRef = doc(firestore, "reciters", reciterId);
    const newData = { ...updates, timestamp: new Date().toISOString() };

    // Update memory cache immediately
    memoryCache.set(reciterId, {
      ...(memoryCache.get(reciterId) || {}),
      ...newData,
    });

    // Batch Firestore write
    firestoreBatch.add(docRef, newData);
  };

  const extractCountryFromContent = (content) => {
    const countries = [
      "Egypt",
      "Saudi Arabia",
      "Syria",
      "Morocco",
      "Yemen",
      "Kuwait",
      "Algeria",
      "Iraq",
      "Sudan",
      "Palestine",
            "مصر",
      "المملكة العربية السعودية",
      "سوريا",
      "المغرب",
      "اليمن",
      "الكويت",
      "الجزائر",
      "العراق",
      "السودان",
      "فلسطين",
    ];
    return (
      countries.find((country) =>
        content?.toLowerCase().includes(country.toLowerCase())
      ) || null
    );
  };

  const extractAgeFromContent = (content) => {
    const ageMatch = content?.match(/(?:aged|age)\s+(\d{2})/i);
    return ageMatch ? parseInt(ageMatch[1]) : null;
  };

  const processGoogleResponse = (data) => {
    const items = data.items || [];
    if (items.length === 0) return null;

    // Consider top 5 results for evaluation
    const topResults = items.slice(0, 5);
    const combinedContent = topResults
      .map((item) => `${item.title} ${item.snippet}`)
      .join(" ");

    // Score results based on information completeness
    const scoredResults = topResults.map((item) => {
      const content = `${item.title} ${item.snippet}`;
      return {
        item,
        score:
          (extractCountryFromContent(content) ? 2 : 0) +
          (extractAgeFromContent(content) ? 1 : 0) +
          (content.toLowerCase().includes("quran") ? 0.5 : 0),
      };
    });

    // Find the result with highest score, using position as tiebreaker
    const bestResult = scoredResults.reduce(
      (best, current) => {
        return current.score > best.score ||
          (current.score === best.score && current.item < best.item)
          ? current
          : best;
      },
      { score: -1 }
    );

    return {
      description: bestResult.item.snippet || "",
      country: extractCountryFromContent(combinedContent),
      age: extractAgeFromContent(combinedContent),
      url: bestResult.item.link || "",
      // Include confidence score for debugging purposes
      _meta: { score: bestResult.score, totalResults: items.length },
    };
  };

  const fetchReciterInfoFromGoogle = async (reciterName) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?${new URLSearchParams({
          q: `${reciterName} Quran reciter info`,
          key: API_KEY,
          cx: CX,
          num: "5",
          lr: `lang_${lang}`, // Language restrict
          hl: lang, // Host language
        })}`
      );

      if (!response.ok) throw new Error("API request failed");

      return processGoogleResponse(await response.json());
    } catch (error) {
      console.error("Google Search API error:", error);
      return null;
    }
  };

  const processImageSearch = (items) => {
    const validFormats = /\.(jpe?g|png|webp)$/i;
    return (
      items?.find(
        (item) =>
          item.link?.match(validFormats) &&
          item.image?.width >= 400 &&
          item.image?.height >= 400
      )?.link || null
    );
  };

  const fetchImageData = async (reciterName) => {
    const aport = new AbortController();

    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?${new URLSearchParams({
          q: `${reciterName} -women`,
          cx: CX,
          key: API_KEY,
          searchType: "image",
          imgType: "face",
          num: "3", // Reduced from 10 to 3
          safe: "active",
        })}`,
        aport.signal
      );

      return processImageSearch((await response.json()).items);
    } catch (error) {
      console.error("Image search failed:", error);
      return null;
    }
  };

  const processQueueItem = async (item) => {
    const { reciterId, reciterName } = item;
    const cachedData = await getCachedData(reciterId, reciterName);

    // Early return for fresh cache
    if (
      cachedData?.timestamp &&
      Date.now() - new Date(cachedData.timestamp).getTime() < CACHE_TTL &&
      cachedData?.img &&
      cachedData?.description
    ) {
      return cachedData;
    }

    let wikiData = null;
    let imageUrl = null;

    if (!cachedData?.img && !cachedData?.description) {
      // Both missing: fetch in parallel
      [wikiData, imageUrl] = await Promise.all([
        fetchReciterInfoFromGoogle(reciterName),
        fetchImageData(reciterName),
      ]);
    } else {
      if (!cachedData?.img) {
        // Only image missing
        imageUrl = await fetchImageData(reciterName);
      }
      if (!cachedData?.description) {
        // Only description missing
        wikiData = await fetchReciterInfoFromGoogle(reciterName);
      }
    }

    const updates = {
      ...(wikiData && wikiData),
      ...(imageUrl && { img: imageUrl }),
    };

    if (Object.keys(updates).length > 0) {
      await updateReciterData(reciterId, updates);
    }

    return { ...(cachedData || {}), ...updates };
  };

  const processQueue = async () => {
    if (isProcessing || queue.length === 0) return;
    isProcessing = true;

    const item = queue.shift();
    if (!item) return;

    try {
      const result = await processQueueItem(item);
      // Resolve all pending promises
      item.resolve.forEach((resolve) => resolve(result));
    } catch (error) {
      console.error("Queue processing error:", error);
      // Reject all pending promises
      item.reject.forEach((reject) => reject(error));
    } finally {
      setTimeout(() => {
        isProcessing = false;
        processQueue();
      }, RATE_LIMIT);
    }
  };

  return {
    getReciterInfo: (reciterId, reciterName) => {
      return new Promise((resolve, reject) => {
        const stringId = String(reciterId);
        const cleanedName = reciterName
          .replace(/sheikh|imam|dr\.?/gi, "")
          .trim()
          .substring(0, 50);

        // Deduplicate requests
        const existingIndex = queue.findIndex(
          (item) =>
            item.reciterId === stringId && item.reciterName === cleanedName
        );

        if (existingIndex !== -1) {
          // Add to existing queue item
          queue[existingIndex].resolve.push(resolve);
          queue[existingIndex].reject.push(reject);
        } else {
          // Create new queue item with arrays
          queue.push({
            reciterId: stringId,
            reciterName: cleanedName,
            resolve: [resolve], // Array of resolve functions
            reject: [reject], // Array of reject functions
          });
        }

        processQueue();
      });
    },
  };
};

export const requestManager = createRequestManager();
