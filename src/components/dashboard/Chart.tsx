
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

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
  { month: 'November', preceptors: 0, students: 0 },
  { month: 'December', preceptors: 4, students: 2 },
];

const Chart = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-bold mb-6">Preceptors vs Students Comparison</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 5]} />
            <Bar dataKey="preceptors" fill="#F14855" barSize={20} radius={[2, 2, 0, 0]} />
            <Bar dataKey="students" fill="#F9C74F" barSize={20} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
