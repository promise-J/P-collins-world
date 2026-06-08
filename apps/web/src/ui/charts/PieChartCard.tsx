import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer
  } from "recharts";
  
  import { Card } from "../components/Card";
  
  export function PieChartCard({
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
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
              />
  
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    );
  }