import { NextPage } from "next";
import { supabase } from "@/lib/supabaseInstance";
import axios from "axios";
import ExampleGraph from "../components/GraphComponent";
import GraphComponent from "../components/GraphComponent";
import { useEffect, useState } from "react";

type GraphProps = {
  text: string;
};

let data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const Graphs: NextPage = () => {
  // let dataGraph: any = []
  const [dataGraphDance, setDataDance] = useState(0);
  const [dataGraphEnergy, setDataEnergy] = useState(0);



  useEffect(() => {
    async function getTopTracks() {
      const { data, error } = await supabase.auth.getSession();

      const req = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
        headers: {
          Authorization: `Bearer ${data.session?.provider_token}`,
        },
      });

      let ids: string = "";

      req.data.items.forEach((item: any) => {
        ids += item.id + ",";
      });

      const req2 = await axios.get(
        "https://api.spotify.com/v1/audio-features",
        {
          headers: {
            Authorization: `Bearer ${data.session?.provider_token}`,
          },
          params: {
            ids: ids,
          },
        }
      );

      let arr: any = [];
      let arr2: any = [];

      req2.data.audio_features.forEach((item: any, i: any) => {
        const obj = {
          name: req.data.items[i].name,
          Danceability: (item.danceability * 10).toFixed(2),
        };
        const obj2 = {
          name: req.data.items[i].name,
          Energy: (item.energy * 10).toFixed(2),
        };
        arr.push(obj);
        arr2.push(obj2);
      });

      setDataDance(arr);
      setDataEnergy(arr2);
    }

    getTopTracks();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: "0",
        bottom: "0",
        left: "0",
        right: "0",
        margin: "auto",
      }}
    >
      <GraphComponent data={dataGraphDance} dataKey="Danceability" />
      <GraphComponent data={dataGraphEnergy} dataKey="Energy" />
    </div>
  );
};

export default Graphs;
