import React from "react";
import { NavLink, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useState } from "react";

const NavbarCard = ({
  loggedInUser,
  showNav,
  navCardToggleButton,
  navCardLinksRefs,
  handleLogout,
}) => {
  const [btns, setbtns] = useState([]);

  useEffect(() => {
    const baseBtns = [
      { id: 1, name: "Home", path: "/" },
      { id: 2, name: "Seats", path: "/seats" },
      { id: 3, name: "Feedback", path: "/feedback" },
    ];
    if (loggedInUser) {
      const isAdmin = loggedInUser.isAdmin;
      const adminBtns = isAdmin
        ? [{ id: 99, name: "Admin Dashboard", path: "/admin" }]
        : [];
      setbtns([...baseBtns, ...adminBtns]);
    } else {
      const authbtns = [{ id: 100, name: "login", path: "/login" },{id:101,name:"signup",path:"/signup"}];
      setbtns([...baseBtns, ...authbtns]);
    }
  }, [loggedInUser]);

  const navbarCardlinks = {
    help: {
      title: "help",
      links: {
        termsAndConditions: {
          title: "Terms & Conditions",
          path: "/termsandconditions",
        },
        privacyPolicy: {
          title: "Privacy Policy",
          path: "/privacypolicy",
        },
        feedback: {
          title: "Feedback",
          path: "/feedback",
        },
      },
    },
    aboutUs: {
      title: "about us",
      links: {
        aboutUs: {
          title: "About Us",
          path: "/about",
        },
        contacts: {
          title: "Contacts",
          path: "/contacts",
        },
        ourBlog: {
          title: "Our Blog",
          path: "/blogs",
        },
      },
    },
  };
  return (
    <div
      className={`${
        showNav ? " " : "rounded-2xl "
      }flex flex-col   justify-between pb-1 overflow-hidden  font-[font1] pt-10 lg:pt-[10vh]  h-full `}
    >
      <div className=" overflow-hidden links flex flex-col gap-1 mt-10 justify-between items-start pl-[10vw] sm:pl-[50vw] ">
        {btns.map((btn, index) => (
          <NavLink
            onClick={() => {
              navCardToggleButton();
            }}
            to={btn.path}
            key={index}
            className={({ isActive }) =>
              `uppercase px-3 rounded-sm h-[9vw] sm:h-[4vw] ${
                showNav ? "overflow-visible" : " overflow-hidden "
              }  relative ${isActive ? " bg-[--primary-dark-color] dark:bg-[--primary-light-color] text-[--primary-light-color] transition-colors delay-150  dark:text-[--primary-dark-color] hidden" : "hover:bg-[--secondary-dark-color] hover:dark:bg-[--secondary-light-color] hover:text-[--primary-light-color] hover:dark:text-[--primary-dark-color] transition-colors delay-150"} `
            }
          >
            <h1
              ref={(el) => (navCardLinksRefs.current[index] = el)}
              className={` h-[9vw] sm:h-[4vw]  text-[9vw] sm:text-[4vw] font-black  font-["font1"] leading-none transform
         transition-transform duration-1000 ease-in-out 
         ${showNav ? "" : ""}  `}
            >
              {btn.name}
            </h1>
          </NavLink>
        ))}
      </div>
      <div className="flex justify-end gap-2 sm:mt-[7vh]  pr-[10vw] bg-[--primary-light-color] dark:bg-[--primary-dark-color] dark:text-[--primary-light-color]  text-[--primary-dark-color] my-auto">
        <div className=" w-full h-fit flex mb-[5vw] lg:mb-[20vh]   justify-end ">
          <div className="flex   sm:flex-row">
            {Object.entries(navbarCardlinks).map(([key, headline]) => (
              <div className="p-2   px-[5vw]  flex flex-col   " key={key}>
                {Object.entries(headline.links).map(([key, links]) => (
                  <motion.div
                    className="  mt-[1vw] w-fit relative overflow-hidden sm:h-[1.5vw]"
                    key={key}
                    whileHover="hover"
                    initial="rest"
                    animate="animateHover"
                    whileInView="inView"
                    viewport="viewport"
                  >
                    <Link to={links.path}>
                      <motion.h3
                        className="font-extralight sm:text-[1.2vw] font-[font1]  lowercase    "
                        variants={{
                          rest: { y: "100%" },
                          animateHover: { y: "0%", opacity: 0.7 },
                          hover: { y: ["100%", 0], opacity: [0.8, 1] },
                          inView: { y: ["100%", 0], opacity: [1, 0.8] },
                          viewport: { amount: 0.8, delay: 6 }, // Animate to visible and in position
                        }}
                        onClick={() => {
                          navCardToggleButton(); // animate all animations
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        {links.title}
                      </motion.h3>
                    </Link>
                    <motion.div
                      className="absolute bottom-0 left-1/2 sm:h-[.1vh] bg-black"
                      variants={{
                        rest: { width: 0, x: "-50%" },
                        hover: { width: "100%", x: "-50%", opacity: 0.6 },
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="md:hidden p-2">
        {
          loggedInUser ? (
            <div className="px-2 py-1 bg-[--primary-dark-color] dark:bg-[--primary-light-color] dark:text-[--primary-dark-color] text-[--primary-light-color] flex flex-wrap flex-col gap-2 rounded-xl  ">
                   <h1>User:{" @"}{loggedInUser? loggedInUser.username : ""}</h1>
                   <button onClick={handleLogout} className=" bg-red-600 rounded-full px-2 py-1 capitalize text-white hover:scale-95 w-1/3  "> logout</button>
            </div>
          ):(
            <div className=""></div>
          )
        }
      </div>
    </div>
  );
};

export default NavbarCard;
