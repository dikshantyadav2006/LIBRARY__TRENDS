import { useState, useEffect } from "react";
import axios from "axios";
import FetchProfilePicture from "../fetchProfilePicture/FetchProfilePicture";
import { getUserData } from "../../utils/authApi";

const ProfileUpload = ({ userId, setLoggedInUser }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const api = import.meta.env.VITE_API_BASE_URL;

  // 🟢 Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🟢 Upload Image to Backend
  const uploadImage = async () => {
    if (!image) {
      setToast({ type: "error", message: "Please select an image first!" });
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", image);

    setLoading(true);
    try {
      await axios.post(`${api}/student/upload-profile/${userId}`, formData);

      // Success toast
      setToast({ type: "success", message: "Profile picture uploaded successfully!" });

      // Refetch full updated user data
      const userData = await getUserData();

      if (userData.data) {
        const updatedUser = {
          ...userData.data,
          profilePic: userData.data.profilePic, // Cloudinary URL
        };

        // Update logged-in user
        setLoggedInUser(updatedUser);
      }

      // Refresh profile preview
      fetchProfilePic();
    } catch (error) {
      setToast({ type: "error", message: "Upload failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Fetch Profile Picture
  const fetchProfilePic = async () => {
    if (!userId) return;

    const url = await FetchProfilePicture(userId);
    setLoggedInUser((prev) => ({ ...prev, profilePic: url }));
    setPreview(url);
  };

  // Fetch on userId update
  useEffect(() => {
    if (userId) fetchProfilePic();
  }, [userId]);

  // Auto hide toast after 3 sec
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="flex flex-col items-center p-5 bg-[--primary-light-color] dark:bg-[--primary-dark-color] rounded-lg shadow-md">
      
      <h2 className="text-lg font-bold mb-3">Upload Profile Picture</h2>

      {/* Profile Preview */}
      {preview ? (
        <img
          src={preview}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-3 border object-cover"
        />
      ) : (
        <p>No profile picture</p>
      )}

      {/* Upload Icon Button */}
      <label className="rounded-full transform hover:scale-105 -translate-y-[100%] p-1 cursor-pointer bg-[--secondary-light-color]">
        <img
          src="https://img.icons8.com/?size=512w&id=24717&format=png"
          alt="Upload"
          className="w-7"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Upload Button */}
      <button
        onClick={uploadImage}
        disabled={loading}
        className={`bg-blue-500 text-white px-4 py-2 rounded-md transition-opacity ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
        }`}
      >
        {loading ? (
          <span className="flex items-center space-x-2">
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span>Uploading...</span>
          </span>
        ) : (
          "Upload"
        )}
      </button>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default ProfileUpload;
