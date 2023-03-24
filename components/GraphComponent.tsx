
import { NextPage } from "next";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type GraphProps = {
  data: any;
  dataKey: any;
}

const GraphComponent: NextPage<GraphProps> = ({ data, dataKey }) => {
  return (
    <div>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: -30,
          bottom: 5,
        }}
        barSize={20}
      >
        <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar dataKey={dataKey} fill="#fcad03" background={{ fill: '#eee' }} />
      </BarChart>
    </div>
  )
}

export default GraphComponent