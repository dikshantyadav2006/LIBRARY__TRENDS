import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import likedImage from "../../assets/images/liked.png";
import likeImage from "../../assets/images/like.png";
import defaultProfile from "../../assets/images/profile.jpg"; // Default image import

// ✅ Import your function (Rename it slightly to avoid confusion with the component)
import getProfileUrl from "../fetchProfilePicture/FetchProfilePicture";

// Initialize socket
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const socket = io(apiBaseUrl);

// ---------------------------------------------------------
// ✅ NEW WRAPPER COMPONENT: Handles your Async Function
// ---------------------------------------------------------
const UserAvatar = ({ userId }) => {
  const [imgSrc, setImgSrc] = useState(defaultProfile);

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      // Safety check: If userId is an object, extract _id
      const id = typeof userId === "object" ? userId?._id : userId;
      
      // Call your async function
      const url = await getProfileUrl(id);
      
      if (isMounted) {
        setImgSrc(url);
      }
    };

    fetchImage();

    return () => { isMounted = false; };
  }, [userId]);

  return <img src={imgSrc} alt="user" className="w-full h-full object-cover" />;
};
// ---------------------------------------------------------


const PostModal = ({ blog, loggedInUser, api, onClose }) => {
  const [currentBlog, setCurrentBlog] = useState(blog);
  const [comment, setComment] = useState("");

  useEffect(() => {
    setCurrentBlog(blog);
  }, [blog]);

  // ⚡ REAL-TIME SOCKET LISTENERS
  useEffect(() => {
    const handleLikeUpdate = (data) => {
      if (data._id === currentBlog._id) {
        setCurrentBlog((prev) => ({ ...prev, likes: data.likes }));
      }
    };

    const handleCommentUpdate = ({ blogId, comment }) => {
      if (blogId === currentBlog._id) {
        setCurrentBlog((prev) => ({
          ...prev,
          comments: [...prev.comments, comment],
        }));
      }
    };

    const handleReplyUpdate = ({ blogId, commentId, reply }) => {
      if (blogId === currentBlog._id) {
        setCurrentBlog((prev) => {
          const updatedComments = prev.comments.map((c) => {
            if (c._id === commentId) {
              return { ...c, replies: [...(c.replies || []), reply] };
            }
            return c;
          });
          return { ...prev, comments: updatedComments };
        });
      }
    };

    socket.on("blog:liked", handleLikeUpdate);
    socket.on("blog:comment-added", handleCommentUpdate);
    socket.on("blog:reply-added", handleReplyUpdate);

    return () => {
      socket.off("blog:liked", handleLikeUpdate);
      socket.off("blog:comment-added", handleCommentUpdate);
      socket.off("blog:reply-added", handleReplyUpdate);
    };
  }, [currentBlog._id]);

  // API Calls
  const handleLike = async () => {
    try {
      await fetch(`${api}/blogs/like/${currentBlog._id}/${loggedInUser._id}`, {
        method: "POST",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    try {
      await fetch(
        `${api}/blogs/comment/${currentBlog._id}/${loggedInUser._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: comment }),
        }
      );
      setComment("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 w-full max-w-5xl h-[85vh] rounded-xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-gray-800">
        
        {/* LEFT: FULL IMAGE */}
        <div className="flex-1 bg-black flex items-center justify-center relative">
          <img
            src={currentBlog.image}
            alt=""
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* RIGHT: DETAILS */}
        <div className="md:w-[400px] w-full flex flex-col bg-gray-900 border-l border-gray-800">
          
          {/* Header (Blog Author) */}
          <div className="p-4 border-b border-gray-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden shrink-0">
               {/* ✅ Use the Wrapper Component */}
               <UserAvatar userId={currentBlog.userId} />
            </div>
            <span className="font-semibold text-white">
              {currentBlog.userId?.username || "User"}
            </span>
          </div>

          {/* Comments list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            
            {/* Blog Description */}
            <div className="mb-4 text-sm text-gray-300">
              <span className="font-bold text-white mr-2">
                {currentBlog.userId?.username || "User"}
              </span>
              {currentBlog.description}
            </div>

            {/* Comments Loop */}
            {currentBlog.comments?.map((c) => (
              <div key={c._id} className="text-sm">
                <div className="flex gap-2">
                  {/* ✅ User Avatar for Commenter */}
                  <div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden shrink-0">
                    <UserAvatar userId={c.user} />
                  </div>

                  <div>
                    <span className="font-bold text-white mr-2">
                      {c.user?.username || "User"}
                    </span>
                    <span className="text-gray-300">{c.message}</span>

                    {/* Replies Loop */}
                    {c.replies?.length > 0 && (
                      <div className="mt-2 pl-2 border-l-2 border-gray-700 space-y-2">
                        {c.replies.map((r, i) => (
                          <div key={i} className="text-xs text-gray-400 flex gap-2 items-start">
                             {/* ✅ User Avatar for Replier */}
                             <div className="w-5 h-5 rounded-full bg-gray-800 overflow-hidden shrink-0 mt-0.5">
                                <UserAvatar userId={r.user} />
                             </div>
                             <div>
                                <span className="font-semibold text-gray-200 mr-1">
                                  {r.user?.username || "User"}
                                </span>
                                {r.message}
                             </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Like & Comment Input Section */}
          <div className="p-4 border-t border-gray-800 bg-gray-900">
            <div className="flex items-center gap-4 mb-3">
              <button
                onClick={handleLike}
                className="hover:scale-110 transition-transform"
              >
                <img
                  src={
                    currentBlog.likes?.includes(loggedInUser?._id)
                      ? likedImage
                      : likeImage
                  }
                  alt="like"
                  className="w-7 h-7"
                />
              </button>
              <span className="font-semibold text-white">
                {currentBlog.likes?.length || 0} likes
              </span>
            </div>

            <div className="flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-800 text-white p-2 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500"
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
              />
              <button
                onClick={handleComment}
                disabled={!comment.trim()}
                className="px-4 py-1 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-[60]"
      >
        ✕
      </button>
    </div>
  );
};

export default PostModal;