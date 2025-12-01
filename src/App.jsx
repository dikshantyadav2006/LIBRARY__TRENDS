import { useState, useEffect } from "react";
import AppRoutes from "./routes/AppRoutes.jsx";
import NavbarMain from "./components/navbar/NavbarMain";
import Footer from "./components/footer/Footer";
import logo from "./assets/images/LOADING_LOGO.png";
import TextCursor from "./components/animations/TextCursor";
import ClickSpark from "./components/animations/clickSpark/ClickSpark";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop.jsx";
import NavbarCard from "./components/navbar/navbarAnimations/NavbarCard.jsx";
import useNavbarAnimations from "./components/navbar/navbarAnimations/NavbarAnimations.jsx";
import LocomotiveScroll from "locomotive-scroll";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [animateOut, setAnimateOut] = useState(false);

  const api = import.meta.env.VITE_API_BASE_URL;

  const locomotiveScroll = new LocomotiveScroll();
  // =================================================================================================
  const [showNav, setShowNav] = useState(false);
  const { navCardRef, spanRefs, navCardLinksRefs, navCardToggleButton } =
    useNavbarAnimations(showNav, setShowNav);

  useEffect(() => {
    if (showNav) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [showNav]);

  // Fetch user from cookies on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // console.log("Fetching user...");
        // console.log(loggedInUser)
        const res = await fetch(`${api}/auth/userdata`, {
          method: "GET",
          credentials: "include", // Important for cookies
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data); // Set user if found
        } else {
          const data = await res.json();
          console.log(data);
          console.error("User not found in cookies");
        }
        setLoading(false); // Set loading to false after user is fetched
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [loggedInUser]);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${api}/auth/logout`, {
        method: "POST",
        credentials: "include", // Important for handling cookies
      });

      if (res.ok) {
        setUser(null); // Clear user state after logout
        setLoggedInUser(null);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleUserSet = (user) => {
    setLoggedInUser(user);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };
  // ===================================================
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateOut(true);
    }, 400); // faster loader exit

    return () => clearTimeout(timer);
  }, [loading]);

  if (loading)
    return (
      <>
        <ClickSpark
          sparkColor="#000000"
          sparkSize={500}
          sparkRadius={150}
          sparkCount={20}
          duration={400}
        >
          <LoadingSkeleton />
        </ClickSpark>
      </>
    );

  return (
    <>
      <ScrollToTop setLoading={setLoading} />
      <div
        ref={(el) => (navCardRef.current = el)}
        className={`z-[1] left-0 top-0 fixed w-full h-[100vh] transition-all duration-300  transform ${
          showNav
            ? "translate-y-[0%] bg-[--light-color] dark:bg-[--dark-color] text-[--dark-color] dark:text-[--light-color]"
            : "-translate-y-[200%] pointer-events-none  bg-[--dark-color] dark:bg-[--light-color] text-[--light-color] dark:text-[--dark-color] "
        } border-b-2 border-[--dark-color] dark:border-[--light-color] `}
      >
        <NavbarCard
          handleLogout={handleLogout}
          loggedInUser={user}
          showNav={showNav}
          navCardLinksRefs={navCardLinksRefs}
          navCardToggleButton={navCardToggleButton}
        />
      </div>
      <div
        className={`fixed left-0 top-0 w-screen h-screen z-[999] bg-[--dark-color] dark:bg-[--light-color] transform transition-transform duration-400 ${
          animateOut ? "-translate-y-[150%]" : ""
        }`}
      >
        <ClickSpark
          sparkColor="green"
          sparkSize={500}
          sparkRadius={150}
          sparkCount={20}
          duration={400}
        >
          <LoadingSkeleton />
        </ClickSpark>
      </div>
      <div
        className="relative font-[font1] selection:bg-[--dark-color] selection:text-[--light-color] dark:selection:bg-[--light-color] dark:selection:text-[--dark-color] w-screen min-h-screen transition-colors duration-500 text-[--dark-color] dark:text-[--light-color] lg:px-[5vw] lg:py-[5vw]"
        style={{
          background:
            "linear-gradient(65deg, #000000, #1a1a1a, #333333, #000000)",
        }}
      >
        <div
          className="relative lg:rounded-[3vw] lg:rounded-t-[5vw] p-[.3vw] pt-0 "
          style={{
            background:
              "linear-gradient(135deg, #0ff0fc, #8a2be2, #ff00ff, #0ff0fc)",
          }}
        >
          <div className="lg:rounded-[2.7vw] lg:rounded-t-[4.7vw] bg-[--light-color] dark:bg-[--dark-color] min-h-[50vh]">
            <NavbarMain
              user={user}
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              handleLogout={handleLogout}
              setUser={setUser}
              handleUserSet={handleUserSet}
              spanRefs={spanRefs}
              navCardToggleButton={navCardToggleButton}
              showNav={showNav}
              setShowNav={setShowNav}
            />

            <AppRoutes
              user={user}
              handleUserSet={handleUserSet}
              setUser={setUser}
              handleLogout={handleLogout}
              loading={loading}
              isDarkMode={isDarkMode}
              loggedInUser={loggedInUser}
              setLoggedInUser={setLoggedInUser}
            />
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen overflow-hidden bg-[#F6EBD8]">
      <div className="loader absolute z-10 w-screen h-screen ">
        <TextCursor
          text="hi"
          delay={0.01}
          spacing={40}
          followMouseDirection={true}
          randomFloat={true}
          exitDuration={0.3}
          removalInterval={70}
          maxPoints={25}
        />
      </div>
      <div className="logo w-[90vw] h-[90vw] md:w-[60vw] md:h-[60vw] flex justify-center items-center">
        <img
          src={logo}
          alt="logo"
          style={{
            animation: "scaleInOut 3s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
};

export default App;
