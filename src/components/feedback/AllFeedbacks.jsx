import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import feedbackApi from "./feedbackApi";
import likedImage from "../../assets/images/liked.png";
import likeImage from "../../assets/images/like.png";
const api = import.meta.env.VITE_API_BASE_URL;

const socket = io(api); // Update with your server URL

const AllFeedbacks = ({ loggedInUser }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeComment, setActiveComment] = useState(null);
  const [newComments, setNewComments] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [replyToggles, setReplyToggles] = useState({});

  const fetchFeedbacks = async () => {
    try {
      const data = await feedbackApi.getAllFeedbacks();
      setFeedbacks(data);
      console.log("Feedbacks loaded:", data);
    } catch (err) {
      console.error("Error loading feedbacks:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      await feedbackApi.toggleLike(id);
     
    } catch (err) {
      console.error("Like error:", err.message);
    }
  };

  const handleCommentSubmit = async (feedbackId) => {
    const message = newComments[feedbackId];
    if (!message) return;

    try {
      await feedbackApi.addComment(feedbackId, message);
      setNewComments({ ...newComments, [feedbackId]: "" });
      
    } catch (err) {
      console.error("Comment error:", err.message);
    }
  };

  const handleReplySubmit = async (feedbackId, commentId) => {
    const message = replyInputs[commentId];
    if (!message) return;

    try {
      await feedbackApi.addReply(feedbackId, commentId, message);
      setReplyInputs({ ...replyInputs, [commentId]: "" });
     
    } catch (err) {
      console.error("Reply error:", err.message);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  
    // Socket listeners for real-time updates
    socket.on("feedback:new", () => fetchFeedbacks());
    socket.on("feedback:liked", () => fetchFeedbacks());
    socket.on("feedback:comment-added", () => fetchFeedbacks());
    socket.on("feedback:reply-added", () => fetchFeedbacks());
    socket.on("feedback:status-change", () => fetchFeedbacks());
    socket.on("feedback:deleted", () => fetchFeedbacks());
  
    return () => {
      socket.off("feedback:new");
      socket.off("feedback:liked");
      socket.off("feedback:comment-added");
      socket.off("feedback:reply-added");
      socket.off("feedback:status-change");
      socket.off("feedback:deleted");
    };
  }, []);
  
  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      {feedbacks.map((feedback) => (
        <div
          key={feedback._id}
          className="bg-[--primary-light-color] dark:bg-[--primary-dark-color] text-[--primary-dark-color] dark:text-[--primary-light-color]  shadow rounded-xl p-5 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-blue-700">
              @{feedback.user?.username || "Anonymous"}
            </h3>
            <button
              onClick={() => handleLike(feedback._id)}
              disabled={feedback.user?._id === loggedInUser?._id}
              className="text-sm  hover:underline flex items-center gap-1"
            >
              <img
                src={feedback.likes.includes(loggedInUser?._id) ? likedImage : likeImage}
                alt="like"
                className="w-5 h-5"
              />
              {feedback.likes.length}
            </button>
          </div>

          <p className="mt-2 ">{feedback.message}</p>

          <button
            onClick={() =>
              setActiveComment(activeComment === feedback._id ? null : feedback._id)
            }
            className="text-sm mt-3 text-gray-500 hover:text-gray-700 dark:hover:text-[--secondry-light-color]"
          >
            💬 Comments ({feedback.comments?.length || 0})
          </button>

          {activeComment === feedback._id && (
            <div className="mt-4 space-y-3">
              {feedback.comments?.map((c) => (
                <div key={c._id} className="ml-4 text-sm border-l pl-2 pb-3">
                  <div className="font-medium">@{c.user?.username || "user"}</div>
                  <div>{c.message}</div>

                  {c.replies?.map((r, i) => (
                    <div
                      key={i}
                      className="ml-4 mt-1 text-xs text-gray-600 dark:text-[--secondry-light-color]"
                    >
                      ↪ @{r.user?.username || "user"}: {r.message}
                    </div>
                  ))}

                  <button
                    onClick={() =>
                      setReplyToggles({
                        ...replyToggles,
                        [c._id]: !replyToggles[c._id],
                      })
                    }
                    className="text-xs mt-1 text-blue-500 hover:underline"
                  >
                    ↩ Reply
                  </button>

                  {replyToggles[c._id] && (
                    <div className="mt-2 ml-4">
                      <textarea
                         maxLength="300"
                        rows="1"
                        placeholder="Write a reply..."
                        value={replyInputs[c._id] || ""}
                        onChange={(e) =>
                          setReplyInputs({
                            ...replyInputs,
                            [c._id]: e.target.value,
                          })
                        }
                        className="w-full border rounded-md p-1 text-xs text-black"
                      />
                      <button
                        onClick={() => handleReplySubmit(feedback._id, c._id)}
                        className="mt-1 px-2 py-0.5 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <div className="ml-4">
                <textarea
                 maxLength="300"
                  rows="2"
                  placeholder="Write a comment..."
                  value={newComments[feedback._id] || ""}
                  onChange={(e) =>
                    setNewComments({
                      ...newComments,
                      [feedback._id]: e.target.value,
                    })
                  }
                  className="w-full border rounded-md p-2 text-sm text-black"
                />
                <button
                  onClick={() => handleCommentSubmit(feedback._id)}
                  className="mt-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AllFeedbacks;
