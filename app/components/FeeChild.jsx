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

        if (response.status===404) {
          throw new Error("No Data available for this enrollment");
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
    <div className="p-4 overflow-auto my-10 h-[calc(90vh-2.5rem)] container mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center ">Fee Details</h1>

      {/* Search Box */}
      

      {loading ? (
        <p>Loading fee details...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-4 flex flex-row flex-wrap items-center justify-center overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-700">
          {filteredFees.length > 0 ? (
            filteredFees.map((fee) => (
              <div key={fee.id} className="border flex flex-col gap-2 p-6 rounded shadow">
                <h2 className="text-lg font-semibold ">
                  <span className="bg-green-600 text-white p-2 rounded-lg">Enrollment: {fee.enrollment}</span>
                </h2>
                <br />
               
                <p className="capitalize ">
                  <strong className="mr-10 text-blue-600">Amount:</strong>
                  <span className=" w-full ">Rs. {fee.amount || 'N/A'}</span>
                </p>
                <p className="capitalize ">
                  <strong className="mr-10 text-blue-600">Transaction ID:</strong>
                  <span className=" w-full ">{fee.transactionId || 'Not set'}</span>
                </p>
                <p className="capitalize ">
                  <strong className="mr-10 text-blue-600">Payment Method:</strong>
                  <span className=" w-full ">{fee.method || 'Not set'}</span>
                </p>
                <p className="capitalize ">
                  <strong className="mr-10 text-blue-600">Status:</strong>
                  <span className=" w-full ">{fee.status || 'N/A'}</span>
                </p>
                <p className="capitalize ">
                  <strong className="mr-10 text-blue-600">Date:</strong>
                  <span className=" w-full ">{fee.date || 'Not set'}</span>
                </p>
                <p className="capitalize ">
                  <strong className="mr-10 text-blue-600">Session:</strong>
                  <span className=" w-full ">{fee.session || 'Not set'}</span>
                </p>
                <p className="capitalize ">
                  <strong className="mr-10 text-blue-600">Branch:</strong>
                  <span className=" w-full  uppercase">{fee.branch || 'Not set'}</span>
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
