import { LineChart, Line, XAxis, YAxis } from "recharts";

export function RevenueTrendChart({ data }: any) {
  return (
    <LineChart width={800} height={300} data={data}>
      <XAxis dataKey="month" />

      <YAxis />

      <Line dataKey="revenue" />
    </LineChart>
  );
}
