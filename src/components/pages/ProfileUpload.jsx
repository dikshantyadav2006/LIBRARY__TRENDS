import { useState, useEffect } from "react";
import axios from "axios";
import FetchProfilePicture from "../fetchProfilePicture/FetchProfilePicture";

const ProfileUpload = ({ userId ,setLoggedInUser }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const api = import.meta.env.VITE_API_BASE_URL;

  // 🟢 Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show preview before upload
    }
  };

  // 🟢 Upload Image to Backend
  const uploadImage = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", image);

    try {
      await axios.post(`${api}/student/upload-profile/${userId}`, formData);
      alert("Profile picture uploaded successfully!");
      fetchProfilePic(); // Refresh image after upload
    
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  // 🟢 Fetch Profile Picture from Backend
  const fetchProfilePic = async () => {
    if (!userId) return; // Prevent fetching when userId is null
   
    const profilePic = await FetchProfilePicture(userId);
    setLoggedInUser(prevUser => ({...prevUser, profilePic: preview})); // Update loggedInUser with new profilePic
    setPreview(profilePic);
  };
  
  // 🔹 Helper function to convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };
  

  // ✅ Run useEffect only when `userId` is set
  useEffect(() => {
    if (userId) {
      fetchProfilePic();
    }
  }, [userId]); // ✅ This ensures the effect runs only when `userId` is updated

  return (
    <div className="flex flex-col items-center p-5 bg-[--primary-light-color] dark:bg-[--primary-dark-color]  rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-3">Upload Profile Picture</h2>

      {/* Display Image */}
      {preview ? (
        <img src={preview} alt="Profile" className="w-24 h-24 rounded-full mb-3 border object-cover" />
      ) : (
        <p>No profile picture</p>
      )}

      {/* Upload Button */}
      <label className=" rounded-full transform hover:scale-105 -translate-y-[100%] p-1 cursor-pointer bg-[--secondary-light-color] ">
        <img
        // edit this src to the upload icon you want to use
          src="https://img.icons8.com/?size=512w&id=24717&format=png"
          alt="Upload"
          className="w-7"
        />
        {/* Hidden File Input */}
         <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2 opacity-0 hidden" />

      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2 opacity-0 hidden" />
      </label>
      <button onClick={uploadImage} className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Upload
      </button>
    </div>
  );
};

export default ProfileUpload;
