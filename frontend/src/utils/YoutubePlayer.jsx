const YoutubePlayer = ({ url }) => {
  const getYoutubeId = (url) => {
    const regex =
      /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([^&?/]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const id = getYoutubeId(url);

  if (!id) return null;

  return (
    <div className="w-full md:w-[90%] aspect-video rounded-xl overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&modestbranding=1&rel=0`}
        className="w-full h-full"
        title="Video Player"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
  );
};

export default YoutubePlayer;
