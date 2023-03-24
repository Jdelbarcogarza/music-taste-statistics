import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseInstance";
import axios from "axios";
import Artist from "@/components/statsPage/Artist";
import Track from "@/components/statsPage/Track";

const moreObjects = () => {
  const router = useRouter();

  const { objectType } = router.query;

    // tracks lists
    const [topTracks, setTopTracks] = useState<any>([]);

    // artists lists
    const [topArtists, setTopArtists] = useState<any>([]);
  
    const [artistsTimeFrame, setArtistTimeFrame] =
      useState<string>("medium_term");
    const [tracksTimeFrame, setTracksTimeFrame] = useState<string>("medium_term");

    async function getArtistsData() {
      // consegir access token
      const { data, error } = await supabase.auth.getSession();


      

      // conseguir top artists
      const topArtists = await axios.get(
        "https://api.spotify.com/v1/me/top/artists",
        {
          headers: {
            Authorization: `Bearer ${data.session?.provider_token}`,
          },
          params: {
            limit: 10,
            time_range: artistsTimeFrame,
          },
        }
      );

      setTopArtists(() => topArtists.data.items);
      console.log(topArtists.data.items);
    }

    async function getTracksData() {
      const { data, error } = await supabase.auth.getSession();

            // conseguir top tracks
            const topTracks = await axios.get(
              "https://api.spotify.com/v1/me/top/tracks",
              {
                headers: {
                  Authorization: `Bearer ${data.session?.provider_token}`,
                },
                params: {
                  limit: 10,
                  time_range: tracksTimeFrame,
                },
              }
            );

            setTopTracks(() => topTracks.data.items);
      console.log(topTracks.data.items);
    }

  useEffect(() => {

  // si el user pidio mas artistas, entonces despliega eso, si no, entonces tracks.    
    if (objectType === "moreArtists") {
      
      getArtistsData();
    } else {
      getTracksData();
    }
  
    return () => {
      
    }
  }, [])
  
  const Content = () => {}
  
  if (objectType === "moreArtists") {
    
    // componente que renderiza el contenido
    Content = () => {
      {topArtists.map((artist: any) => (
        <Artist artist={artist} key={artist.id} />
      ))}
    };
  }

  return <div>{Content}</div>;
};

export default moreObjects;
