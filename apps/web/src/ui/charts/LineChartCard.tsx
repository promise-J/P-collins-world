import {
    LineChart,
    Line,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip
  } from "recharts";
  
  import { Card } from "../components/Card";
  
  interface Props {
    title: string;
    data: any[];
  }
  
  export function LineChartCard({
    title,
    data
  }: Props) {
    return (
      <Card>
        <h3 className="mb-4 font-semibold">
          {title}
        </h3>
  
        <div className="h-80">
          <ResponsiveContainer>
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
  
              <Line
                dataKey="value"
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    );
  }