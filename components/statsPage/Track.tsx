
import Image from "next/image";

const Track = ({ track, className }: { track: any, className: string; }) => {
  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`} >
      <Image src={track.album.images[1].url} alt={`${track.name}`} width={144} height={144} style={{
        borderRadius: "8px"
      }} />
      <p className="text-center">{track.name}</p>
    </div>
  );
};

export default Track;
