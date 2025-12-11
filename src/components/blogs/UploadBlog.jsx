import React, { useState } from "react";

const UploadBlog = ({ loggedInUser, api }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!loggedInUser) return alert("Please login!");
    if (!file || !title.trim() || !description.trim())
      return alert("Title, description and image required!");

    setUploading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      form.append("title", title);
      form.append("description", description);

      const res = await fetch(`${api}/blogs/create/${loggedInUser._id}`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (res.ok) {
        // Clear Form
        setFile(null);
        setPreview(null);
        setTitle("");
        setDescription("");
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
  };

  return (
    <div className="relative p-6 bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl overflow-hidden group">
      {/* Background decoration glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full pointer-events-none"></div>
      
      <h3 className="relative font-bold text-2xl mb-6 text-white tracking-wide">
        Create New <span className="text-blue-500">Post</span>
      </h3>

      {/* Input Fields Container */}
      <div className="space-y-4 relative z-10">
        
        {/* Title Input */}
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase ml-1 mb-1 block">Title</label>
          <input
            type="text"
            placeholder="Give your blog a catchy title..."
            className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description Input */}
        <div>
           <label className="text-xs font-semibold text-gray-400 uppercase ml-1 mb-1 block">Description</label>
          <textarea
            placeholder="What's on your mind?"
            rows="3"
            className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Custom Image Upload Area */}
        <div className="relative group/image">
          <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            onChange={handleFileChange} 
            accept="image/*"
          />
          
          <label 
            htmlFor="file-upload" 
            className={`cursor-pointer flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-all duration-300 overflow-hidden relative
              ${preview ? 'border-blue-500/50 bg-gray-800' : 'border-gray-600 bg-gray-800/30 hover:bg-gray-800 hover:border-gray-500'}
            `}
          >
            {preview ? (
              <>
                <img src={preview} className="w-full h-full object-cover opacity-80 group-hover/image:opacity-100 transition-opacity" alt="Preview" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity">
                   <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">Change Image</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                {/* Upload Icon SVG */}
                <svg className="w-10 h-10 mb-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="text-sm font-medium">Click to upload image</p>
                <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF</p>
              </div>
            )}
          </label>
        </div>

        {/* MST Button */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full relative py-3.5 px-6 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all duration-200 
            ${uploading 
              ? 'bg-gray-600 cursor-not-allowed opacity-70' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 hover:scale-[1.02] hover:shadow-blue-500/25 active:scale-95'
            }
          `}
        >
          {uploading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Posting...
            </div>
          ) : (
            "🚀 Publish Post"
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadBlog;