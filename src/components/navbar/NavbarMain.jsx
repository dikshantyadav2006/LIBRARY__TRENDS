import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import light from "../../assets/images/light.png";
import dark from "../../assets/images/dark.png";
import FetchProfilePicture from "../fetchProfilePicture/FetchProfilePicture";

const NavbarMain = ({
  user,
  toggleDarkMode,
  isDarkMode,
  handleLogout,
  navCardToggleButton,
  spanRefs,
  showNav,
  setShowNav,
}) => {
  const [profilePic, setProfilePic] = useState(null);

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
    <nav onClick={() => {
      if (showNav) {
        setShowNav(false);
        navCardToggleButton();
      }
    }}
     className={`${showNav?" cursor-pointer transition-transform duration-300  delay-1000 transform lg:-translate-y-[8vh] ":"transition-transform duration-300  delay-1000 transform translate-y-[0]"} flex justify-between items-center p-2 sticky top-0 left-0 w-full bg-[--primary-light-color] dark:bg-[--primary-dark-color] text-[--dark-color] dark:text-[--light-color] shadow-2xl  dark:shadow-[#1d1e20] z-10  lg:rounded-t-[3vw] lg:rounded-b-[3vw] lg:px-[3vw] overflow-hidden`}>
      <Link to="/">
        <h1 className="text-2xl uppercase font-[font1] font-black  ">
          sai library
        </h1>
      </Link>
      <Link className="hidden md:block" to="/seats">
        seat
      </Link>
      <button  onClick={() => {
        toggleDarkMode();
    }} className="px-2 ">
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
      {user ? (
        <>
          <div className="hidden sm:block">
            {user.isAdmin && <NavLink to="/admin">Dashboard</NavLink>}
          </div>
          <button onClick={handleLogout} className="px-2 hidden md:block ">
            Logout
          </button>
        </>
      ) : (
        <>
          <Link className=" hidden  sm:block" to="/login">
            Login
          </Link>
          <Link className="hidden sm:block" to="/signup">
            Signup
          </Link>
        </>
      )}
     <div className={`${showNav ? "pl-0" : "pl-8"}`}>
     <div
        className={`flex items-center gap-2 px-2 py-1 rounded-md${
          !user && showNav ? " py-3 pr-10 " : ""
        } ${
          showNav ? "pr-10  " : "pr-2"
        } bg-[--dark-color] dark:bg-[--light-color] ease-in-out `}
      >
        <div className="flex justify-center items-center gap-2 ">
          <div
            className={`profileimage rounded-full w-[2.5rem] h-[2.5rem] bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] overflow-hidden ${
              !user ? " hidden " : ""
            }  `}
          >
            {" "}
            <NavLink to="/dashboard">
              <img
                
                className="w-full object-cover h-full"
                src={profilePic}
                alt=""
              />
            </NavLink>
          </div>
          <div
            onClick={navCardToggleButton}
            className={`flex items-center flex-col cursor-pointer ${
              showNav ? "gap-[0px]" : "gap-[4px]"
            }`}
          >
            <span
              ref={(el) => (spanRefs.current[0] = el)}
              className={`w-8 h-[4px] inline-block bg-[--light-color] dark:bg-[--dark-color] ${
                showNav ? "rounded-full" : "rounded-none"
              }`}
            ></span>
            <span
              ref={(el) => (spanRefs.current[1] = el)}
              className={`w-8 h-[4px] inline-block bg-[--light-color] dark:bg-[--dark-color] ${
                showNav ? "rounded-full" : "rounded-none"
              }`}
            ></span>
            <span
              ref={(el) => (spanRefs.current[2] = el)}
              className={`w-8 h-[4px] inline-block bg-[--light-color] dark:bg-[--dark-color] ${
                showNav ? "rounded-full" : "rounded-none"
              }`}
            ></span>
          </div>
        </div>
      </div>
     </div>
    </nav>
  );
};

export default NavbarMain;
