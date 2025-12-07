import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SeatDetails = ({ loggedInUser }) => {
  // Month/Year selection (like movie theater)
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [monthLabel, setMonthLabel] = useState("");
  const [isCurrentMonth, setIsCurrentMonth] = useState(false);

  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [seatDetails, setSeatDetails] = useState(null);
  // Filters now use "day" (morning+afternoon) and "night"
  const [filters, setFilters] = useState({
    day: false,
    night: false,
  });
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Pro-rated pricing state
  const [priceInfo, setPriceInfo] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  // Popup state for Day-only confirmation when Night is not available
  const [showDayOnlyPopup, setShowDayOnlyPopup] = useState(false);
  const [dayOnlyConfirmed, setDayOnlyConfirmed] = useState(false);
  const [pendingDaySelection, setPendingDaySelection] = useState(false);

  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_BASE_URL;

  // Fetch available months on component mount
  useEffect(() => {
    const fetchAvailableMonths = async () => {
      try {
        const res = await axios.get(`${api}/monthly-booking/months`, { withCredentials: true });
        setAvailableMonths(res.data.months);
        // Select current month by default
        if (res.data.months.length > 0) {
          const currentMonth = res.data.months[0];
          setSelectedMonth(currentMonth.month);
          setSelectedYear(currentMonth.year);
          setMonthLabel(currentMonth.label);
        }
      } catch (error) {
        console.error("Error fetching available months:", error);
      }
    };
    fetchAvailableMonths();
  }, [api]);

  // Fetch seats when month/year changes
  useEffect(() => {
    const fetchSeats = async () => {
      if (!selectedMonth || !selectedYear) return;

      setLoading(true);
      try {
        const res = await axios.get(
          `${api}/monthly-booking/seats?month=${selectedMonth}&year=${selectedYear}`,
          { withCredentials: true }
        );
        setSeats(res.data.seats);
        setSelectedSeat(null);
        setSeatDetails(null);
        setSelectedShifts([]);
      } catch (error) {
        console.error("Error fetching seats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, [selectedMonth, selectedYear, api]);

  const fetchSeatDetails = async (seatNumber) => {
    if (!selectedMonth || !selectedYear) return;

    try {
      const res = await axios.get(
        `${api}/monthly-booking/seat/${seatNumber}?month=${selectedMonth}&year=${selectedYear}`,
        { withCredentials: true }
      );
      setSeatDetails(res.data);
      setSelectedShifts([]); // reset shifts when seat changes
      setPriceInfo(null);
    } catch (error) {
      console.error("Error fetching seat details:", error);
    }
  };

  // Fetch price when shifts are selected
  useEffect(() => {
    const fetchPrice = async () => {
      if (selectedShifts.length === 0 || !selectedMonth || !selectedYear || !selectedSeat) {
        setPriceInfo(null);
        return;
      }

      setLoadingPrice(true);
      try {
        // Pass shiftTypes and seatNumber for Day+Night combo pricing
        const res = await axios.get(
          `${api}/payment/price?shiftCount=${selectedShifts.length}&month=${selectedMonth}&year=${selectedYear}&shiftTypes=${encodeURIComponent(JSON.stringify(selectedShifts))}&seatNumber=${selectedSeat.seatNumber}`
        );
        setPriceInfo(res.data);
      } catch (error) {
        console.error("Error fetching price:", error);
      } finally {
        setLoadingPrice(false);
      }
    };
    fetchPrice();
  }, [selectedShifts, selectedMonth, selectedYear, selectedSeat, api]);

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
    fetchSeatDetails(seat.seatNumber);
  };

  // Close seat details (used by mobile-only close button)
  const closeSeatDetails = () => {
    setSelectedSeat(null);
    setSeatDetails(null);
    setSelectedShifts([]);
    setPriceInfo(null);
    setError("");
    setSuccessMessage("");
    setShowDayOnlyPopup(false);
    setPendingDaySelection(false);
  };
  
  const handleMonthChange = (monthData) => {
    setSelectedMonth(monthData.month);
    setSelectedYear(monthData.year);
    setMonthLabel(monthData.label);
    setIsCurrentMonth(monthData.isCurrent);
    setError("");
    setSuccessMessage("");
    setPriceInfo(null);
  };

  // Toggle shift selection - "day" means both morning + afternoon
  const toggleShiftSelection = (displayShift, isAvailable) => {
    if (!isAvailable) return;

    if (displayShift === "day") {
      // Day shift = morning + afternoon combined
      const hasMorning = selectedShifts.includes("morning");
      const hasAfternoon = selectedShifts.includes("afternoon");
      
      if (hasMorning && hasAfternoon) {
        // Remove both Day shifts
        setSelectedShifts((prev) => prev.filter((s) => s !== "morning" && s !== "afternoon" && s !== "night"));
        setDayOnlyConfirmed(false);
      } else {
        // Check if this is Floor 1 (seats 1-25)
        const isFloor1 = selectedSeat && selectedSeat.seatNumber <= 25;
        
        if (isFloor1 && seatDetails) {
          // Check if Night shift is available
          const nightAvailable = isNightShiftAvailable(seatDetails.shifts, selectedSeat.seatNumber);
          
          if (nightAvailable) {
            // Auto-add Night shift for free (Day + Night = ₹600)
            setSelectedShifts((prev) => {
              const newShifts = prev.filter((s) => s !== "morning" && s !== "afternoon" && s !== "night");
              return [...newShifts, "morning", "afternoon", "night"];
            });
            setDayOnlyConfirmed(false);
          } else {
            // Night shift not available - show popup
            // Temporarily add Day shifts for popup display, but don't confirm yet
            setSelectedShifts((prev) => {
              const newShifts = prev.filter((s) => s !== "morning" && s !== "afternoon" && s !== "night");
              return [...newShifts, "morning", "afternoon"];
            });
            setPendingDaySelection(true);
            setShowDayOnlyPopup(true);
            setDayOnlyConfirmed(false);
          }
        } else {
          // Floor 2 or no seat selected - just add Day shifts
          setSelectedShifts((prev) => {
            const newShifts = prev.filter((s) => s !== "morning" && s !== "afternoon");
            return [...newShifts, "morning", "afternoon"];
          });
          setDayOnlyConfirmed(false);
        }
      }
    } else {
      // Night shift - if user manually selects Night only, allow it
      setSelectedShifts((prev) => {
        if (prev.includes(displayShift)) {
          // Remove Night shift
          return prev.filter((s) => s !== displayShift);
        } else {
          // Add Night shift only (₹300)
          // Remove Day shifts if they exist
          const withoutDay = prev.filter((s) => s !== "morning" && s !== "afternoon");
          return [...withoutDay, displayShift];
        }
      });
      setDayOnlyConfirmed(false);
    }
  };

  // Check if a shift is blocked by admin
  const isShiftBlocked = (shift) => {
    return shift?.status === "blocked" || shift?.blockedByAdmin;
  };

  // Check if a shift is protected for current user
  const isShiftProtectedForMe = (shift) => {
    if (!loggedInUser || !shift) return false;
    return shift.status === "protected" &&
           shift.protectedForUser &&
           shift.protectedForUser === loggedInUser._id;
  };

  // Check if shift is protected for someone else
  const isShiftProtectedForOther = (shift) => {
    if (!shift) return false;
    if (shift.status !== "protected") return false;
    // If not logged in, it's protected for "other"
    if (!loggedInUser) return true;
    return shift.protectedForUser && shift.protectedForUser !== loggedInUser._id;
  };

  // Check if "day" shift (morning + afternoon) is available
  const isDayShiftAvailable = (shifts) => {
    const morning = shifts.find((s) => s.shiftType === "morning");
    const afternoon = shifts.find((s) => s.shiftType === "afternoon");

    // Check basic availability
    if (!morning || !afternoon) return false;
    if (morning.status === "booked" && morning.userId) return false;
    if (afternoon.status === "booked" && afternoon.userId) return false;
    if (isShiftBlocked(morning) || isShiftBlocked(afternoon)) return false;

    // If protected for someone else, not available
    if (isShiftProtectedForOther(morning) || isShiftProtectedForOther(afternoon)) return false;

    // If protected for me, it IS available
    if (isShiftProtectedForMe(morning) || isShiftProtectedForMe(afternoon)) return true;

    return true;
  };

  // Check if day shift is blocked by admin
  const isDayShiftBlocked = (shifts) => {
    const morning = shifts.find((s) => s.shiftType === "morning");
    const afternoon = shifts.find((s) => s.shiftType === "afternoon");
    return isShiftBlocked(morning) || isShiftBlocked(afternoon);
  };

  // Check if day shift is protected for someone else
  const isDayShiftProtectedForOther = (shifts) => {
    const morning = shifts.find((s) => s.shiftType === "morning");
    const afternoon = shifts.find((s) => s.shiftType === "afternoon");
    return isShiftProtectedForOther(morning) || isShiftProtectedForOther(afternoon);
  };

  // Check if night shift is available (only Floor 1: seats 1-25 can have night shift)
  const isNightShiftAvailable = (shifts, seatNumber = null) => {
    // Night shift only available for Floor 1 (seats 1-25)
    if (seatNumber && seatNumber > 25) return false;

    const night = shifts.find((s) => s.shiftType === "night");
    if (!night) return false;
    if (night.status === "booked" && night.userId) return false;
    if (isShiftBlocked(night)) return false;
    if (isShiftProtectedForOther(night)) return false;

    return true;
  };

  // Get floor number for a seat
  const getFloor = (seatNumber) => {
    return seatNumber <= 25 ? 1 : 2;
  };

  // Get who booked the day shift (show if either morning or afternoon is booked)
  const getDayShiftBookedBy = (shifts) => {
    const morning = shifts.find((s) => s.shiftType === "morning");
    const afternoon = shifts.find((s) => s.shiftType === "afternoon");
    if (isShiftBlocked(morning) || isShiftBlocked(afternoon)) return null;
    if (morning?.userId) return morning.userDetails?.fullname || "Someone";
    if (afternoon?.userId) return afternoon.userDetails?.fullname || "Someone";
    return null;
  };

  // Check if entire seat is blocked by admin (all shifts blocked)
  const isSeatFullyBlocked = (shifts) => {
    const morning = shifts.find((s) => s.shiftType === "morning");
    const afternoon = shifts.find((s) => s.shiftType === "afternoon");
    const night = shifts.find((s) => s.shiftType === "night");
    return isShiftBlocked(morning) && isShiftBlocked(afternoon) && isShiftBlocked(night);
  };

  // Check if seat is protected for someone else
  const isSeatProtectedForOther = (shifts) => {
    const morning = shifts.find((s) => s.shiftType === "morning");
    const afternoon = shifts.find((s) => s.shiftType === "afternoon");
    const night = shifts.find((s) => s.shiftType === "night");
    return (isShiftProtectedForOther(morning) || isShiftProtectedForOther(afternoon)) && isShiftProtectedForOther(night);
  };

  // Check if seat is protected for me
  const isSeatProtectedForMe = (shifts) => {
    const morning = shifts.find((s) => s.shiftType === "morning");
    return isShiftProtectedForMe(morning);
  };

  const getSeatColor = (shifts, seatNumber) => {
    // Check if fully blocked by admin
    if (isSeatFullyBlocked(shifts)) {
      return "bg-gray-500 text-white"; // Blocked by owner - Gray
    }

    // Check if protected for me (show as purple - my reserved seat)
    if (isSeatProtectedForMe(shifts)) {
      return "bg-purple-500 text-white"; // Protected for me - Purple
    }

    // Check if protected for someone else
    if (isSeatProtectedForOther(shifts)) {
      return "bg-yellow-500 text-white"; // Reserved by someone - Yellow
    }

    const dayAvailable = isDayShiftAvailable(shifts);
    // Night only available for Floor 1 (seats 1-25)
    const nightAvailable = isNightShiftAvailable(shifts, seatNumber);

    // Check if day is blocked (show as blocked color)
    if (isDayShiftBlocked(shifts) && !nightAvailable) {
      return "bg-gray-500 text-white"; // Blocked
    }

    // Check if day is protected for other
    if (isDayShiftProtectedForOther(shifts) && !nightAvailable) {
      return "bg-yellow-500 text-white"; // Reserved
    }

    if (!dayAvailable && !nightAvailable) return "bg-red-600 text-white"; // Fully occupied

    if (dayAvailable && nightAvailable) {
      return "bg-gradient-to-r from-green-500 to-black text-white"; // Both available (Green gradient)
    }

    if (dayAvailable) return "bg-green-500 text-white"; // Day available (Green)
    if (nightAvailable) return "bg-green-900 text-white"; // Night available (Dark Green)

    return "bg-red-600 text-white";
  };

  const handleFilterChange = (shiftType) => {
    setFilters((prev) => ({ ...prev, [shiftType]: !prev[shiftType] }));
  };

  const filteredSeats = seats.filter((seat) => {
    const filterShifts = Object.keys(filters).filter((shift) => filters[shift]);

    if (filterShifts.length === 0) return true; // No filters applied, show all seats

    // Check filters - "day" means morning+afternoon, "night" means night
    return filterShifts.every((shift) => {
      if (shift === "day") {
        return isDayShiftAvailable(seat.shifts);
      } else if (shift === "night") {
        // Night only for seats 1-30
        return isNightShiftAvailable(seat.shifts, seat.seatNumber);
      }
      return true;
    });
  });

  // Price: Use pro-rated price from API or fallback
  const totalPrice = priceInfo?.totalPrice || selectedShifts.length * 300;
  const fullPrice = priceInfo?.fullPrice || selectedShifts.length * 300;

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Failed to load Razorpay script"));
      document.body.appendChild(script);
    });
  };

  // Handle Day-only popup confirmation
  const handleDayOnlyConfirm = () => {
    if (dayOnlyConfirmed) {
      // User confirmed - Day shifts are already selected, just close popup
      setShowDayOnlyPopup(false);
      setPendingDaySelection(false);
    }
  };

  const handleDayOnlyCancel = () => {
    // Cancel - remove Day selection
    setSelectedShifts((prev) => prev.filter((s) => s !== "morning" && s !== "afternoon" && s !== "night"));
    setShowDayOnlyPopup(false);
    setPendingDaySelection(false);
    setDayOnlyConfirmed(false);
  };

  const handleBookNow = async () => {
    try {
      setError("");
      setSuccessMessage("");

      if (!loggedInUser) {
        navigate("/login");
        return;
      }

      if (!selectedSeat || selectedShifts.length === 0) {
        setError("Please select a seat and at least one available shift.");
        return;
      }

      if (!selectedMonth || !selectedYear) {
        setError("Please select a month first.");
        return;
      }

      // If popup is showing and not confirmed, don't proceed
      if (showDayOnlyPopup && !dayOnlyConfirmed) {
        setError("Please confirm your booking choice in the popup.");
        return;
      }

      setIsBooking(true);

      await loadRazorpayScript();

      const createOrderRes = await axios.post(
        `${api}/payment/create-order`,
        {
          seatNumber: selectedSeat.seatNumber,
          shiftTypes: selectedShifts,
          month: selectedMonth,
          year: selectedYear,
        },
        { withCredentials: true }
      );

      const data = createOrderRes.data;

      const options = {
        key: data.key,
        amount: data.amount.toString(),
        currency: data.currency,
        name: "Sai Library",
        description: ` USER: ${loggedInUser?.username} ${" "} Seat ${data.seatNumber} - ${data.shiftTypes.join(", ")} (${data.monthLabel || monthLabel})`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${api}/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );

            let successMsg = `Payment successful! Seat booked for ${monthLabel}`;
            if (verifyRes.data.autoProtected) {
              successMsg += `\n🛡️ Your seat has been automatically protected for ${verifyRes.data.protectedMonth}. You must complete payment by Day 3, or the protection will expire.`;
            }
            setSuccessMessage(successMsg);
            setSelectedShifts([]);
            // Refresh seats for the selected month
            const seatsRes = await axios.get(
              `${api}/monthly-booking/seats?month=${selectedMonth}&year=${selectedYear}`,
              { withCredentials: true }
            );
            setSeats(seatsRes.data.seats);
            if (selectedSeat) {
              fetchSeatDetails(selectedSeat.seatNumber);
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            setError(
              err?.response?.data?.message ||
                "Payment verification failed. Please contact support."
            );
          } finally {
            setIsBooking(false);
          }
        },
        prefill: {
          name: loggedInUser?.fullname || "",
          contact: loggedInUser?.mobile || "",
        },
        theme: { color: "#0f766e" },
        modal: {
          ondismiss: function () {
            setError("Payment was cancelled or popup closed. Please try again.");
            setIsBooking(false);
          },
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Razorpay payment.failed:", response.error);
        const errorMsg =
          response.error?.description ||
          response.error?.reason ||
          "Payment failed. Please try again.";
        setError(errorMsg);
        setIsBooking(false);
      });

      rzp.open();
    } catch (err) {
      console.error("Error during booking:", err);
      setError(
        err?.response?.data?.message ||
          "Something went wrong while initiating payment. Please try again."
      );
      setIsBooking(false);
    }
  };

  if (loading && availableMonths.length === 0) return <SeatSkeleton />;

  return (
    <div className="p-4 md:p-6 relative z-0">
      <h2 className="text-2xl font-bold text-center mb-4">Seat Availability</h2>

      {/* Month Selector - Like Movie Theater */}
      <div className="mb-6 bg-[--primary-light-color] dark:bg-[--primary-dark-color] p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3 text-center">📅 Select Month for Booking</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {availableMonths.map((m) => (
            <button
              key={`${m.month}-${m.year}`}
              onClick={() => handleMonthChange(m)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedMonth === m.month && selectedYear === m.year
                  ? "bg-teal-600 text-white shadow-lg scale-105"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-teal-100 dark:hover:bg-teal-900"
              } ${m.isCurrent ? "ring-2 ring-teal-400" : ""}`}
            >
              {m.label}
              {m.isCurrent && <span className="ml-1 text-xs">(Current)</span>}
            </button>
          ))}
        </div>
        {monthLabel && (
          <p className="text-center mt-3 text-sm text-gray-600 dark:text-gray-400">
            Showing seats for: <strong className="text-teal-600">{monthLabel}</strong>
          </p>
        )}
      </div>

      {loading ? (
        <SeatSkeleton />
      ) : (
      <div className="flex flex-col md:flex-row gap-4 flex-wrap justify-between">
        {/* Seat Details First & Sticky on Mobile */}
        {selectedSeat && seatDetails && (
          <div className="relative w-full md:w-1/3 p-4  rounded-lg  shadow sticky top-[10vh] z-10 bg-[--primary-light-color] dark:bg-[--primary-dark-color]">
            {/* Mobile-only close button */}
            <button
              onClick={closeSeatDetails}
              title="Close details"
              className="md:hidden absolute top-3 right-3 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
            >
              ✕
            </button>
             <h3 className="text-xl font-[font1] tracking-wider font-bold">
               Seat Details
             </h3>
            <p className="text-md mt-2">
              <strong>Seat Number:</strong> {getFloor(selectedSeat.seatNumber) === 1 ? selectedSeat.seatNumber : selectedSeat.seatNumber - 25}
              <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                getFloor(selectedSeat.seatNumber) === 1
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
              }`}>
                Floor {getFloor(selectedSeat.seatNumber)}
              </span>
            </p>
            <p className="text-sm text-teal-600 dark:text-teal-400 mt-1">
              📅 Booking for: <strong>{monthLabel}</strong>
            </p>
            <div className="siftavailable bg-[--light-color] dark:bg-[--dark-color] p-4 pt-6 mt-5 rounded-lg relative">
              <h4 className="text-md font-semibold absolute -top-3 -left-2 bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] py-1 px-2 rounded-full ">
                Shift Availability
              </h4>

              {/* Day Shift (Morning + Afternoon combined) */}
              {(() => {
                const morning = seatDetails.shifts.find((s) => s.shiftType === "morning");
                const dayAvailable = isDayShiftAvailable(seatDetails.shifts);
                const dayBlocked = isDayShiftBlocked(seatDetails.shifts);
                const dayProtectedForMe = isShiftProtectedForMe(morning);
                const dayProtectedForOther = isDayShiftProtectedForOther(seatDetails.shifts);
                const dayBooked = getDayShiftBookedBy(seatDetails.shifts);
                const isDaySelected = selectedShifts.includes("morning") && selectedShifts.includes("afternoon");
                return (
                  <div className={`flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600 ${(dayBlocked || dayProtectedForOther) ? 'opacity-60' : ''}`}>
                    <p>
                      <strong>☀️ Day Shift:</strong>{" "}
                      <span className="text-xs text-gray-500">(Morning + Afternoon)</span>
                      <br />
                      {dayBlocked
                        ? <span className="text-gray-500 font-semibold">🚫 Blocked by Owner</span>
                        : dayProtectedForMe
                          ? <span className="text-purple-600 font-semibold">🛡️ Protected for You - Book Now!</span>
                          : dayProtectedForOther
                            ? <span className="text-yellow-600 font-semibold">⏳ Reserved (expires Day 3)</span>
                            : dayBooked
                              ? `Booked by ${dayBooked}`
                              : <span className="text-green-600">Available</span>}
                    </p>
                    <input
                      type="checkbox"
                      disabled={!dayAvailable || isBooking || dayBlocked || dayProtectedForOther}
                      checked={isDaySelected}
                      onChange={() => toggleShiftSelection("day", dayAvailable)}
                      className="w-5 h-5 cursor-pointer accent-green-500 disabled:cursor-not-allowed"
                    />
                  </div>
                );
              })()}

              {/* Night Shift - Only for seats 1-25 */}
              {(() => {
                const nightShift = seatDetails.shifts.find((s) => s.shiftType === "night");
                const isFloor2 = selectedSeat.seatNumber > 25;
                const isAdminBlocked = isShiftBlocked(nightShift);
                const nightProtectedForMe = isShiftProtectedForMe(nightShift);
                const nightProtectedForOther = isShiftProtectedForOther(nightShift);
                const nightAvailable = isNightShiftAvailable(seatDetails.shifts, selectedSeat.seatNumber);
                const isNightSelected = selectedShifts.includes("night");

                return (
                  <div className={`flex items-center justify-between py-2 ${(isFloor2 || isAdminBlocked || nightProtectedForOther) ? 'opacity-60' : ''}`}>
                    <p>
                      <strong>🌙 Night Shift:</strong>
                      <br />
                      {isFloor2
                        ? <span className="text-orange-500">Not available for Floor 2</span>
                        : isAdminBlocked
                          ? <span className="text-gray-500 font-semibold">🚫 Blocked by Owner</span>
                          : nightProtectedForMe
                            ? <span className="text-purple-600 font-semibold">🛡️ Protected for You!</span>
                            : nightProtectedForOther
                              ? <span className="text-yellow-600 font-semibold">⏳ Reserved</span>
                              : nightShift?.userId
                                ? `Booked by ${nightShift.userDetails?.fullname || "Someone"}`
                                : <span className="text-green-600">Available</span>}
                    </p>
                    <input
                      type="checkbox"
                      disabled={!nightAvailable || isBooking || isFloor2 || isAdminBlocked || nightProtectedForOther}
                      checked={isNightSelected}
                      onChange={() => toggleShiftSelection("night", nightAvailable)}
                      className="w-5 h-5 cursor-pointer accent-green-800 disabled:cursor-not-allowed"
                    />
                  </div>
                );
              })()}

              {selectedShifts.length > 0 && (
                <div className="mt-4 font-semibold bg-teal-100 dark:bg-teal-900 p-3 rounded">
                  {loadingPrice ? (
                    <p>Calculating price...</p>
                  ) : (
                    <>
                      <p className="text-lg">
                        Total: ₹{totalPrice}
                        {priceInfo?.isProRated && fullPrice > totalPrice && (
                          <span className="line-through text-gray-500 text-sm ml-2">₹{fullPrice}</span>
                        )}
                      </p>
                      {/* Show special pricing info for Day+Night combo */}
                      {selectedSeat && selectedSeat.seatNumber <= 25 && 
                       selectedShifts.includes("morning") && 
                       selectedShifts.includes("afternoon") && 
                       selectedShifts.includes("night") && (
                        <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                          ✨ Day + Night combo: Night shift included FREE!
                        </p>
                      )}
                      {selectedShifts.includes("night") && 
                       !selectedShifts.includes("morning") && 
                       !selectedShifts.includes("afternoon") && (
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          🌙 Night shift only: ₹250
                        </p>
                      )}
                      {priceInfo?.isProRated && (
                        <p className="text-xs text-teal-700 dark:text-teal-300 mt-1">
                          📅 Pro-rated for {priceInfo.remainingDays} remaining days this month
                          {priceInfo.savings > 0 && <span className="ml-1 text-green-600">(Save ₹{priceInfo.savings})</span>}
                        </p>
                      )}
                      <span className="block text-sm text-gray-600 dark:text-gray-400 mt-1">
                        for {monthLabel}
                      </span>
                    </>
                  )}
                </div>
              )}
              {error && (
                <p className="mt-2 text-sm text-red-600 font-semibold">
                  {error}
                </p>
              )}
              {successMessage && (
                <p className="mt-2 text-sm text-green-600 font-semibold">
                  {successMessage}
                </p>
              )}
              {/* BOOKING BUTTON ---------------------------------- */}
              <button
                onClick={handleBookNow}
                disabled={
                  isBooking || selectedShifts.length === 0 || !selectedSeat || loggedInUser?.isAdmin
                }
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isBooking ? "Processing..." : `Book Now - ₹${totalPrice}`}
              </button>
              {loggedInUser?.isAdmin && (
  <button
   disabled={
                  isBooking || selectedShifts.length === 0 || !selectedSeat
                }
    onClick={() =>
      navigate("/admin/bookseat", {
        state: {
          seatNumber: selectedSeat?.seatNumber,
          month: selectedMonth,
          year: selectedYear,
          shiftTypes: selectedShifts, // array of selected shifts
        },
      })
    }
    className="mt-4 w-full bg-white text-black font-bold py-2 rounded-md border"
  >
    Book For User (Only Admin)
  </button>
)}


              {/* Admin Block/Unblock Controls */}
              <AdminBlockControls
                loggedInUser={loggedInUser}
                seatDetails={seatDetails}
                selectedSeat={selectedSeat}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                availableMonths={availableMonths}
                isSeatFullyBlocked={isSeatFullyBlocked}
                fetchSeatDetails={fetchSeatDetails}
                setSeats={setSeats}
                setError={setError}
                setSuccessMessage={setSuccessMessage}
                api={api}
              />
            </div>
          </div>
        )}

        {/* Filters and Seat Grid Together */}
        <div className="flex-1 flex flex-col md:flex-row gap-4">
          {/* Filters - Day and Night only */}
          <div className="md:w-1/4 bg-[--primary-light-color] dark:bg-[--primary-dark-color] p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Filter by Shift</h3>
            {/* Day Shift Filter */}
            <label className="block text-sm font-medium mt-1 p-2 rounded-lg cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.day}
                  onChange={() => handleFilterChange("day")}
                  className="appearance-none w-6 h-6 border-2 border-gray-500 rounded-md transition-all duration-200 focus:ring-2 focus:ring-opacity-50 focus:outline-none mr-2 checked:bg-green-500 checked:border-green-600"
                />
                <span>☀️ Day Shift</span>
                <span className="ml-1 text-xs text-gray-500">(₹500)</span>
              </div>
            </label>
            {/* Night Shift Filter */}
            <label className="block text-sm font-medium mt-1 p-2 rounded-lg cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/40">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.night}
                  onChange={() => handleFilterChange("night")}
                  className="appearance-none w-6 h-6 border-2 border-gray-500 rounded-md transition-all duration-200 focus:ring-2 focus:ring-opacity-50 focus:outline-none mr-2 checked:bg-green-800 checked:border-green-900"
                />
                <span>🌙 Night Shift</span>
                <span className="ml-1 text-xs text-gray-500">(₹250)</span>
              </div>
            </label>

            {/* Legend - Dropdown on Mobile, Expanded on Desktop */}
            <SeatLegend />
          </div>

          {/* Seat Grid - Two Floors */}
          <div className="flex-1 bg-[--primary-light-color] dark:bg-[--primary-dark-color] p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4 text-center">
              Available Seats
            </h2>

            {/* Floor 1: Seats 1-25 (Day + Night) */}
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-sm">🏢 Floor 1</span>
                <span className="text-xs text-gray-500">(Seats 1-25 • Day + Night)</span>
              </h3>
              <div className="flex justify-start flex-wrap gap-2">
                {(filteredSeats.length ? filteredSeats : seats)
                  .filter((seat) => seat.seatNumber <= 25)
                  .map((seat) => (
                    <div
                      key={seat.seatNumber}
                      className={`w-12 h-12 flex items-center justify-center rounded-lg cursor-pointer transition-transform hover:scale-110 ${getSeatColor(
                        seat.shifts,
                        seat.seatNumber
                      )}`}
                      onClick={() => handleSeatClick(seat)}
                    >
                      {seat.seatNumber}
                    </div>
                  ))}
              </div>
            </div>

            {/* Floor 2: Seats 1-34 (internally 26-59, Day only) */}
            <div>
              <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                <span className="bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded text-sm">🏢 Floor 2</span>
                <span className="text-xs text-gray-500">(Seats 1-34 • Day only)</span>
              </h3>
              <div className="flex justify-start flex-wrap gap-2">
                {(filteredSeats.length ? filteredSeats : seats)
                  .filter((seat) => seat.seatNumber > 25)
                  .map((seat) => (
                    <div
                      key={seat.seatNumber}
                      className={`w-12 h-12 flex items-center justify-center rounded-lg cursor-pointer transition-transform hover:scale-110 ${getSeatColor(
                        seat.shifts,
                        seat.seatNumber
                      )}`}
                      onClick={() => handleSeatClick(seat)}
                    >
                      {seat.seatNumber - 25}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Day-Only Confirmation Popup */}
      {showDayOnlyPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Night Shift Not Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This seat is not available for the Night shift. Do you want to continue booking for the Day shift only?
            </p>
            
            <label className="flex items-center mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={dayOnlyConfirmed}
                onChange={(e) => setDayOnlyConfirmed(e.target.checked)}
                className="w-5 h-5 mr-3 accent-green-600"
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                I want to book this seat for the Day shift only.
              </span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={handleDayOnlyConfirm}
                disabled={!dayOnlyConfirmed}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue with Day Only
              </button>
              <button
                onClick={handleDayOnlyCancel}
                className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SeatSkeleton = () => {
  return (
    <div className="p-4 md:p-6 animate-pulse">
      <h2 className="text-2xl font-bold text-center mb-4 bg-[--primary-light-color] dark:bg-[--primary-dark-color] h-8 w-1/3 mx-auto rounded" />

      <div className="flex flex-col md:flex-row gap-4 flex-wrap justify-between">
        {/* Seat Details Skeleton */}
        <div className="w-full md:w-1/3 p-4 rounded-lg shadow bg-[--primary-light-color] dark:bg-[--primary-dark-color] space-y-4">
          <div className="h-6 w-2/3 bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] rounded" />
          <div className="h-4 w-1/2 bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] rounded" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] rounded" />
            <div className="h-3 w-5/6 bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] rounded" />
            <div className="h-3 w-4/6 bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] rounded" />
          </div>
        </div>

        {/* Filters and Grid Skeleton */}
        <div className="flex-1 flex flex-col md:flex-row gap-4">
          {/* Filters */}
          <div className="md:w-1/4 bg-[--primary-light-color] dark:bg-[--primary-dark-color] p-4 rounded-lg space-y-4">
            <div className="h-4 w-1/2 bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] rounded" />
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 h-6 w-full bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] rounded"
              />
            ))}
          </div>

          {/* Seat Grid */}
          <div className="flex-1 bg-[--primary-light-color] dark:bg-[--primary-dark-color] p-4 rounded-lg">
            <div className="h-4 w-1/3 mx-auto bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] rounded mb-4" />
            <div className="flex flex-wrap gap-2">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-lg bg-[--secondary-light-color] dark:bg-[--secondary-dark-color]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Seat Legend Component - Dropdown on Mobile, Expanded on Desktop
