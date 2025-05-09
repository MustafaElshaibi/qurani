import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactYouTube from 'react-youtube';
import { useSelector } from 'react-redux';

const YouTubeLive = () => {
  const lang = useSelector((state)=> state.lang);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // YouTube API configuration
  const API_KEY = import.meta.env.VITE_NEXT_PUBLIC_YOUTUBE_API_KEY; // Use environment variables

  const CHANNEL_IDS = [
    'UCqDUJp6Z4wyFkDJGqd0EP4Q',
    'UCfBw_uwZb_oFLyVsjWk6owQ',
    'UCWainKMJPyXikjekccFf3NA',
    'UCmMcOjsVehVlEOteyrhjI2Q'
  ];

  useEffect(() => {
    const fetchLiveVideos = async () => {
      try {
        const requests = CHANNEL_IDS.map(async (channelId) => {
          const response = await axios.get(
            'https://www.googleapis.com/youtube/v3/search', {
              params: {
                part: 'snippet',
                channelId,
                eventType: 'live',
                type: 'video',
                key: API_KEY,
                order: 'date',
                maxResults: 2
              }
            }
          );
          return response.data.items;
        });

        const results = await Promise.all(requests);
        const allVideos = results.flat();
        
        setVideos(allVideos);
        if (allVideos.length > 0) {
          setSelectedVideo(allVideos[0].id.videoId);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveVideos();
  }, []);

  const youtubeOptions = {
    height: '500',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 1,
      modestbranding: 1,
    },
  };

  if (!API_KEY) return (
    <div className="p-6 text-red-500 bg-red-50 rounded-lg text-center">
      YouTube API key is required. Please check your environment variables.
    </div>
  );

  if (loading) return (
    <div className="p-6 text-blue-500 bg-blue-50 rounded-lg text-center animate-pulse">
      Loading live streams...
    </div>
  );

  if (error) return (
    <div className="p-6 text-red-500 bg-red-50 rounded-lg text-center">
      Error: {error}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-second-black rounded-lg min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8 pt-5 text-center">
       {lang === 'eng' ? ' Live Makkah & Madinah Streams' : "مباشر مكة والمدينة"}
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Video Player */}
        <div className="flex-grow">
          <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg aspect-video[16/9]">
            {selectedVideo && (
              <ReactYouTube
                videoId={selectedVideo}
                opts={youtubeOptions}
                className="w-full h-full"
              />
            )}
          </div>
        </div>

        {/* Video List */}
        <div className="lg:w-96 xl:w-[480px] flex flex-col gap-4">
          <h3 className="text-xl font-semibold text-white mb-2">
            Available Streams
          </h3>
          
          <div className="space-y-4  overflow-y-auto max-h-[600px] pr-2 [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:bg-gray-300
  [&::-webkit-scrollbar-thumb]:bg-blue-500
  [&::-webkit-scrollbar-thumb]:rounded-full">
            {videos.map((video) => (
              <div
                key={video.id.videoId}
                onClick={() => setSelectedVideo(video.id.videoId)}
                className={`p-4 rounded-lg cursor-pointer   transition-all ${
                  video.id.videoId === selectedVideo 
                    ? 'bg-gray/50 border-2 border-blue-300'
                    : 'bg-search-dark hover:bg-gray/50 hover:text-black border border-gray-200'
                }`}
                role="button"
                tabIndex={0}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    className="w-32 h-24 max-sm:w-full rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-grow">
                    <h4 className={`text-sm font-medium text-white  line-clamp-2 mb-1`}>
                      {video.snippet.title}
                    </h4>
                    <p className="text-xs text-white">
                      {video.snippet.channelTitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeLive;