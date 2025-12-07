import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const AdminUserSelector = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const { state } = useLocation();
  const { seatNumber, month, year, shiftTypes } = state || {};

  const api = import.meta.env.VITE_API_BASE_URL;

  // --------------------------
  // SEARCH USERS (DEBOUNCE)
  // --------------------------
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${api}/admin/bookseat/search?query=${query}`,
          { withCredentials: true }
        );
        setResults(res.data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  // --------------------------
  // HANDLE USER SELECT
  // --------------------------
  const handleSelect = (user) => {
    setSelectedUser(user);
    setQuery("");       // 🔥 Empty search bar
    setResults([]);     // 🔥 Hide results list
    onSelect && onSelect(user);
  };

  // --------------------------
  // HANDLE BOOKING
  // --------------------------
  const handleBooking = async () => {
    try {
      const price = prompt("Enter booking price:");
      if (!price) return alert("Price is required");

      const payload = {
        seatNumber,
        month,
        year,
        shiftTypes,
        userId: selectedUser._id,
        price: Number(price),
      };

      const res = await axios.post(`${api}/admin/bookseat/create`, payload, {
        withCredentials: true,
      });

      alert("Booking Successful!");
      console.log("BOOKING:", res.data);
    } catch (error) {
      console.error("Booking error:", error);
      alert(error.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">

      {/* SEARCH INPUT */}
      <input
        type="text"
        placeholder="Search by username, mobile, email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-800"
      />

      {loading && <p className="text-sm text-gray-500 mt-2">Searching...</p>}

      {/* SEARCH RESULTS */}
      {results.length > 0 && (
        <div className="mt-3 bg-white dark:bg-gray-900 shadow rounded-md">
          {results.map((user) => (
            <div
              key={user._id}
              className="p-3 border-b hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
              onClick={() => handleSelect(user)}
            >
              <h3 className="font-semibold">{user.fullname}</h3>
              <p className="text-sm text-gray-600">{user.username}</p>
              <p className="text-sm">{user.mobile}</p>
              <p className="text-sm">{user.gmail}</p>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY RESULT */}
      {query && !loading && results.length === 0 && (
        <p className="text-gray-400 p-3 text-center">No users found</p>
      )}

      {/* SELECTED USER */}
      {selectedUser && (
        <div className="mt-4 p-4 border rounded-md bg-blue-50 dark:bg-gray-800">
          <h2 className="text-xl font-bold mb-2">Selected User</h2>

          <p><strong>Name:</strong> {selectedUser.fullname}</p>
          <p><strong>Username:</strong> {selectedUser.username}</p>
          <p><strong>Mobile:</strong> {selectedUser.mobile}</p>
          <p><strong>Email:</strong> {selectedUser.gmail}</p>
          <p><strong>Address:</strong> {selectedUser.address}</p>

          <button
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={handleBooking}
          >
            Continue with this user
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUserSelector;
