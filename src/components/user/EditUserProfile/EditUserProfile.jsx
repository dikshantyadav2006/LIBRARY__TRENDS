import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileUpload from "../../pages/ProfileUpload";

const EditUserProfile = ({setLoggedInUser,loggedInUser}) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_BASE_URL;

  const [user, setUser] = useState({
    fullname: "",
    mobile: "",
    username: "",
    bio: "",
    gender: "not available",
    gmail: "",
    address: "",
    showProfilePicture:false,
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${api}/user/user/${userId}`, {
          withCredentials: true,
        });

        const userData = res.data;
        // console.log(userData);
        setUser({
          fullname: userData.fullname || "",
          mobile: userData.mobile || "",
          username: userData.username || "",
          bio: userData.bio || "",
          gender: userData.gender || "not available",
          gmail: userData.gmail || "",
          address: userData.address || "",
          showProfilePicture: userData.showProfilePicture || false,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const validate = async (name, value) => {
    let newErrors = { ...errors };

    if (name === "fullname") {
      if (!/^[A-Za-z\s]{3,}$/.test(value)) {
        newErrors.fullname = "Full name must be at least 3 letters (A-Z only).";
      } else {
        delete newErrors.fullname;
      }
    }
    if (name === "username") {
      if (!/^[A-Za-z0-9!@#$%^&*(.)_+]{6,}$/.test(value)) {
        newErrors.username = "username must be at least 6 letters (A-Z only).";
      } else {
        try {
          // Check mobile number uniqueness
          const res = await axios.get(`${api}/user/find-username/${value}`, {
            withCredentials: true,
          });
          if (res.data.available) {
            newErrors.username = "This username is already in use.";
          } else {
            delete newErrors.username;
          }
        } catch (error) {
          console.error("Error checking mobile number:", error);
        }
      }
    }

    if (name === "mobile") {
      if (!/^\d{10}$/.test(value)) {
        newErrors.mobile = "Mobile number must be exactly 10 digits.";
      } else {
        try {
          // Check mobile number uniqueness
          const res = await axios.get(`${api}/user/find-mobile/${value}`, {
            withCredentials: true,
          });
          if (res.data.available) {
            newErrors.mobile = "This mobile number is already in use.";
          } else {
            delete newErrors.mobile;
          }
        } catch (error) {
          console.error("Error checking mobile number:", error);
        }
      }
    }

    if (name === "bio") {
      if (value.length > 300) {
        newErrors.bio = "Bio must be at most 300 characters.";
      } else {
        delete newErrors.bio;
      }
    }

    setErrors(newErrors);
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    await validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Final validation
    await validate("fullname", user.fullname);
    await validate("mobile", user.mobile);
    await validate("bio", user.bio);

    if (Object.keys(errors).length > 0) return;

    try {
      const res = await axios.put(`${api}/user/edit-user/${userId}`, user, {
        withCredentials: true,
      });

      console.log("Updated user response:", res.data.user);
      setMessage("User details updated successfully!");
      if ( res.data.user._id === loggedInUser._id ){
        setLoggedInUser(res.data.user);
      }
      setTimeout(() => {
        navigate(-1)
      }, 1000);

    } catch (error) {
      console.error("Error updating user:", error);
      setMessage("Failed to update user details.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center gap-5 animate-pulse">
        <div className="h-6 w-40 bg-[---primary-light-color] dark:bg-[--primary-dark-color] rounded mb-4"></div>
  
        <div className="w-full md:w-[50vw] xl:w-[40vw] space-y-4">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <div className="h-4 w-20 bg-[---primary-light-color] dark:bg-[--primary-dark-color] rounded"></div>
              <div className="h-10 w-full bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] rounded"></div>
            </div>
          ))}
  
          <div className="h-10 w-full bg-[---primary-light-color] dark:bg-[--primary-dark-color] rounded"></div>
          <div className="h-10 w-1/2 bg-gray-400 dark:bg-gray-600 rounded mt-4"></div>
        </div>
      </div>
    );
  }
  

  return (
    <div className="p-6 flex flex-col items-center gap-5">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
     

      <div className="div">
        <ProfileUpload userId={userId} setLoggedInUser={setLoggedInUser}/>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full md:w-[50vw] xl:w-[40vw] bg-[--primary-light-color] dark:bg-[--primary-dark-color] p-6 ">
        <label className="flex flex-col my-3 ">
          <h4 className="font-thin tracking-wider bg-[--light-color] dark:bg-[--dark-color] py-1  px-2 absolute text-[10px] transform -translate-y-[70%] rounded-full ">Full Name</h4>
          <input
            type="text"
            name="fullname"
            value={user.fullname}
            onChange={handleChange}
            className="outline-none p-2 rounded-md bg-[--secondary-light-color] dark:bg-[--secondary-dark-color]"
            required
          />
          {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname}</p>}
        </label>

        <label className="flex flex-col my-3">
        <h4 className="font-thin tracking-wider bg-[--light-color] dark:bg-[--dark-color] py-1  px-2 absolute text-[10px] transform -translate-y-[70%] rounded-full ">Mobile</h4>
          <input
            type="text"
            name="mobile"
            value={user.mobile}
            onChange={handleChange}
            className="outline-none p-2 rounded-md bg-[--secondary-light-color] dark:bg-[--secondary-dark-color]"
            required
            disabled
          />
          {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
        </label>
        
        <label className="flex flex-col my-3">
        <h4 className="font-thin tracking-wider bg-[--light-color] dark:bg-[--dark-color] py-1  px-2 absolute text-[10px] transform -translate-y-[70%] rounded-full ">Username</h4>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            className="outline-none p-2 rounded-md bg-[--secondary-light-color] dark:bg-[--secondary-dark-color]"
            required
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
        </label>


        <label className="flex flex-col my-3">
        <h4 className="font-thin tracking-wider bg-[--light-color] dark:bg-[--dark-color] py-1  px-2 absolute text-[10px] transform -translate-y-[70%] rounded-full ">Bio</h4>
          <textarea
            name="bio"
            value={user.bio}
            onChange={handleChange}
            className="outline-none max-h-[50vh] min-h-[10vh]  p-2 rounded-md bg-[--secondary-light-color] dark:bg-[--secondary-dark-color]"
            maxLength="300"
          />
          {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
        </label>

        <label className="flex flex-col my-3">
        <h4 className="font-thin tracking-wider bg-[--light-color] dark:bg-[--dark-color] py-1  px-2 absolute text-[10px] transform -translate-y-[70%] rounded-full ">Gender</h4>
          <select name="gender" value={user.gender} onChange={handleChange} className="outline-none p-2 rounded-md bg-[--secondary-light-color] dark:bg-[--secondary-dark-color]">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="not available">Not Available</option>
          </select>
        </label>

        <label className="flex flex-col my-3">
        <h4 className="font-thin tracking-wider bg-[--light-color] dark:bg-[--dark-color] py-1  px-2 absolute text-[10px] transform -translate-y-[70%] rounded-full ">Gmail</h4>
          <input
            type="email"
            name="gmail"
            value={user.gmail}
            onChange={handleChange}
           className="outline-none p-2 rounded-md bg-[--secondary-light-color] dark:bg-[--secondary-dark-color]"
          />
        </label>

        <label className="flex flex-col my-3">
        <h4 className="font-thin tracking-wider bg-[--light-color] dark:bg-[--dark-color] py-1  px-2 absolute text-[10px] transform -translate-y-[70%] rounded-full ">Address</h4>
          <input
            type="text"
            name="address"
            value={user.address}
            onChange={handleChange}
           className="outline-none p-2 rounded-md bg-[--secondary-light-color] dark:bg-[--secondary-dark-color]"
          />
        </label>
        {message && <p className={`text-${message.includes("failed") ? "red" : "green"}-500`}>{message}</p>}

        <button type="submit" className="bg-blue-500 text-white p-2" disabled={Object.keys(errors).length > 0}>
          Update User
        </button>
      </form>

      <button
        onClick={() => navigate(-1)}
        className="mt-4 bg-gray-500 text-white p-2"
      >
        Go Back
      </button>
    </div>
  );
};

export default EditUserProfile;