const SeatLegend = () => {
  const [isOpen, setIsOpen] = useState(false);

  const legendItems = [
    { color: "bg-green-500", label: "Day Available" },
    { color: "bg-green-800", label: "Night Available" },
    { color: "bg-gradient-to-r from-green-500 to-green-800", label: "Both Available" },
    { color: "bg-purple-500", label: "🛡️ My Protected" },
    { color: "bg-yellow-500", label: "⏳ Reserved" },
    { color: "bg-red-600", label: "Fully Booked" },
    { color: "bg-gray-500", label: "🚫 Blocked" },
  ];

  return (
    <div className="mt-4 pt-3 border-t border-gray-300 dark:border-gray-600">
      {/* Mobile: Dropdown Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg"
      >
        <span className="flex items-center gap-2">
          <span className="flex gap-0.5">
            {legendItems.slice(0, 4).map((item, i) => (
              <div key={i} className={`w-3 h-3 ${item.color} rounded-sm`}></div>
            ))}
          </span>
          <span>Seat Colors</span>
        </span>
        <span className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {/* Mobile: Dropdown Content */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 mt-2" : "max-h-0"}`}>
        <div className="grid grid-cols-2 gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div className={`w-4 h-4 ${item.color} rounded`}></div>
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </div>
        {/* Floor Info - Mobile */}
        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">🏢 Floors</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">F1: 1-25 (Day+Night) | F2: 1-34 (Day)</p>
        </div>
      </div>

      {/* Desktop: Always Visible */}
      <div className="hidden md:block">
        <p className="text-xs text-gray-500 mb-2">Seat Colors:</p>
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-xs mb-1">
            <div className={`w-4 h-4 ${item.color} rounded`}></div>
            <span>{item.label}</span>
          </div>
        ))}

        {/* Floor Info - Desktop */}
        <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
          <p className="text-xs text-gray-500 mb-1 font-semibold">🏢 Floor Info:</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Floor 1: Seats 1-25 (Day + Night)</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Floor 2: Seats 1-34 (Day only)</p>
        </div>

        {/* Night Shift Note */}
        <p className="text-xs text-orange-500 mt-2">
          ⚠️ Night shift only for Floor 1
        </p>
      </div>
    </div>
  );
};

