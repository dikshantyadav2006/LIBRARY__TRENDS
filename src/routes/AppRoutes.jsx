import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../components/home/Home";
import Login from "../components/login/Login";
import Signup from "../components/signup/Signup";
import Feedback from "../components/feedback/Feedback";
import SeatDetails from "../components/seatDetails/SeatDetails";
import Dashboard from "../components/user/userDashboard/Dashboard";
import AdminDashboard from "../components/admin/adminDashboard/AdminDashboard";
import UserDetail from "../components/admin/adminDashboard/UserDetail";
import AddStudent from "../components/admin/addStudent/AddStudent";
import EditStudent from "../components/admin/editStudent/EditStudent";
import EditUserProfile from "../components/user/EditUserProfile/EditUserProfile";

const AppRoutes = ({ user, handleUserSet, setUser, handleLogout, loading ,isDarkMode ,loggedInUser ,setLoggedInUser}) => (
  <Routes>
    <Route path="/" element={<Home loggedInUser={user} isDarkMode={isDarkMode} />} />
    <Route path="/feedback" element={<Feedback loggedInUser={user} />} />
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
      element={<Dashboard loading={loading} loggedInUser={user} setUser={setUser} handleLogout={handleLogout} />}
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
      path="/admin/dashboard/edit-student/:studentId"
      element={user?.isAdmin ? <EditStudent loggedInUser={user} /> : <Navigate to="/login" />}
    />
    <Route
      path="/admin/dashboard/add-student/:userID"
      element={user?.isAdmin ? <AddStudent loggedInUser={user} /> : <Navigate to="/login" />}
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
    <Route path="/seats" element={<SeatDetails />} />
  </Routes>
);

export default AppRoutes;
