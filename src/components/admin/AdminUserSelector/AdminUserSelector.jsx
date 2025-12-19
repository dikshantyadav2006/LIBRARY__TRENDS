import { useState } from "react";
import axios from "axios";
import {  useLocation, useNavigate } from "react-router-dom";

import UserSearchInput from "./components/UserSearchInput";
import UserSearchResults from "./components/UserSearchResults";
import SelectedUserCard from "./components/SelectedUserCard";
import useUserSearch from "./components/useUserSearch";

const AdminUserSelector = ({ onSelect }) => {
   const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [price, setPrice] = useState('');
    

  const { results, loading } = useUserSearch(query);

  const { state } = useLocation();
  const { seatNumber, month, year, shiftTypes } = state || {};

  const api = import.meta.env.VITE_API_BASE_URL;

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setQuery("");
    onSelect?.(user);
  };

  const handleBooking = async () => {
    try {
      if (!price) return alert("Price is required");

      const payload = {
        seatNumber,
        month,
        year,
        shiftTypes,
        userId: selectedUser._id,
        price: Number(price),
      };

      await axios.post(`${api}/admin/bookseat/create`, payload, {
        withCredentials: true,
      });

      alert("Booking Successful!"); 

      navigate("/seats");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <UserSearchInput value={query} onChange={setQuery} />

      {loading && (
        <div className="mt-3 flex justify-center">
          <div className="px-4 py-2 rounded-full bg-white/70 dark:bg-gray-800/70 backdrop-blur shadow text-sm text-gray-600 dark:text-gray-300">
            🔍 Searching users...
          </div>
        </div>
      )}

      {query && !loading && results.length === 0 && (
        <p className="text-gray-400 p-3 text-center">No users found</p>
      )}

      <UserSearchResults results={results} onSelect={handleSelectUser} />
      <SelectedUserCard user={selectedUser} onConfirm={handleBooking} />
      {selectedUser && (
        <div className="mt-4 p-4 border rounded-md">
          <input
            type="number"
            placeholder="Enter booking price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 border rounded-md mb-3 bg-gray-100 dark:bg-gray-800"
          />

          <button
            onClick={() => {
              if (!price) return alert("Price is required");
              handleBooking(Number(price));
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Confirm Booking
          </button>
        </div>
      )}

    </div>
  );
};

export default AdminUserSelector;
