import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 

const DashboardChild = () => {
  const [buses, setBuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const router = useRouter();

  // Fetch bus data from the API
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/busdetails`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch bus data");
        }

        const data = await response.json();
        if (data && data.bus) {
          setBuses(data.bus);
          console.log(data.bus);
        } else {
          throw new Error("Unexpected response structure");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  // Filter buses based on the search term
  const filteredBuses = buses.filter((bus) => 
    bus.reg_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.bus_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle button click
  const handleClick = (e, reg_no) => {
    e.preventDefault();
    router.push(`/student/location/${reg_no}`);
  }

  return (
    <div className="p-4 my-10 h-[90vh] container mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Bus List</h1>
      
      {/* Search Box */}
      <input
        type="text"
        placeholder="Search buses by bus number, destination or Route"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 dark:border-2 border-4 bg-transparent border-blue-600 rounded"
      />

      {loading ? (
        <p>Loading buses...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex flex-row flex-wrap gap-6 justify-center items-center overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-700">
          {filteredBuses.length > 0 ? (
            filteredBuses.map((bus) => (
              <div key={bus.id} className="border-2 md:p-6 p-10 rounded shadow max-w-md">
                <h2 className="text-lg font-semibold">
                  <span className="bg-green-800 p-2 text-white rounded-lg">Registration Number: {bus.reg_no}</span>
                </h2>
                <br />
                <p className="capitalize text-lg">
                  <strong className="text-blue-700 font-bold mr-10">Bus No:</strong>
                  <span className="w-full">{bus.bus_no || 'Not set'}</span>
                </p>
                <p className="capitalize text-lg">
                  <strong className="text-blue-700 font-bold mr-10">Destination:</strong>
                  <span className="w-full">{bus.destination || 'Not set'}</span>
                </p>
                <p className="capitalize text-lg">
                  <strong className="text-blue-700 font-bold mr-10">Route:</strong>
                  <span className="w-full text-wrap text-red-700">{bus.route || 'Not set'}</span>
                </p>
                <p className="capitalize text-lg">
                  <strong className="text-blue-700 font-bold mr-10">Seat Count:</strong>
                  <span className="w-full">{bus.seatCount || 'Not set'}</span>
                </p>
                <p className="capitalize text-lg">
                  <strong className="text-blue-700 font-bold mr-10">People Count:</strong>
                  <span className="w-full">{bus.peopleCount || 'N/A'}</span>
                </p>
                <div className="flex items-center justify-center">
                  <button onClick={(e) => handleClick(e, bus.reg_no)} className="location p-2 bg-blue-600 text-white rounded-3xl mt-5">
                    View Location
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No buses found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardChild;
