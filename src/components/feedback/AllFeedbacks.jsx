import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import feedbackApi from "./feedbackApi";
import likedImage from "../../assets/images/liked.png";
import likeImage from "../../assets/images/like.png";
import defaultProfile from "../../assets/images/profile.jpg";
import getProfileUrl from "../fetchProfilePicture/FetchProfilePicture";

const api = import.meta.env.VITE_API_BASE_URL;

const socket = io(api); // Update with your server URL
const InlineAvatar = ({ user }) => {
  const [img, setImg] = useState(defaultProfile);
  const [showPreview, setShowPreview] = useState(false);
  const timerRef = React.useRef(null);

  useEffect(() => {
    const id = typeof user === "object" ? user?._id : user;
    if (!id) return;

    getProfileUrl(id).then(setImg);
  }, [user]);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setShowPreview(true);
    }, 100); // ⏱️ 1 second delay
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setShowPreview(false);
  };

  return (
    <span
      className="relative inline-block mr-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* SMALL AVATAR */}
     <div className="
  inline-block p-[2px] rounded-full
  bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
  bg-[length:200%_200%]
  animate-gradientMove
  hover:scale-110 hover:shadow-[0_0_18px_rgba(168,85,247,0.8)]
  transition-all duration-300
">
  <img
    src={img}
    alt="user"
    className="w-10 h-10 rounded-full object-cover bg-black cursor-pointer"
  />
</div>


      {/* HOVER PREVIEW */}
     {showPreview && (
  <div
    className="
      absolute z-50 top-9 left-0
      bg-black/70 p-2 rounded-xl shadow-2xl
      backdrop-blur-sm
      animate-previewIn
      origin-top-left
    "
  >
    <img
      src={img}
      alt="preview"
      className="
        object-contain
        max-h-[60vh]
        max-w-[90vw]
        md:max-h-[50vh]
        md:max-w-[420px]
        rounded-lg
      "
    />
  </div>
)}

    </span>
  );
};

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
  
  if (loading) return <FeedbackSkeleton/>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      {feedbacks.map((feedback, idx) => (
        <div
          key={feedback._id}
          className="
  group relative
  bg-[--primary-light-color] dark:bg-[--primary-dark-color]
  text-[--primary-dark-color] dark:text-[--primary-light-color]
  rounded-2xl p-5 border border-gray-200
  shadow-md
  transition-shadow duration-300
  hover:shadow-2xl
"

          style={{ animationDelay: `${idx * 60}ms` }}
        >
          {/* TOP ROW */}
          <div className="flex items-center justify-between">
            {/* USER */}
            <div className="flex items-center gap-2 group">
              <InlineAvatar user={feedback.user} />

              <span
                className="
                  text-lg font-semibold
                  text-blue-700 dark:text-blue-400
                  transition-all duration-300
                  group-hover:tracking-wide
                  group-hover:text-purple-600 -translate-y-1/4
                "
              >
                {feedback.user?.username || "Anonymous"}
              </span>
            </div>

            {/* LIKE */}
            <button
              onClick={() => handleLike(feedback._id)}
              disabled={feedback.user?._id === loggedInUser?._id}
              className="
                flex items-center gap-1 text-sm
                transition-transform duration-200
                hover:scale-110
                active:scale-95
              "
            >
              <img
                src={
                  feedback.likes.includes(loggedInUser?._id)
                    ? likedImage
                    : likeImage
                }
                alt="like"
                className="w-5 h-5"
              />
              <span className="font-medium">{feedback.likes.length}</span>
            </button>
          </div>

          {/* MESSAGE */}
          <p
            className="
              mt-2 text-sm leading-relaxed
              transition-all duration-300
              group-hover:translate-x-1
            "
          >
            {feedback.message}
          </p>

          {/* COMMENT TOGGLE */}
          <button
            onClick={() =>
              setActiveComment(
                activeComment === feedback._id ? null : feedback._id
              )
            }
            className="
              mt-3 text-sm flex items-center gap-1
              text-gray-500
              transition-all duration-200
              hover:text-purple-600 hover:translate-x-1
            "
          >
            💬 Comments ({feedback.comments?.length || 0})
          </button>

          {/* COMMENTS */}
          {activeComment === feedback._id && (
            <div className="mt-4 space-y-4 animate-previewIn">
              {feedback.comments?.map((c) => (
                <div
                  key={c._id}
                  className="
                    ml-4 pl-3 border-l
                    transition-all duration-300
                    hover:border-purple-400
                  "
                >
                  {/* COMMENT USER */}
                  <div className="flex items-center gap-2 font-medium group">
                    <InlineAvatar user={c.user} />
                    <span className="transition group-hover:text-blue-600">
                      {c.user?.username || "user"}
                    </span>
                  </div>

                  {/* COMMENT TEXT */}
                  <p className="text-sm mt-1">{c.message}</p>

                  {/* REPLIES */}
                  {c.replies?.map((r, i) => (
                    <div
                      key={i}
                      className="
                        ml-4 mt-1 text-xs
                        text-gray-600 dark:text-[--secondry-light-color]
                        transition-all duration-200
                        hover:translate-x-1 hover:text-purple-500
                      "
                    >
                      ↪ <InlineAvatar user={r.user} />
                      <span className="ml-1 font-medium">
                        {r.user?.username || "user"}
                      </span>
                      : {r.message}
                    </div>
                  ))}

                  {/* REPLY BUTTON */}
                  <button
                    onClick={() =>
                      setReplyToggles({
                        ...replyToggles,
                        [c._id]: !replyToggles[c._id],
                      })
                    }
                    className="
                      mt-1 text-xs text-blue-500
                      transition hover:underline hover:tracking-wide
                    "
                  >
                    ↩ Reply
                  </button>

                  {/* REPLY INPUT */}
                  {replyToggles[c._id] && (
                    <div className="mt-2 ml-4 animate-previewIn">
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
                        className="
                          w-full border rounded-md p-1
                          text-xs text-black
                          focus:ring-2 focus:ring-purple-400
                        "
                      />
                      <button
                        onClick={() =>
                          handleReplySubmit(feedback._id, c._id)
                        }
                        className="
                          mt-1 px-2 py-0.5 text-xs
                          bg-green-600 text-white rounded
                          transition hover:bg-green-700 hover:scale-105
                        "
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* ADD COMMENT */}
              <div className="ml-4 animate-previewIn">
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
                  className="
                    w-full border rounded-md p-2
                    text-sm text-black
                    focus:ring-2 focus:ring-blue-400
                  "
                />
                <button
                  onClick={() => handleCommentSubmit(feedback._id)}
                  className="
                    mt-1 px-3 py-1 text-sm
                    bg-blue-600 text-white rounded
                    transition-all hover:bg-blue-700 hover:scale-105
                  "
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


// FeedbackSkeleton.jsx or wherever you define it
const FeedbackSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      {[...Array(3)].map((_, idx) => (
        <div
          key={idx}
          className="bg-[--primary-light-color] dark:bg-[--primary-dark-color] text-[--primary-dark-color] dark:text-[--primary-light-color] shadow rounded-xl p-5 border border-gray-200 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-300 rounded w-32"></div>
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
              <div className="h-3 bg-gray-300 rounded w-6"></div>
            </div>
          </div>

          <div className="mt-3 h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="mt-2 h-4 bg-gray-300 rounded w-4/6"></div>

          <div className="mt-3 h-3 bg-gray-300 rounded w-32"></div>

          <div className="mt-4 space-y-3">
            {[...Array(2)].map((_, cIdx) => (
              <div key={cIdx} className="ml-4 text-sm border-l pl-2 pb-3">
                <div className="h-3 bg-gray-300 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>

                <div className="ml-4 mt-2 space-y-1">
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                </div>

                <div className="h-3 bg-gray-300 rounded w-16 mt-2"></div>

                <div className="mt-2 ml-4">
                  <div className="h-6 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-6 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            ))}

            <div className="ml-4">
              <div className="h-10 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-6 bg-gray-300 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllFeedbacks;
