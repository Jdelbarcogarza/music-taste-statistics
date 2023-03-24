import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseInstance";
import axios from "axios";
import Artist from "@/components/statsPage/Artist";
import Track from "@/components/statsPage/Track";
import Image from "next/image";

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
    console.log("variable que pasoo", objectType);
    // si el user pidio mas artistas, entonces despliega eso, si no, entonces tracks.
    if (objectType === "artists") {
      getArtistsData();
    } else {
      getTracksData();
    }
  }, []);


    return (
      <div className="seccion-tracks-artistas">
        <div className="heading">
          <h1>{ objectType === "artists" ?  "Artistas" : "Tracks" }</h1>
        </div>
        <div className="imgs-container">
           {objectType === "artists" ? topArtists.map((artist: any) => (
            <Artist artist={artist} key={artist.id} />
          )) : topTracks.map((track: any) => (
            <Track key={track.id} track={track} />
          ))}
        </div>
      </div>
    );
};

export default moreObjects;
