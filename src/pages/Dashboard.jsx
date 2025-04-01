import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import ProfileUpload from "./ProfileUpload";
import profile from "../assets/images/profile.jpg";
import FetchProfilePicture from "../components/fetchProfilePicture/FetchProfilePicture";

const Dashboard = ({ loggedInUser, handleLogout, loading }) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [preview, setPreview] = useState(null);

  // ✅ Prevent returning before hooks
  if (loading) return <p>Loading...</p>;


  useEffect(() => {
    if (loggedInUser) {
      setUserId(loggedInUser._id);
      fetchProfilePic(loggedInUser._id); 
    }
  }, [loggedInUser]);

  const fetchProfilePic = async (id) => {
    if (!id) return;

    const profilePicture = await FetchProfilePicture(id);
    setPreview(profilePicture);
  };

  // 🔹 Helper function to convert ArrayBuffer to Base64

  return (
    <div className="p-6">
      {/* ✅ Move navigation logic inside return */}
      {!loggedInUser ? <Navigate to="/login" /> : null}

      {/* <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 rounded ml-2"
      >
        Logout
      </button> */}

      <div className="relative min-h-[75vh] md:h-[70vh] w-full overflow-hidden bg-red-400 flex justify-between items-center flex-col md:flex-row gap-4 rounded-[3vw] shadow-lg">
        <div className="left w-fit md:w-1/2 md:h-full bg-blue-400 flex justify-center items-center">
          <div className="UserImage rounded-t-full bg-gray-800 text-white p-2">
            {preview ? (
              <img
                className="rounded-full w-[70vw] sm:w-[40vw] md:w-[30vw] lg:w-[20vw] xl:w-[25vw] h-[70vw] sm:h-[40vw] md:h-[30vw] lg:h-[20vw] xl:h-[25vw] transform md:-translate-y-1/5 object-cover"
                src={preview}
                alt="User Profile"
              />
            ) : (
              <img
                className="rounded-full w-[70vw] sm:w-[40vw] md:w-[30vw] lg:w-[20vw] xl:w-[25vw] h-[70vw] sm:h-[40vw] md:h-[30vw] lg:h-[20vw] xl:h-[25vw] transform md:-translate-y-1/5 object-cover"
                src={profile}
                alt="User Profile"
              />
            )}
            <div className="username flex flex-col items-center justify-center text-center mt-4">
              <h2 className="text-2xl font-semibold capitalize font-[font1]">
                {loggedInUser?.fullname}
              </h2>
            </div>
          </div>
        </div>

        <div className="right w-fit md:w-1/2 md:h-full bg-blue-400 flex justify-center items-center flex-col">



          {loggedInUser?.isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="bg-green-500 text-white p-2 rounded"
            >
              Admin Dashboard
            </button>
          )}
          <button
            onClick={() => navigate(`/dashboard/edit-user/${userId}`)}
            className="bg-green-500 text-white p-2 rounded"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
