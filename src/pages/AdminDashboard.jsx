import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profile from "../assets/images/profile.jpg";
import axios from "axios";
import FetchProfilePicture from "../components/fetchProfilePicture/FetchProfilePicture";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/users", {
          withCredentials: true,
        });
        console.log("Fetched users:", res.data);
        // Fetch profile pictures after getting users
        const usersWithPics = await Promise.all(
          res.data.map(async (user) => {
            const profilePic = await FetchProfilePicture(user._id);
            return { ...user, profilePic };
          })
        );

        setUsers(usersWithPics);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="allUsers">
        <h1 className="text-2xl font-bold mb-4 text-center">All Users</h1>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="p-2 hover:scale-110 bg-[--primary-light-color] rounded-md dark:bg-[--primary-dark-color]  cursor-pointer transition duration-400 w-[100%] md:w-[40%] lg:w-[30%] xl:w-[20%] h-[50vw] md:h-[40vw] lg:h-[30vw] xl:h-[20vw] text-center flex flex-col items-center justify-between bg-[#F2F2F2] text-[--dark-color] dark:bg-[#1d1e20] dark:text-[--light-color] shadow-lg hover:shadow-xl relative overflow-hidden"
              onClick={() => navigate(`/admin/user/${user._id}`)}
            >
              {user.isAdmin && (
                <div className="text-m text-gray-500 absolute top-0 right-0 bg-green-500 px-2">
                  Admin
                </div>
              )}
              <div className="img w-full min-h-[50%] h-fit relative flex items-center justify-center rounded-full overflow-hidden">
                <div className="img w-[25vw] md:w-[20vw] lg:w-[15vw] xl:w-[10vw] h-[25vw] md:h-[20vw] lg:h-[15vw] xl:h-[10vw]  flex items-center justify-center bg-gray-800 p-1 rounded-full">
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={
                      
                      user.profilePic || profile}
                    alt="User"
                  />
                </div>
              </div>
              <div className="info w-full h-fit flex flex-col items-start justify-center p-2 rounded-b-lg pl-3">
                <h3 className="text-m font-semibold mb-1 capitalize">
                  Name: {user.fullname}
                </h3>
                <p className="text-xs text-gray-500">Username: {user.username}</p>
                <p className="text-xs text-gray-500">Mobile: {user.mobile}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
