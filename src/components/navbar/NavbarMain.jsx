import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import light from "../../assets/images/light.png";
import dark from "../../assets/images/dark.png";
import FetchProfilePicture from "../fetchProfilePicture/FetchProfilePicture";

const  NavbarMain = ({ user, toggleDarkMode, isDarkMode, handleLogout }) => {

  const [profilePic, setProfilePic] = useState(null)

  useEffect(() => {
    if (user) {
      fetchProfilePic(user._id); 
    }
  }, [user]);

  const fetchProfilePic = async (id) => {
    if (!id) return;
    const profilePicture = await FetchProfilePicture(id);
    setProfilePic(profilePicture);
  };


  return (
    <nav className="flex justify-between items-center p-2 sticky top-0 left-0 w-full bg-[--primary-light-color] dark:bg-[--primary-dark-color] text-[--dark-color] dark:text-[--light-color] shadow-2xl  dark:shadow-[#1d1e20] z-10  lg:rounded-t-[3vw] lg:rounded-b-[3vw] lg:px-[3vw] overflow-hidden">
      <Link to="/">
        <h1 className="text-2xl uppercase font-[font1] font-black  ">
          sai library
        </h1>
      </Link>
      <Link className="hidden md:block" to="/seats">seat</Link>
      <button onClick={toggleDarkMode} className="px-2 ">
        {isDarkMode ? (
          <img
            className="p-[5px] rounded-full h-7 bg-[#1d1e20] opacity-70"
            src={light}
            alt="light mode icon"
          />
        ) : (
          <img
            className="p-[5px] rounded-full h-7 bg-[--dark-color] opacity-70 mix-blend-difference"
            src={dark}
            alt="dark mode icon"
          />
        )}
      </button>
      {user? (
        <>
        <div className="hidden sm:block">
          {user.isAdmin && <Link to="/admin">dashboard</Link>}
        </div>
        <button onClick={handleLogout} className="px-2 hidden md:block ">
          Logout
        </button>
        <Link to="/dashboard">
        <div  className="profileimage rounded-full w-[2.5rem] h-[2.5rem] bg-red-600 overflow-hidden">
          <img className="w-full object-cover h-full" src={profilePic} alt="" />
        </div>
        </Link>
        </>

      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      )}
    
    </nav>
  );
};

export default NavbarMain;
