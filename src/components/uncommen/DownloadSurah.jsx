import axios from "axios";
import { memo } from "react";
import { IoCloudDownloadSharp } from "react-icons/io5";

function DownloadSurah({ surah, className }) {
  async function handleDownload() {
    try {
      const audioUrl = surah?.url;
      if (!audioUrl) {
        console.error("No audio URL available");
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
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download surah. Please try again.");
    }
  }

  return (
    <div>
      <IoCloudDownloadSharp 
        onClick={handleDownload} 
        className={`text-white ${className} hidden sm:block size-5 cursor-pointer hover:opacity-80 transition-opacity`}
        title="Download Surah"
      />
    </div>
  );
}

export default memo(DownloadSurah);