import {
    BarChart,
    Bar,
    Tooltip,
    XAxis,
    YAxis,
    ResponsiveContainer
  } from "recharts";
  
  import { Card } from "../components/Card";
  
  export function BarChartCard({
    title,
    data
  }: any) {
    return (
      <Card>
        <h3 className="mb-4 font-semibold">
          {title}
        </h3>
  
        <div className="h-80">
          <ResponsiveContainer>
            <BarChart data={data}>
              <XAxis dataKey="name" />
  
              <YAxis />
  
              <Tooltip />
  
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    );
  }