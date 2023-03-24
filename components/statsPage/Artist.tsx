
import Image from "next/image";

const Artist = ({ artist, className }: { artist: any, className?: string; }) => {

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`} >
      <Image src={artist.images[1].url} alt={`${artist.name}`} width={144} height={144} style={{
        borderRadius: "100%"
      }} />
      <p className="text-center">{artist.name}</p>
    </div>
  );

};

export default Artist;