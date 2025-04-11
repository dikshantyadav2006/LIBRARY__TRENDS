import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FetchProfilePicture from "../../fetchProfilePicture/FetchProfilePicture";

const AddStudent = ({ loggedInUser }) => {
  const { userID } = useParams();
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);

  const [user, setUser] = useState(null);
  const [isStudent, setIsStudent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const api = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(
          `${api}/admin/user/${userID}`,
          { withCredentials: true }
        );
        setUser(res.data.user);
        setIsStudent(res.data.student !== null); // Fixing case issue
        const profilePic = await FetchProfilePicture(userID);
        setProfilePic(profilePic);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userID]);

  const handleAddStudent = async () => {
    try {
      const res = await axios.post(
        `${api}/admin/user/${userID}/add-student`,
        {}, // No need to send body since userID is in URL
        { withCredentials: true }
      );

      if (res.data.success) {
        setMessage("Student added successfully!");
        navigate(-1);
        setIsStudent(true);
      } else {
        setMessage(res.data.message);
      }
    } catch (error) {
      console.error("Error adding student:", error);
      setMessage("Error adding student.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-[70vh] flex justify-center items-center">
      <div className="p-6 max-w-md mx-auto shadow-lg rounded-lg bg-[--primary-light-color] dark:bg-[--primary-dark-color]">
        <h2 className="text-2xl font-bold mb-4 uppercase">confirm student</h2>

        <div className="w-[100px] h-[100px] mx-auto rounded-full overflow-hidden mb-4 bg-[--primary-light-color] dark:bg-[--primary-dark-color]">
          <img className="w-full h-full object-cover" src={profilePic} alt="" />
        </div>
        <p>Name: {user?.fullname}</p>
        <p>Mobile: {user?.mobile}</p>

        {isStudent ? (
          <p className="text-green-500 mt-4">This user is already a student.</p>
        ) : (
          <button
            onClick={handleAddStudent}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Add Student
          </button>
        )}

        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default AddStudent;
