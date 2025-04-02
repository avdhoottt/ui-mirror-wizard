
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const data = [
  { month: 'January', preceptors: 3, students: 2 },
  { month: 'February', preceptors: 2, students: 2 },
  { month: 'March', preceptors: 3, students: 3 },
  { month: 'April', preceptors: 0, students: 0 },
  { month: 'May', preceptors: 0, students: 0 },
  { month: 'June', preceptors: 0, students: 0 },
  { month: 'July', preceptors: 0, students: 0 },
  { month: 'August', preceptors: 0, students: 0 },
  { month: 'September', preceptors: 0, students: 0 },
  { month: 'October', preceptors: 0, students: 0 },
  { month: 'November', preceptors: 4, students: 2 },
  { month: 'December', preceptors: 4, students: 2 },
];

const Chart = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Preceptors vs Students Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ top: 10, right: 30, left: 0, bottom: 35 }}
              barGap={0}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e5e5" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4]}
                axisLine={false}
                tickLine={false}
              />
              <ReferenceLine y={0} stroke="#e5e5e5" />
              <Bar 
                name="Preceptors"
                dataKey="preceptors" 
                fill="#F14855" 
                barSize={24} 
                radius={[2, 2, 0, 0]} 
              />
              <Bar 
                name="Students"
                dataKey="students" 
                fill="#F9C74F" 
                fillOpacity={0.6}
                barSize={24} 
                radius={[2, 2, 0, 0]} 
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="square"
                wrapperStyle={{ 
                  bottom: 0,
                  fontSize: '14px'
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chart;
