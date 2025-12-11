import React, { useState } from "react";
import UploadBlog from "./UploadBlog";
import BlogGrid from "./BlogGrid";
import PostModal from "./PostModal";

const api = import.meta.env.VITE_API_BASE_URL;

const Blogs = ({ loggedInUser }) => {
  const [activeBlog, setActiveBlog] = useState(null);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 max-w-5xl mx-auto flex justify-between">
        <h2 className="text-2xl font-semibold">Blogs</h2>
      </div>

      {/* Upload */}
      <div className="max-w-md mx-auto p-3">
        <UploadBlog
          loggedInUser={loggedInUser}
          api={api}
          // No onUploaded needed, Socket will update the Grid automatically
        />
      </div>

      {/* Blog Grid */}
      <BlogGrid
        api={api}
        onOpenPost={(b) => setActiveBlog(b)}
      />

      {/* Modal */}
      {activeBlog && (
        <PostModal
          blog={activeBlog}
          loggedInUser={loggedInUser}
          api={api}
          onClose={() => setActiveBlog(null)}
        />
      )}
    </div>
  );
};

export default Blogs;