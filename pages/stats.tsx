import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseInstance";
import { useRouter } from "next/router";
import axios from "axios";

const Home: NextPage = () => {
  // validar si está validado el usuario, si no redirigir a login

  const [userSpotifyUserObject, setSpotifyUserObject] = useState<any>();
  const [accessToken, setAccessToken] = useState<any>("");
  const [topTracks, setTopTracks] = useState<any>([]);
  const [topArtists, setTopArtists] = useState<any>([]);
  const [timeFrame, setTimeFrame] = useState<string>("short_term");
  const router = useRouter();

  useEffect(() => {
    async function getUserSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setSpotifyUserObject(() => user);
      console.log("user", user);
    }

    getUserSession();
  }, []);

  useEffect(() => {
    async function getSpotifyData() {
      // consegir access token
      const { data, error } = await supabase.auth.getSession();
      setAccessToken(() => data.session?.provider_token);

      // conseguir top tracks
      const topTracks = await axios.get(
        "https://api.spotify.com/v1/me/top/tracks",
        {
          headers: {
            Authorization: `Bearer ${data.session?.provider_token}`,
          },
          params: {
            limit: 6,
            time_range: timeFrame
          },
        }
      );

      setTopTracks(() => topTracks.data.items);
      console.log(topTracks.data.items);

      // conseguir top artists
      const topArtists = await axios.get(
        "https://api.spotify.com/v1/me/top/artists",
        {
          headers: {
            Authorization: `Bearer ${data.session?.provider_token}`,
          },
          params: {
            limit: 6,
          },
        }
      );

      setTopArtists(() => topArtists.data.items);
      console.log(topArtists.data.items);
    }

    getSpotifyData();
  }, [userSpotifyUserObject, timeFrame]);
  // npx supabase gen types typescript --project-id xhoehsaspitgrwvrrlaj --schema public > types/supabase.ts

  return (
    <div>
      <p>songs</p>

      {/* <button onClick={getTopTracks} className="bg-green-400">
          call API
        </button> */}

      <div>
        {topTracks.map((object: any) => (
          <p key={object.id}>{object.name}</p>
        ))}
      </div>

      <p>artists</p>
      <div>
        {topArtists.map((object: any) => (
          <p key={object.id}>{object.name}</p>
        ))}
      </div>
      <button onClick={() => setTimeFrame("long_term")}>change</button>
    </div>

  );
};

export default Home;
