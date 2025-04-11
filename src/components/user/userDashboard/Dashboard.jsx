import { useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import profile from "../../../assets/images/profile.jpg";
import FetchProfilePicture from "../../fetchProfilePicture/FetchProfilePicture";

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

  return (
    <div className="p-6">
      {!loggedInUser ? <Navigate to="/login" /> : null}

      <div className="relative min-h-[75vh] w-full overflow-hidden bg-[--primary-light-color] dark:bg-[--primary-dark-color] flex justify-between items-center flex-col md:flex-row gap-4 rounded-[3vw] shadow-lg">
        <div className="left w-fit md:w-1/2 md:h-full flex justify-center items-center">
          <div className="UserImage rounded-t-full bg-gray-800 text-white p-2 mt-1">
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
            <div className="username flex flex-col items-center justify-center text-center mt-4 ">
              <h2 className="text-2xl font-semibold capitalize font-[font1]">
                {loggedInUser?.fullname}
              </h2>
              {loggedInUser?.isAdmin && (
                <button
                  onClick={() => navigate("/admin")}
                  className="bg-green-500 text-black  p-2 rounded-lg sm:hidden  mt-4 "
                >
                  Admin Dashboard
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="right w-fit md:w-1/2 md:h-full px-2 md:px-1 py-4 flex justify-between items-center flex-col">
          <div className="details">
            <div className="ussername flex justify-between  items-center w-full p-4 gap-5 ">
              
              <h1 className="text-2xl font-semibold capitalize font-[font1]  ">
                <span className="font-thin">{"@"}
                  </span>
                {loggedInUser?.username}
              </h1>
              <button
                onClick={() => navigate(`/dashboard/edit-user/${userId}`)}
                className="bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] px-2 py-1  rounded-lg hover:scale-95 font-thin text-[--dark-color] dark:text-[--light-color] golos-text-400 md:block hidden  "
              >
                Edit Profile
              </button>
            </div>
            <div className="bio p-2 md:p-1">
              {loggedInUser?.bio ? (
                <div className="bio bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] p-4 pt-6 mt-5 rounded-lg relative">
                  <h4 className="text-md font-semibold absolute -top-3 -left-2 bg-[--light-color] dark:bg-[--dark-color] py-1 px-2 rounded-full ">
                    Bio
                  </h4>
                  <p className="text-sm  pt-2 ">{loggedInUser?.bio}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">No bio available</p>
              )}
            </div>
            <div className="detail bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] p-4 pt-6 mt-5 rounded-lg relative">
              <h4 className="text-md font-semibold absolute -top-3 -left-2 bg-[--light-color] dark:bg-[--dark-color] py-1 px-2 rounded-full ">
                Details
              </h4>
              <p>Id : {loggedInUser?._id}</p>
              <p>Email : {loggedInUser?.gmail}</p>
              <p>Mobile : {loggedInUser?.mobile}</p>
              <p>Address : {loggedInUser?.address}</p>
            </div>
            <div className="bg-[--secondary-light-color] md:hidden dark:bg-[--secondary-dark-color] p-4 pt-6 mt-5 rounded-lg relative flex justify-center items-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-2 py-1  rounded-lg hover:scale-95 font-thin "
              >
                Logout
              </button>
              <button
                onClick={() => navigate(`/dashboard/edit-user/${userId}`)}
                className="bg-[--primary-light-color] dark:bg-[--primary-dark-color] px-2 py-1  rounded-lg hover:scale-95 font-thin text-[--dark-color] dark:text-[--light-color] golos-text-400"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/*     */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
