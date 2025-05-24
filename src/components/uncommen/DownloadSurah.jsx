import axios from "axios";
import { memo, useState } from "react";
import { IoCloudDownloadSharp } from "react-icons/io5";
import PageLoader from "./PageLoader";

function DownloadSurah({ surah, className }) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    try {
      setLoading(true);
      const audioUrl = surah?.url;
      if (!audioUrl) {
        console.error("No audio URL available");
        setLoading(false);
        alert("No audio URL available for this surah.");
        return;
      }
      // Fetch audio file as blob with proper responseType
      const response = await axios.get(audioUrl, {
        responseType: "blob",
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create temporary link element
      const link = document.createElement("a");
      link.href = url;

      // Set filename for download (using surah name or fallback)
      const fileName = `${surah?.reciter?.name}_${surah?.name?.replace(/ /g, "_") || "surah"}.mp3`;
      link.download = fileName;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      setLoading(false);
    } catch (error) {
      console.error("Download failed:", error);
      setLoading(false);
      alert("Failed to download surah. Please try again.");
    }
  }

  return (
    <button
      className={`btn btn-primary ${className}`}
      onClick={handleDownload}
      disabled={loading}
      title="Download Surah"
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </span>
      ) : (
        <IoCloudDownloadSharp
          className={`text-white ${className} hidden sm:block size-5 cursor-pointer hover:opacity-80 transition-opacity`}
          title="Download Surah"
        />
      )}
    </button>
  );
}

export default memo(DownloadSurah);