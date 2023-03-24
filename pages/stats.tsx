import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseInstance";
import { useRouter } from "next/router";
import axios from "axios";
import { register } from "swiper/element/bundle";
import Script from "next/script";

import Track from "@/components/statsPage/Track";
import Artist from "@/components/statsPage/Artist";

const Home: NextPage = () => {
  // swiper js
  register();
  const swiperElRefSongs = useRef(null);
  const swiperElRefArtists = useRef(null);

  // validar si está validado el usuario, si no redirigir a login

  const [userSpotifyUserObject, setSpotifyUserObject] = useState<any>();
  const [accessToken, setAccessToken] = useState<any>("");

  // tracks lists
  const [topTracks, setTopTracks] = useState<any>([]);

  // artists lists
  const [topArtists, setTopArtists] = useState<any>([]);

  const [artistsTimeFrame, setArtistTimeFrame] =
    useState<string>("medium_term");
  const [tracksTimeFrame, setTracksTimeFrame] = useState<string>("medium_term");

  const router = useRouter();

  useEffect(() => {
    // listen for Swiper events using addEventListener
    swiperElRefSongs.current.addEventListener("progress", (e) => {
      const [swiper, progress] = e.detail;
      // console.log(progress);
    });

    swiperElRefSongs.current.addEventListener("slidechange", (e) => {
      // console.log("slide changed");
    });

    // listen for Swiper events using addEventListener
    swiperElRefArtists.current.addEventListener("progress", (e) => {
      const [swiper, progress] = e.detail;
      // console.log(progress);
    });

    swiperElRefArtists.current.addEventListener("slidechange", (e) => {
      // console.log("slide changed");
    });

    async function getUserSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setSpotifyUserObject(() => user);
      console.log("user", user);

      const { data, error } = await supabase.auth.getSession();
      setAccessToken(() => data.session?.provider_token);
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
            time_range: tracksTimeFrame,
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
            time_range: artistsTimeFrame,
          },
        }
      );

      setTopArtists(() => topArtists.data.items);
      console.log(topArtists.data.items);
    }

    getSpotifyData();
  }, [userSpotifyUserObject, artistsTimeFrame, tracksTimeFrame, accessToken]);

  async function handleSeeMoreTracks() {
    router.push("/tracks");
  }

  async function handleSeeMoreArtists() {
    router.push("/artists");
  }

  async function handleGraphics() {
    router.push("/graphs");
  }

  const ArtistSelectTimeFrame = () => (
    <select
      id="time"
      value={artistsTimeFrame}
      className="text-md rounded-lg bg-transparent"
      onChange={(e) => setArtistTimeFrame(e.target.value)}
    >
      <option value="short_term">Last 4 weeks</option>
      <option value="medium_term">Last 6 months</option>
      <option value="long_term">All time</option>
    </select>
  );

  const TrackSelectTimeFrame = () => (
    <select
      id="time"
      value={tracksTimeFrame}
      className="text-md rounded-lg bg-transparent"
      onChange={(e) => setTracksTimeFrame(e.target.value)}
    >
      <option value="short_term">Last 4 weeks</option>
      <option value="medium_term">Last 6 months</option>
      <option value="long_term">All time</option>
    </select>
  );

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/swiper@9/swiper-element-bundle.min.js" />
      <div className="h-screen text-white">
        <h1 className="text-3xl text-center py-5">Your Music Stats</h1>
        <div className="flex h-5/6 flex-1 flex-col justify-around">
          <div>
            <div className="px-2">
              <p className="pb-2 text-2xl">Artists</p>
              <div className="mb-3 flex items-end justify-between">
                <ArtistSelectTimeFrame />
                <button
                  className="pr-3 font-bold"
                  onClick={handleSeeMoreArtists}
                >
                  See More
                </button>
              </div>
            </div>
            <swiper-container ref={swiperElRefSongs} slides-per-view="3">
              {topArtists.map((object: any) => (
                <swiper-slide key={object.id} className={""}>
                  <Artist artist={object} className={"mx-2 text-white"} />
                </swiper-slide>
              ))}
            </swiper-container>
          </div>

          <div>
            <div className="px-2">
            <p className="pb-2 text-2xl">Songs</p>
            <div className="mb-3 flex items-end justify-between">
              <TrackSelectTimeFrame />
              <button className="pr-3 font-bold" onClick={handleSeeMoreTracks}>
                See More
              </button>
            </div>
            </div>
            <swiper-container ref={swiperElRefArtists} slides-per-view="3">
              {topTracks.map((object: any) => (
                <swiper-slide key={object.id} className={""}>
                  <Track track={object} className={"mx-2 text-white"} />
                </swiper-slide>
              ))}
            </swiper-container>
          </div>
          <div className="flex flex-col justify-center space-y-3 px-4 text-white">
            <p className="text-xl">
              Get to know in detail the music that you listen to.
            </p>
            <button
              onClick={handleGraphics}
              className="w-fit place-self-center rounded-lg border-2 py-4 px-3"
            >
              Know what you hear
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
