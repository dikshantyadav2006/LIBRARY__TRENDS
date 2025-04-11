import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import profile from "../../../assets/images/profile.jpg";
import axios from "axios";
import FetchProfilePicture from "../../fetchProfilePicture/FetchProfilePicture";

// Skeleton loading card
const SkeletonCard = () => (
  <div className="p-2 bg-[--primary-light-color] rounded-md dark:bg-[--primary-dark-color] cursor-pointer transition duration-400 w-full md:w-[40%] lg:w-[30%] xl:w-[20%] min-h-[25vh]  text-center flex flex-col items-center justify-between  text-[--dark-color] dark:bg-[#1d1e20] dark:text-[--light-color] shadow-lg hover:shadow-xl relative overflow-hidden  animate-pulse" />
);

// Lazy image loader
const LazyImage = ({ src, alt }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={ref}
      src={isVisible ? src : null}
      alt={alt}
      className="w-full h-full object-cover rounded-full"
    />
  );
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const observerRef = useRef(null);
  const api = import.meta.env.VITE_API_BASE_URL;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${api}/admin/users`, {
        withCredentials: true,
      });

      const allUsers = res.data;

      const newUsers = allUsers.slice(users.length, users.length + 10);
      const usersWithPics = await Promise.all(
        newUsers.map(async (user) => {
          const profilePic = await FetchProfilePicture(user._id);
          return { ...user, profilePic };
        })
      );

      setUsers((prev) => [...prev, ...usersWithPics]);
      setHasMore(users.length + 10 < allUsers.length);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [users.length]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Observe bottom loader div to trigger next fetch
  useEffect(() => {
    if (loading || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchUsers();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore, fetchUsers]);

  return (
    <div className="p-6">
      <h2  id="adminDashboard"  className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="allUsers">
        <h1 className="text-2xl font-bold mb-4 text-center">All Users</h1>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => navigate(`/admin/user/${user._id}`)}
              className="p-2 bg-[--primary-light-color] hover:scale-105 rounded-md dark:bg-[--primary-dark-color] cursor-pointer transition duration-400 w-full md:w-[40%] lg:w-[30%] xl:w-[20%]  text-center flex flex-col items-center justify-between  text-[--dark-color] dark:bg-[#1d1e20] dark:text-[--light-color] shadow-lg hover:shadow-xl relative overflow-hidden "
            >
              {user.isAdmin && (
                <div className="text-m text-gray-500 absolute top-0 right-0 bg-green-500 px-2">
                  Admin
                </div>
              )}

              {/* Circular image */}
              <div className="w-[50vw]  h-[50vw] sm:w-[36vw] sm:h-[36vw]   md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-gray-800 p-1">
                <LazyImage src={user.profilePic || profile} alt="User" />
              </div>

              {/* Info */}
              <div className="w-full h-fit flex flex-col items-start justify-center p-2 rounded-b-lg pl-3">
                <h3 className="text-m font-semibold mb-1 capitalize">
                  Name: {user.fullname}
                </h3>
                <p className="text-xs text-gray-500">Username: {user.username}</p>
                <p className="text-xs text-gray-500">Mobile: {user.mobile}</p>
              </div>
            </div>
          ))}

          {/* Skeleton loaders */}
          {loading &&
            Array(5)
              .fill(0)
              .map((_, i) => <SkeletonCard key={i} />)}
        </div>

        {/* Loader target div for infinite scroll */}
        <div ref={observerRef} className="h-12 mt-4"></div>

        {/* No more users */}
        {!hasMore && (
          <div className="text-center text-gray-500 mt-4">No more users</div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
