import { useState } from 'react';

export default function VideoStream() {
  const [streamUrl, setStreamUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [streamType, setStreamType] = useState('');

  const detectStreamType = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    } else if (url.includes('discord.com')) {
      return 'discord';
    } else if (url.includes('zoom.us')) {
      return 'zoom';
    }
    return 'unknown';
  };

  const getYouTubeEmbedUrl = (url) => {
    // Handle various YouTube URL formats
    let videoId = '';
    
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      videoId = urlParams.get('v');
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1].split('?')[0];
    } else if (!url.includes('/') && !url.includes('?')) {
      // Assume it's just a video ID
      videoId = url;
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!streamUrl.trim()) return;

    const type = detectStreamType(streamUrl);
    setStreamType(type);

    if (type === 'youtube') {
      const embedUrl = getYouTubeEmbedUrl(streamUrl);
      setEmbedUrl(embedUrl);
    } else if (type === 'discord') {
      // Discord uses the URL as provided
      setEmbedUrl(streamUrl);
    } else if (type === 'zoom') {
      setEmbedUrl(streamUrl);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} classNameName="mb-4 bg-gradient-to-r from-purple-50 to-yellow-50 p-3 sm:p-4 md:p-6 rounded-lg shadow-lg border-2 border-purple-200">
        <div className="flex gap-3 sm:gap-4 md:gap-6 flex-col md:flex-row md:items-end">
          <div className="flex-1 min-w-0">
            <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
              Video Link
            </label>
            <input
              type="text"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              placeholder="Paste your video link here to begin"
              className="w-full px-3 py-2 md:py-3 text-sm md:text-base border-2 border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            />
            <p className="text-gray-600 text-xs md:text-sm mt-2">Paste a video link above to start streaming</p>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto px-4 md:px-5 py-1.5 md:py-2 text-sm md:text-base bg-gradient-to-r from-purple-600 to-yellow-600 text-white rounded-md hover:from-purple-700 hover:to-yellow-700 transition-all shadow-md hover:shadow-lg font-semibold whitespace-nowrap"
          >
            Load Stream
          </button>
        </div>
      </form>

      {/* Video Embed Section */}
      {embedUrl ? (
        <div className="w-full">
          <div className="relative w-full aspect-video">
            <iframe
              src={embedUrl}
                classNameName="absolute inset-0 w-full h-full rounded-lg shadow-lg border-2 border-purple-200"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Stream Video"
            />
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="video-stream-placeholder relative w-full aspect-video bg-gradient-to-br from-purple-100 to-yellow-100 rounded-lg shadow-lg border-2 border-purple-200 flex items-center justify-center">
            <p className="text-gray-600 text-sm md:text-base font-medium px-4 text-center">Waiting for video link...</p>
          </div>
        </div>
      )}
    </div>
  );
}
