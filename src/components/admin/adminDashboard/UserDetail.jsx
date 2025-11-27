import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FetchProfilePicture from "../../fetchProfilePicture/FetchProfilePicture";

const UserDetail = () => {
  const { userID } = useParams();

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setprofilePicture] = useState(null);
  const api = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(
          `${api}/admin/user/${userID}`,
          { withCredentials: true }
        );
        setUser(res.data.user);
        if (res.data.user) {
          const profilePic = await FetchProfilePicture(res.data.user._id);
          if (profilePic) {
            setprofilePicture(profilePic);
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [userID]);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="p-6 flex  flex-col  justify-center items-center">

      <div className="mb-5">

     
      <div className="w-[100px] h-[100px] mx-auto rounded-full overflow-hidden mb-4 bg-[--primary-light-color] dark:bg-[--primary-dark-color] p-1 bg-gray-900">
        <img
          className="w-full h-full object-cover rounded-full"
          src={profilePicture}
          alt=""
        />
       
      </div>
      <div className="text-center ">
          <h2 className="text-2xl font-bold capitalize">
            <span className="font-semibold"></span> {user.fullname}
          </h2>
         
        
        </div>
      </div>
      <div className="div flex md:flex-row flex-col gap-4">
        {user ? (
          <div className="bg-[--primary-light-color] dark:bg-[--primary-dark-color] p-7 rounded-lg mt-2 relative flex flex-col items-start justify-center gap-2">
            <h4 className="text-xl text-nowrap font-bold absolute transform -translate-y-[50%] -translate-x-[50%] bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] px-4 py-1 rounded-full top-0 left-1/2">
              User Details
            </h4>
            <h2 className="text-xl font-normal">
              <span className="font-normal text-xl">Username:</span> {user.username}
            </h2>
            <p>User ID: {user._id}</p>
            <p>Mobile: {user.mobile}</p>
            <p>Email: {user.gmail}</p>
            <address>Address: {user.address}</address>
            <p>Gender: {user.gender}</p>
            <p>
              Signup Date:{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <p>
              Last Updated:{" "}
              {isNaN(new Date(user.createdAt).getTime())
                ? new Date(user.updatedAt).toLocaleDateString()
                : new Date(user.createdAt).toLocaleDateString()}
            </p>
            <button
              onClick={() => navigate(`/dashboard/edit-user/${user._id}`)}
              className="bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] px-4 py-2 rounded-lg hover:scale-95 font-thin text-[--dark-color] dark:text-[--light-color] golos-text-400"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <p>User not found.</p>
        )}
      </div>
    </div>
  );
};
const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col gap-4 w-full p-6 rounded-lg bg-[--primary-light-color] dark:bg-[--primary-dark-color]">
      {/* Profile image skeleton */}
      <div className="w-20 h-20 rounded-full bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] mx-auto" />

      {/* Name line */}
      <div className="h-4 w-1/4 mx-auto rounded bg-[--secondary-light-color] dark:bg-[--secondary-dark-color]" />

      {/* Multiple lines for user info */}
      <div className=" mt-4 flex justify-center items-center gap-2 md:flex-row flex-col">
        <div className="h-[35vh] md:h-[60vh] w-[40%] rounded bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] " />
        <div className=" h-[35vh] md:h-[60vh] w-[40%] rounded bg-[--secondary-light-color] dark:bg-[--secondary-dark-color]" />
      </div>

      {/* Button skeleton */}
    </div>
  );
};


export default UserDetail;
