import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const FeeChild = () => {
  const [fees, setFees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const enrollment = session.user.enrollment;

  // Fetch fee data from the API
  useEffect(() => {
    const fetchFees = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/feedetails`, {
          method: 'POST', // Specify the method
          headers: {
            'Content-Type': 'application/json', // Set the content type to JSON
          },
          body: JSON.stringify({ enrollment }), // Send enrollment data
        });

        if (!response.ok) {
          throw new Error("Failed to fetch fee data");
        }

        const data = await response.json();
        setFees(data.fee);
        console.log(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, [enrollment]); // Add enrollment as a dependency to fetch new data when it changes

  // Filter fees based on the search term
  const filteredFees = fees.filter((fee) =>
    fee.enrollment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fee.rfid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 h-[90vh] container mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center text-white">Fee Details</h1>

      {/* Search Box */}
      

      {loading ? (
        <p>Loading fee details...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-4 h-[calc(100vh-12rem)] flex flex-row flex-wrap  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-700">
          {filteredFees.length > 0 ? (
            filteredFees.map((fee) => (
              <div key={fee.id} className="border w-full md:min-w-md md:max-w-md  p-4 rounded shadow">
                <h2 className="text-lg font-semibold dark:text-white">
                  <span className="bg-green-600 p-2 rounded-lg">Enrollment: {fee.enrollment}</span>
                </h2>
                <br />
                <p className="dark:text-white my-5">
                  <strong className="dark:text-white mr-10 bg-blue-500 p-2 rounded-lg">RFID:</strong>
                  <span className="border-2 py-2 w-full px-10 rounded-lg">{fee.rfid || 'Not set'}</span>
                </p>
                <p className="dark:text-white capitalize my-5">
                  <strong className="dark:text-white mr-10 bg-blue-500 p-2 rounded-lg">Amount:</strong>
                  <span className="border-2 py-2 w-full px-10 rounded-lg">{fee.amount || 'N/A'}</span>
                </p>
                <p className="dark:text-white capitalize my-5">
                  <strong className="dark:text-white mr-10 bg-blue-500 p-2 rounded-lg">Transaction ID:</strong>
                  <span className="border-2 py-2 w-full px-10 rounded-lg">{fee.transactionId || 'Not set'}</span>
                </p>
                <p className="dark:text-white capitalize my-5">
                  <strong className="dark:text-white mr-10 bg-blue-500 p-2 rounded-lg">Payment Method:</strong>
                  <span className="border-2 py-2 w-full px-10 rounded-lg">{fee.method || 'Not set'}</span>
                </p>
                <p className="dark:text-white capitalize my-5">
                  <strong className="dark:text-white mr-10 bg-blue-500 p-2 rounded-lg">Status:</strong>
                  <span className="border-2 py-2 w-full px-10 rounded-lg">{fee.status || 'N/A'}</span>
                </p>
                <p className="dark:text-white capitalize my-5">
                  <strong className="dark:text-white mr-10 bg-blue-500 p-2 rounded-lg">Date:</strong>
                  <span className="border-2 py-2 w-full px-10 rounded-lg">{fee.date || 'Not set'}</span>
                </p>
                <p className="dark:text-white capitalize my-5">
                  <strong className="dark:text-white mr-10 bg-blue-500 p-2 rounded-lg">Session:</strong>
                  <span className="border-2 py-2 w-full px-10 rounded-lg">{fee.session || 'Not set'}</span>
                </p>
                <p className="dark:text-white capitalize my-5">
                  <strong className="dark:text-white mr-10 bg-blue-500 p-2 rounded-lg">Branch:</strong>
                  <span className="border-2 py-2 w-full px-10 rounded-lg uppercase">{fee.branch || 'Not set'}</span>
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No fee records found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FeeChild;
