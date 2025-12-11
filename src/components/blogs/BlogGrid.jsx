import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Initialize socket outside component to prevent multiple connections
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const socket = io(apiBaseUrl); 

const BlogGrid = ({ api, onOpenPost }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      // Don't set loading to true here to avoid flickering on real-time updates
      const res = await fetch(`${api}/blogs`);
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
      console.log(data)
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();

    // ------------------------------------
    // ⚡ REAL-TIME SOCKET LISTENERS
    // ------------------------------------
    socket.on("blog:new", () => fetchBlogs());
    socket.on("blog:liked", () => fetchBlogs());
    socket.on("blog:comment-added", () => fetchBlogs());
    socket.on("blog:reply-added", () => fetchBlogs());

    // Cleanup listeners on unmount
    return () => {
      socket.off("blog:new");
      socket.off("blog:liked");
      socket.off("blog:comment-added");
      socket.off("blog:reply-added");
    };
  }, [api]);

  if (loading) {
    return <div className="text-white text-center p-10">Loading...</div>;
  }

  return (
    <div className="p-2 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
      {blogs.map((b) => (
        <div
          key={b._id}
          className="break-inside-avoid mb-3 bg-black rounded-lg overflow-hidden cursor-pointer shadow-lg hover:opacity-90 transition-opacity relative group"
          onClick={() => onOpenPost(b)}
        >
          {/* Image Container */}
          <div className="w-full relative">
            <img
              src={b.image}
              alt="post"
              className="w-full h-auto block"
              loading="lazy"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
          </div>

          {/* Like & Comments Bar */}
          <div className="p-2 flex items-center justify-between text-white text-xs sm:text-sm bg-gray-900/90 backdrop-blur-sm">
            <div className="flex items-center gap-1">
              <span>❤️</span> <span>{b.likes?.length || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>💬</span> <span>{b.comments?.length || 0}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogGrid;