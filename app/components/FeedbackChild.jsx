import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid'; // Importing uuid package
import { ToastContainer, toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast

const FeedbackChild = () => {
  const [feedback, setFeedback] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const { data: session } = useSession();

  // State for new feedback
  const [newFeedback, setNewFeedback] = useState({
    id: uuidv4(), // Generate a new UUID for the feedback
    user: session ? session.user.firstName : '', // Assuming the user's name is stored in the session
    text: '',
  });

  useEffect(() => {
    if (session) {
      setEnrollment(session.user.enrollment);
    }
  }, [session]);

  const fetchFeedback = async () => {
    if (enrollment) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/api/feedback`);
        const data = await response.json();
        setFeedback(data.result);
        console.log("data", data.result);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [enrollment]);

  useEffect(() => {
    console.log("feedback", feedback);
  }, [feedback]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFeedback({
      ...newFeedback,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFeedback),
      });

      if (response.ok) {
        // Show success toast
        toast.success('Feedback submitted successfully!');

        // Reset form after submission
        setNewFeedback({
          id: uuidv4(), // Generate a new UUID for the next feedback
          user: session ? session.user.firstName : '',
          text: '',
        });

        // Re-fetch feedback to include new feedback
        fetchFeedback();
      } else {
        // Show error toast
        toast.error('Error adding feedback: ' + response.statusText);
        console.error('Error adding feedback:', response.statusText);
      }
    } catch (error) {
      // Show error toast
      toast.error('Error adding feedback: ' + error.message);
      console.error('Error adding feedback:', error);
    }
  };

  return (
    <div className='h-[calc(100vh-3.5rem)] overflow-y-scroll pb-10 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-700'>
      <ToastContainer /> {/* Toast container to display notifications */}
      <h1 className="heading   text-2xl text-center my-10 font-bold">Feedbacks</h1>

      {/* Add Feedback Form */}
      <form onSubmit={handleSubmit} className="container mx-auto mb-10 p-4 border-2 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Add Feedback</h2>
        <div className="flex flex-col space-y-4">
          <textarea
            name="text"
            value={newFeedback.text}
            onChange={handleInputChange}
            placeholder="Enter your feedback..."
            required
            rows="4"
            className="p-2 rounded border bg-transparent border-gray-300 dark:border-gray-600  "
          />
          {/* Hidden input for UUID */}
          <input type="hidden" name="id" value={newFeedback.id} />
          <button
            type="submit"
            className="bg-blue-500  p-2 rounded hover:bg-blue-600"
          >
            Submit Feedback
          </button>
        </div>
      </form>

      {/* Cards for Feedback */}
      <div className="container mx-auto flex flex-col gap-5">
        {feedback && feedback.length > 0 ? (
          feedback.map((fb, index) => (
            <div key={index} className=" shadow-lg rounded-lg p-6 border dark:border-gray-700">
              {/* Feedback Details */}
              <div className="mb-4">
                <p className=" "><strong>Date:</strong> {fb.date}</p>
                <p className=" "><strong>Time:</strong> {fb.time}</p>
                <p className=" "><strong>User:</strong> {fb.user}</p>
                <p className=" "><strong>Feedback:</strong> {fb.text}</p>
              </div>

              {/* Admin Reply */}
              <div className="mt-4 p-4 rounded-lg bg-opacity-35 bg-slate-300">
                <h3 className="font-semibold text-md   mb-2">Admin Reply</h3>
                {fb.reply.reply ? (
                  <div>
                    <p className=" "><strong>Date:</strong> {fb.reply.reply.date}</p>
                    <p className=" "><strong>Time:</strong> {fb.reply.reply.time}</p>
                    <p className=" "><strong>Reply:</strong> {fb.reply.reply.text}</p>
                  </div>
                ) : (
                  <p className="">No reply</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center  ">No feedback available</p>
        )}
      </div>
    </div>
  );
};

export default FeedbackChild;
