
import React from 'react';
import Layout from '@/components/layout/Layout';

interface Connection {
  studentInitials: string;
  studentName: string;
  studentEmail: string;
  studentBg: string;
  preceptorInitials: string;
  preceptorName: string;
  preceptorEmail: string;
  preceptorBg: string;
  requestDate: string;
  connectionDate: string;
}

const Connections = () => {
  const connections: Connection[] = [
    {
      studentInitials: "EM",
      studentName: "Elaina McAdams",
      studentEmail: "elainamhall@mail.fresnostate.edu",
      studentBg: "bg-cauhec-red",
      preceptorInitials: "EM",
      preceptorName: "Elaina McAdams",
      preceptorEmail: "Elainamhall@gmail.com",
      preceptorBg: "bg-cauhec-red",
      requestDate: "18/12/2024",
      connectionDate: "18/12/2024"
    },
    {
      studentInitials: "EM",
      studentName: "Elaina McAdams",
      studentEmail: "Elainamhall@yahoo.com",
      studentBg: "bg-cauhec-red",
      preceptorInitials: "E",
      preceptorName: "Elaina",
      preceptorEmail: "elaina.mcadams@cauhec.org",
      preceptorBg: "bg-purple-500",
      requestDate: "11/01/2025",
      connectionDate: "11/01/2025"
    },
    {
      studentInitials: "EM",
      studentName: "Elaina McAdams",
      studentEmail: "Elainamhall@yahoo.com",
      studentBg: "bg-cauhec-red",
      preceptorInitials: "E",
      preceptorName: "Elaina McAdams",
      preceptorEmail: "Elaina.mcadams@cauhec.orf",
      preceptorBg: "bg-purple-500",
      requestDate: "10/02/2025",
      connectionDate: "10/02/2025"
    },
    {
      studentInitials: "EM",
      studentName: "Elaina McAdams",
      studentEmail: "Elainamhall@yahoo.com",
      studentBg: "bg-cauhec-red",
      preceptorInitials: "ML",
      preceptorName: "Marvin Lowrance",
      preceptorEmail: "marvin.lowrance@idea2impacttechsolutions.com",
      preceptorBg: "bg-green-500",
      requestDate: "10/02/2025",
      connectionDate: "10/02/2025"
    },
    {
      studentInitials: "OY",
      studentName: "Olivia Young",
      studentEmail: "Olivia.young@studentmail.com",
      studentBg: "bg-orange-500",
      preceptorInitials: "DS",
      preceptorName: "David Smith",
      preceptorEmail: "David.smith@mail.com",
      preceptorBg: "bg-blue-500",
      requestDate: "14/02/2025",
      connectionDate: "14/02/2025"
    },
  ];

  return (
    <Layout 
      title="Connections" 
      subtitle="Manage student and preceptor connections"
    >
      <div className="bg-white rounded-md shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-gray-500 text-sm">
              <th className="p-4">STUDENT NAME</th>
              <th className="p-4">PRECEPTOR NAME</th>
              <th className="p-4">CONNECTION REQUESTED DATE</th>
              <th className="p-4">CONNECTION DATE</th>
            </tr>
          </thead>
          <tbody>
            {connections.map((connection, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`user-initial ${connection.studentBg}`}>{connection.studentInitials}</div>
                    <div>
                      <p className="font-medium">{connection.studentName}</p>
                      <p className="text-gray-500 text-xs">{connection.studentEmail}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`user-initial ${connection.preceptorBg}`}>{connection.preceptorInitials}</div>
                    <div>
                      <p className="font-medium">{connection.preceptorName}</p>
                      <p className="text-gray-500 text-xs">{connection.preceptorEmail}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-500">{connection.requestDate}</td>
                <td className="p-4 text-gray-500">{connection.connectionDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Connections;
