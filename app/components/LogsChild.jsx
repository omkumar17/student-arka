import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const LogsChild = () => {
  const [logs, setLogs] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      setEnrollment(session.user.enrollment);
    }
  }, [session]);

  useEffect(() => {
    const fetchLogs = async () => {
      if (enrollment) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/punchlog?enrollment=${enrollment}`);
          const data = await response.json();
          setLogs(data.logs[0]);
          console.log("data", data.logs[0]);
        } catch (error) {
          console.error('Error fetching logs:', error);
        }
      }
    };

    fetchLogs();
  }, [enrollment]);

  useEffect(()=>{
    console.log("logs",logs);
  },[logs])

  // Extracting general information
 
  return (
    <div>
      <h1 className="heading   text-2xl text-center  my-10 font-bold">Your Bus Logs</h1>

      {/* General Information Section */}
      <div className="mb-5 container mx-auto text-lg   flex flex-col gap-3">
        <p className='font-bold'><strong className='text-blue-600  rounded-lg p-2 m-2'>Enrollment : </strong><span className=" mx-2 "> {logs.enrollment || session?.user?.enrollment}</span></p>
        {/* <p className=''><strong className='text-blue-600  rounded-lg p-2 m-2'>RFID : </strong> <span className="bg-blue-600 p-2 rounded-lg mx-2 ">{logs.rfid || 'no records'}</span></p> */}
        <p className='font-bold'><strong className='text-blue-600  rounded-lg p-2 m-2'>Current Bus : </strong><span className=" mx-2 "> {logs.current||'You are not in a bus'}</span></p>
        <p className='font-bold'><strong className='text-blue-600  rounded-lg p-2 m-2'>Status : </strong> <span className="capitalize mx-2 ">{logs.status || 'no records'}</span></p>
      </div>

      {/* Table for Logs */}
      <div className="relative overflow-x-auto container mx-auto">
        <h2 className="text-lg   text-center my-2 font-bold">Your Logs History</h2>
        <table className="w-full text-sm text-left rtl:text-right ">
          <thead className="text-xs  uppercase  text-md">
            <tr className='border-2 text-lg font-bold text-md'>
              <th scope="col" className="px-6 py-3 text-md">Bus Number</th>
              <th scope="col" className="px-6 py-3 text-md">Boarding Date</th>
              <th scope="col" className="px-6 py-3 text-md">Boarding Time</th>
              <th scope="col" className="px-6 py-3 text-md">Leaving Date</th>
              <th scope="col" className="px-6 py-3 text-md">Leaving Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.logs && logs.logs.length > 0 ? (
              logs.logs.map((log, index) => (
                <tr key={index} className=" border-2">
                  <td className="px-6 py-4">{log.busno}</td>
                  <td className="px-6 py-4">{log.board.date}</td>
                  <td className="px-6 py-4">{log.board.time}</td>
                  <td className="px-6 py-4">{log.left.date}</td>
                  <td className="px-6 py-4">{log.left.time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">No logs available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsChild;
