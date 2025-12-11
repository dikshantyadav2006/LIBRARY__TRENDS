import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../components/home/Home";
import Login from "../components/login/Login";
import Signup from "../components/signup/Signup";
import Feedback from "../components/feedback/Feedback";
import SeatDetails from "../components/seatDetails/SeatDetails";
import YourBookings from "../components/bookings/YourBookings";
import Dashboard from "../components/user/userDashboard/Dashboard";
import AdminDashboard from "../components/admin/adminDashboard/AdminDashboard";
import UserDetail from "../components/admin/adminDashboard/UserDetail";
import EditUserProfile from "../components/user/EditUserProfile/EditUserProfile";
import CompleteProfile from "../components/user/CompleteProfile/CompleteProfile";
import AdminUserSelector from "../components/admin/AdminUserSelector/AdminUserSelector";
import Policies from "../components/policies/Policies";
import Blogs from "../components/blogs/Blogs";

const AppRoutes = ({ user, handleUserSet, setUser, handleLogout, loading ,isDarkMode ,loggedInUser ,setLoggedInUser}) => (
  <Routes>
    <Route path="/" element={<Home loggedInUser={user} isDarkMode={isDarkMode} />} />
    <Route path="/feedback" element={<Feedback loggedInUser={user} />} />
    <Route path="/privacypolicy" element={<Policies/>} />
    <Route path="/termsandconditions" element={<Policies/>} />
    <Route path="/blogs" element={<Blogs loggedInUser={user} />} />
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
      path="/complete-profile"
      element={
        user ? (
          user.profileCompleted ? (
            <Navigate to="/dashboard" />
          ) : (
            <CompleteProfile loggedInUser={user} setLoggedInUser={setLoggedInUser} />
          )
        ) : (
          <Navigate to="/login" />
        )
      }
    />
    <Route
      path="/dashboard"
      element={
        user && !user.profileCompleted ? (
          <Navigate to="/complete-profile" />
        ) : (
          <Dashboard loading={loading} loggedInUser={user} setUser={setUser} handleLogout={handleLogout} />
        )
      }
    />
    <Route
      path="/admin"
      element={
        user?.isAdmin ? (
          <AdminDashboard loading={loading} user={user} setUser={setUser} handleLogout={handleLogout} />
          
        ) : (
          <Navigate to="/login" />
        )
      }
    />
    <Route
      path="/admin/user/:userID"
      element={user?.isAdmin ? <UserDetail /> : <Navigate to="/login" />}
    />
    <Route
      path="/admin/bookseat"
      element={user?.isAdmin ? <AdminUserSelector loggedInUser={user} /> : <Navigate to="/login" />}
    />
    <Route
      path="/dashboard/edit-user/:userId"
      element={
        user ? (
          <EditUserProfile setLoggedInUser={setLoggedInUser} loggedInUser={user} />
        ) : (
          <Navigate to="/login" />
        )
      }
    />
    <Route path="/seats" element={<SeatDetails loggedInUser={user} />} />
    <Route
      path="/my-bookings"
      element={
        user ? (
          <YourBookings loggedInUser={user} />
        ) : (
          <Navigate to="/login" />
        )
      }
    />
  </Routes>
);

export default AppRoutes;
