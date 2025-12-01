import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";

const YourBookings = ({ loggedInUser }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [protectionModal, setProtectionModal] = useState(null);
  const [protectionStatus, setProtectionStatus] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [protectingLoading, setProtectingLoading] = useState(false);
  const [protectionMessage, setProtectionMessage] = useState("");
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (loggedInUser) {
      fetchBookings();
    }
  }, [loggedInUser]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/monthly-booking/my-bookings`, {
        withCredentials: true,
      });
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[month - 1];
  };

  const getShiftLabel = (shifts) => {
    const hasMorning = shifts.some((s) => s.shiftType === "morning");
    const hasAfternoon = shifts.some((s) => s.shiftType === "afternoon");
    const hasNight = shifts.some((s) => s.shiftType === "night");

    const labels = [];
    if (hasMorning && hasAfternoon) {
      labels.push("☀️ Day");
    } else {
      if (hasMorning) labels.push("🌅 Morning");
      if (hasAfternoon) labels.push("🌤️ Afternoon");
    }
    if (hasNight) labels.push("🌙 Night");

    return labels.join(" + ");
  };

  const isCurrentOrFuture = (month, year) => {
    const now = new Date();
    const bookingDate = new Date(year, month - 1);
    return bookingDate >= new Date(now.getFullYear(), now.getMonth());
  };

  // Manual protection can be done anytime (automatic protection handles immediate next month)
  const canShowProtection = () => {
    return true;
  };

  // Open protection modal
  const handleProtectClick = async (booking) => {
    try {
      setProtectionModal(booking);
      setProtectionMessage("");
      setSelectedMonths([]);
      const res = await axios.get(
        `${api}/monthly-booking/protection-status/${booking._id}`,
        { withCredentials: true }
      );
      setProtectionStatus(res.data);
    } catch (err) {
      console.error("Error fetching protection status:", err);
      setProtectionStatus({ canProtect: false, reason: err.response?.data?.message || "Error" });
    }
  };

  // Toggle month selection
  const toggleMonthSelection = (monthData) => {
    setSelectedMonths((prev) => {
      const exists = prev.find((m) => m.month === monthData.month && m.year === monthData.year);
      if (exists) {
        return prev.filter((m) => !(m.month === monthData.month && m.year === monthData.year));
      }
      return [...prev, monthData];
    });
  };

  // Submit protection
  const handleProtectSubmit = async () => {
    if (selectedMonths.length === 0) {
      setProtectionMessage("Please select at least one month");
      return;
    }

    try {
      setProtectingLoading(true);
      setProtectionMessage("");
      const res = await axios.post(
        `${api}/monthly-booking/protect`,
        {
          bookingId: protectionModal._id,
          months: selectedMonths,
        },
        { withCredentials: true }
      );
      setProtectionMessage(`✅ ${res.data.message}`);
      setTimeout(() => {
        setProtectionModal(null);
        setProtectionStatus(null);
        fetchBookings();
      }, 2000);
    } catch (err) {
      console.error("Error protecting seat:", err);
      setProtectionMessage(`❌ ${err.response?.data?.message || "Failed to protect seat"}`);
    } finally {
      setProtectingLoading(false);
    }
  };

  if (!loggedInUser) return <Navigate to="/login" />;

  return (
    <div className="p-4 md:p-6 min-h-[60vh]">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 font-[font1]">
        📚 Your Bookings
      </h2>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-[--primary-light-color] dark:bg-[--primary-dark-color] p-4 rounded-lg h-24"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg mb-4">You haven't booked any seats yet.</p>
          <button
            onClick={() => navigate("/seats")}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg"
          >
            Book a Seat Now
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className={`p-4 rounded-lg shadow-md transition-all hover:shadow-lg ${
                isCurrentOrFuture(booking.month, booking.year)
                  ? "bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 border-l-4 border-teal-500"
                  : "bg-[--primary-light-color] dark:bg-[--primary-dark-color] opacity-70"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">
                    Seat #{booking.seatNumber <= 25 ? booking.seatNumber : booking.seatNumber - 25}
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                      booking.seatNumber <= 25
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                    }`}>
                      Floor {booking.seatNumber <= 25 ? 1 : 2}
                    </span>
                  </h3>
                  <p className="text-lg text-teal-600 dark:text-teal-400 font-semibold">
                    {getMonthName(booking.month)} {booking.year}
                  </p>
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    isCurrentOrFuture(booking.month, booking.year)
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {isCurrentOrFuture(booking.month, booking.year) ? "Active" : "Past"}
                </div>
              </div>

              <div className="mt-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Shifts:</p>
                <p className="font-medium">{getShiftLabel(booking.shifts)}</p>
              </div>

              <div className="mt-2 text-xs text-gray-500">
                Booked on: {new Date(booking.shifts[0]?.bookedAt).toLocaleDateString()}
              </div>

              {/* Protection Button - Only for current/future bookings */}
              {isCurrentOrFuture(booking.month, booking.year) && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => handleProtectClick(booking)}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    🛡️ Protect My Seat for Next Month
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Back to Seats Button */}
      <div className="text-center mt-8">
        <button
          onClick={() => navigate("/seats")}
          className="bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] px-6 py-2 rounded-lg hover:scale-105 transition-transform"
        >
          Book More Seats
        </button>
      </div>

      {/* Protection Modal */}
      {protectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">🛡️ Protect Your Seat</h3>
              <button
                onClick={() => {
                  setProtectionModal(null);
                  setProtectionStatus(null);
                  setSelectedMonths([]);
                  setProtectionMessage("");
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="font-semibold">
                Seat #{protectionModal.seatNumber <= 25 ? protectionModal.seatNumber : protectionModal.seatNumber - 25}
                <span className="ml-2 text-sm text-gray-500">
                  (Floor {protectionModal.seatNumber <= 25 ? 1 : 2})
                </span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getShiftLabel(protectionModal.shifts)}
              </p>
            </div>

            {!protectionStatus ? (
              <div className="text-center py-4">Loading...</div>
            ) : !protectionStatus.canProtect ? (
              <div className="text-center py-4">
                <p className="text-orange-600 dark:text-orange-400 font-semibold">
                  {protectionStatus.protectionDeadline || protectionStatus.reason}
                </p>
                {protectionStatus.isPastBooking && (
                  <p className="text-sm text-gray-500 mt-2">
                    You can only protect active bookings
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2">Select months to protect:</p>
                  <div className="space-y-2">
                    {protectionStatus.protectionMonths?.map((monthData) => {
                      const isSelected = selectedMonths.find(
                        (m) => m.month === monthData.month && m.year === monthData.year
                      );
                      return (
                        <button
                          key={`${monthData.month}-${monthData.year}`}
                          onClick={() => toggleMonthSelection(monthData)}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                            isSelected
                              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                              : "border-gray-200 dark:border-gray-600 hover:border-purple-300"
                          }`}
                        >
                          <span className="font-semibold">{monthData.label}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            (+{monthData.monthsFromNow} month{monthData.monthsFromNow > 1 ? "s" : ""})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg mb-4 text-sm">
                  <p className="font-semibold text-orange-700 dark:text-orange-400">
                    ⚠️ Important:
                  </p>
                  <p className="text-orange-600 dark:text-orange-300 mt-1">
                    You must complete payment by <strong>Day 3</strong> of each protected month,
                    or the seat will be released for others to book.
                  </p>
                </div>

                {protectionMessage && (
                  <p className={`text-sm mb-3 p-2 rounded ${
                    protectionMessage.startsWith("✅")
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {protectionMessage}
                  </p>
                )}

                <button
                  onClick={handleProtectSubmit}
                  disabled={protectingLoading || selectedMonths.length === 0}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-lg font-semibold disabled:cursor-not-allowed"
                >
                  {protectingLoading
                    ? "Protecting..."
                    : `Protect for ${selectedMonths.length} Month${selectedMonths.length !== 1 ? "s" : ""}`}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default YourBookings;

