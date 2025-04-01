import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./home/Home";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserDetail from "./pages/UserDetail";
import SeatDetails from "./pages/SeatDetails"; // Ensure this import is added
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import NavbarMain from "./components/navbar/NavbarMain";
import EditUserProfile from "./components/user/EditUserProfile";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Fetch user from cookies on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth/userdata", {
          method: "GET",
          credentials: "include", // Important for cookies
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data); // Set user if found
        } else {
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
      const res = await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include", // Important for handling cookies
      });

      if (res.ok) {
        setUser(null); // Clear user state after logout
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

  if (loading) return <p>Loading...</p>;

  return (
    <div
      className="relative selection:bg-[--dark-color] selection:text-[--light-color] dark:selection:bg-[--light-color] dark:selection:text-[--dark-color] w-screen min-h-screen transition-colors duration-500 text-[--dark-color] dark:text-[--light-color] lg:px-[5vw] lg:py-[5vw]"
      style={{
        background:
          "linear-gradient(65deg, #000000, #1a1a1a, #333333, #000000)",
      }}
    >
      <div
        className="relative lg:rounded-[3vw] p-[.3vw] pt-0"
        style={{
          background:
            "linear-gradient(135deg, #0ff0fc, #8a2be2, #ff00ff, #0ff0fc)",
        }}
      >
        <div className="lg:rounded-[2.7vw] bg-[--light-color] dark:bg-[--dark-color] min-h-[50vh]">
          <NavbarMain
            user={user}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            handleLogout={handleLogout}
            setUser={setUser}
            handleUserSet={handleUserSet}
          />

          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route
              path="/login"
              element={
                user ? <Navigate to="/dashboard" /> : <Login onUserSet={handleUserSet} />
              }
            />
            <Route
              path="/signup"
              element={user ? <Navigate to="/dashboard" /> : <Signup />}
            />
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  loading={loading}
                  loggedInUser={user}
                  setUser={setUser}
                  handleLogout={handleLogout}
                />
              }
            />
            <Route
              path="/admin"
              element={
                user?.isAdmin ? (
                  <AdminDashboard
                    loading={loading}
                    user={user}
                    setUser={setUser}
                    handleLogout={handleLogout}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            {/* ✅ Fixed Syntax Here */}
            <Route
              path="/admin/user/:userID"
              element={user?.isAdmin ? <UserDetail /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin/dashboard/edit-student/:studentId"
              element={user?.isAdmin ? <EditStudent loggedInUser={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin/dashboard/add-student/:userID"
              element={user?.isAdmin ? <AddStudent loggedInUser={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard/edit-user/:userId"
              element={user ? <EditUserProfile loggedInUser={user} setLoggedInUser={setLoggedInUser} /> : <Navigate to="/login" />}
            />
            <Route path="/seats" element={<SeatDetails />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
