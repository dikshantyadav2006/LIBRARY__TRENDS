import React, { useState } from "react";
import feedbackApi from "./feedbackApi";

const SubmitFeedbackCard = ({user}) => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const res = await feedbackApi.submitFeedback(message);
      setStatus({ success: true, msg: res.message });
      setMessage("");
    } catch (err) {
      setStatus({
        success: false,
        msg: err.response?.data?.error || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 bg-[--primary-light-color] dark:bg-[--primary-dark-color] shadow-lg rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-4">Submit Your Feedback</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full p-3 border bg-[--secondary-light-color] dark:bg-[--secondary-dark-color]   rounded-xl resize-none focus:outline-none focus:ring-0 focus:bg-[--light-color] dark:focus:bg-[--primary-light-color] text-black  "
          placeholder="Write your feedback here..."
           maxLength="300"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>

      {status && (
        <div
          className={`mt-4 p-3 rounded-xl text-sm ${
            status.success
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status.msg}
        </div>
      )}
    </div>
  );
};

export default SubmitFeedbackCard;