// Admin Block Controls Component with multi-month selection
const AdminBlockControls = ({
  loggedInUser,
  seatDetails,
  selectedSeat,
  selectedMonth,
  selectedYear,
  availableMonths,
  isSeatFullyBlocked,
  fetchSeatDetails,
  setSeats,
  setError,
  setSuccessMessage,
  api,
}) => {
  const [selectedBlockMonths, setSelectedBlockMonths] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize with current month selected
  useEffect(() => {
    if (selectedMonth && selectedYear) {
      setSelectedBlockMonths([{ month: selectedMonth, year: selectedYear }]);
    }
  }, [selectedMonth, selectedYear]);

  if (!loggedInUser?.isAdmin ||!seatDetails) return null;

  const isBlocked = isSeatFullyBlocked(seatDetails.shifts);

  const toggleMonthSelection = (monthData) => {
    const key = `${monthData.month}-${monthData.year}`;
    const exists = selectedBlockMonths.some(
      (m) => `${m.month}-${m.year}` === key
    );

    if (exists) {
      setSelectedBlockMonths(
        selectedBlockMonths.filter((m) => `${m.month}-${m.year}` !== key)
      );
    } else {
      setSelectedBlockMonths([...selectedBlockMonths, { month: monthData.month, year: monthData.year }]);
    }
  };

  const isMonthSelected = (monthData) => {
    return selectedBlockMonths.some(
      (m) => m.month === monthData.month && m.year === monthData.year
    );
  };

  const handleBlockUnblock = async (action) => {
    if (selectedBlockMonths.length === 0) {
      setError("Please select at least one month");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const endpoint = action === "block" ? "/admin/block-seat" : "/admin/unblock-seat";

      // Process each selected month
      for (const monthData of selectedBlockMonths) {
        await axios.post(
          `${api}${endpoint}`,
          {
            seatNumber: selectedSeat.seatNumber,
            shiftTypes: ["morning", "afternoon", "night"],
            month: monthData.month,
            year: monthData.year,
          },
          { withCredentials: true }
        );
      }

      const monthLabels = selectedBlockMonths.map((m) => {
        const found = availableMonths.find((am) => am.month === m.month && am.year === m.year);
        return found?.label || `${m.month}/${m.year}`;
      }).join(", ");

      setSuccessMessage(
        `Seat ${action === "block" ? "blocked" : "unblocked"} for: ${monthLabels}`
      );

      // Refresh current month view
      fetchSeatDetails(selectedSeat.seatNumber);
      const seatsRes = await axios.get(
        `${api}/monthly-booking/seats?month=${selectedMonth}&year=${selectedYear}`,
        { withCredentials: true }
      );
      setSeats(seatsRes.data.seats);
    } catch (err) {
      setError(err?.response?.data?.message || `Failed to ${action} seat`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        🔒 Admin Controls
      </p>

      {/* Month Selection for Blocking */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Select months to {isBlocked ? "unblock" : "block"}:
        </p>
        <div className="flex flex-wrap gap-1">
          {availableMonths.map((m) => (
            <button
              key={`${m.month}-${m.year}`}
              onClick={() => toggleMonthSelection(m)}
              className={`px-2 py-1 text-xs rounded transition-all ${
                isMonthSelected(m)
                  ? "bg-teal-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {m.label.split(" ")[0]}
              {m.isCurrent && " •"}
            </button>
          ))}
        </div>
        {selectedBlockMonths.length > 0 && (
          <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">
            {selectedBlockMonths.length} month(s) selected
          </p>
        )}
      </div>

      {/* Block/Unblock Button */}
      {isBlocked ? (
        <button
          onClick={() => handleBlockUnblock("unblock")}
          disabled={isProcessing || selectedBlockMonths.length === 0}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Processing..." : `✅ Unblock for ${selectedBlockMonths.length} month(s)`}
        </button>
      ) : (
        <button
          onClick={() => handleBlockUnblock("block")}
          disabled={isProcessing || selectedBlockMonths.length === 0}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Processing..." : `🚫 Block for ${selectedBlockMonths.length} month(s)`}
        </button>
      )}
        
      {/* Quick Actions */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => setSelectedBlockMonths(availableMonths.map((m) => ({ month: m.month, year: m.year })))}
          className="flex-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 py-1 px-2 rounded"
        >
          Select All
        </button>
        <button
          onClick={() => setSelectedBlockMonths([{ month: selectedMonth, year: selectedYear }])}
          className="flex-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 py-1 px-2 rounded"
        >
          Current Only
        </button>
      </div>
    </div>
  );
};

export default SeatDetails;
