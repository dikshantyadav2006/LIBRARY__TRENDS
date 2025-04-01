import { useState, useEffect } from "react";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  // ✅ Fetch feedback from backend
  useEffect(() => {
    fetch("http://localhost:5000/feedback")
      .then((res) => res.json())
      .then((data) => setFeedbacks(data))
      .catch((err) => console.error("Error fetching feedback:", err));
  }, []);

  // ✅ Submit feedback
  const submitFeedback = async () => {
    if (!feedback.trim()) return alert("Feedback cannot be empty");

    const response = await fetch("http://localhost:5000/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback }),
    });

    const data = await response.json();
    if (response.ok) {
      setFeedbacks([data, ...feedbacks]); // ✅ Add new feedback to list
      setFeedback("");
    } else {
      console.error("Error submitting feedback:", data);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold">Feedback</h2>
      <input
        type="text"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="w-full p-2 border"
        placeholder="Write your feedback..."
      />
      <button onClick={submitFeedback} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>
      <ul className="mt-4">
        {feedbacks.map((f, i) => (
          <li key={i} className="border-b p-2">{f.feedback}</li>
        ))}
      </ul>
    </div>
  );
};

export default Feedback;
