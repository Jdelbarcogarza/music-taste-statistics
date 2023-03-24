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
  const router = useRouter();

  useEffect(() => {
    async function getUserSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setSpotifyUserObject(() => user);
      console.log("userr", user);
    }

    getUserSession();
  }, []);

  useEffect(() => {
    async function getAccessToken() {
      const { data, error } = await supabase.auth.getSession();
      setAccessToken(data.session?.provider_token);
    }

    getAccessToken();

    console.log("este es el user object", userSpotifyUserObject);
  }, [userSpotifyUserObject]);

  // useEffect(() => {
  // });
  
  async function getTopTracks() {
    const { data, error } = await supabase.auth.getSession();

    const req = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
      headers: {
        Authorization: `Bearer ${data.session?.provider_token}`,
      },
    });

    console.log(req.data.items);
    setTopTracks(req.data.items);

  }
  // npx supabase gen types typescript --project-id xhoehsaspitgrwvrrlaj --schema public > types/supabase.ts


  return (
    <div>
      <p>artists</p>

      <button onClick={getTopTracks} className="bg-green-400">
        call API
      </button>

      <div>{topTracks.map((object: any) => (
        <p key={object.id}>{object.name}</p>
      ))}</div>
    </div>
  );
};

export default Home;
