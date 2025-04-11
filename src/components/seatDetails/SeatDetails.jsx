import { useEffect, useState } from "react";
import axios from "axios";

const SeatDetails = () => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [seatDetails, setSeatDetails] = useState(null);
  const [filters, setFilters] = useState({
    morning: false,
    afternoon: false,
    night: false,
  });
  const api = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await axios.get(`${api}/seat`, { withCredentials: true });
        setSeats(res.data);
      } catch (error) {
        console.error("Error fetching seats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, []);

  const fetchSeatDetails = async (seatNumber) => {
    try {
      const res = await axios.get(`${api}/seat/${seatNumber}`, {
        withCredentials: true,
      });
      setSeatDetails(res.data);
    } catch (error) {
      console.error("Error fetching seat details:", error);
    }
  };

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
    fetchSeatDetails(seat.seatNumber);
  };

  const getSeatColor = (shifts) => {
    const availableShifts = shifts
      .filter((shift) => !shift.studentId)
      .map((shift) => shift.shiftType);

    if (!availableShifts.length) return "bg-red-600 text-white"; // Fully occupied

    if (availableShifts.length === 1) {
      return {
        morning: "bg-yellow-400",
        afternoon: "bg-blue-400",
        night: "bg-black text-white",
      }[availableShifts[0]];
    }

    // Predefined colors for multiple shift availability
    if (availableShifts.length === 2) {
      if (
        availableShifts.includes("morning") &&
        availableShifts.includes("afternoon")
      ) {
        return "bg-gradient-to-r from-yellow-400 to-blue-400";
      }
      if (
        availableShifts.includes("morning") &&
        availableShifts.includes("night")
      ) {
        return "bg-gradient-to-r from-yellow-400 to-gray-800 text-white";
      }
      if (
        availableShifts.includes("afternoon") &&
        availableShifts.includes("night")
      ) {
        return "bg-gradient-to-r from-blue-400 to-gray-800 text-white";
      }
    }

    // All three shifts available
    return "bg-gradient-to-r from-yellow-400 via-blue-400 to-gray-800 text-white";
  };

  const handleFilterChange = (shiftType) => {
    setFilters((prev) => ({ ...prev, [shiftType]: !prev[shiftType] }));
  };
  const filteredSeats = seats.filter((seat) => {
    const selectedShifts = Object.keys(filters).filter(
      (shift) => filters[shift]
    );

    if (selectedShifts.length === 0) return true; // No filters applied, show all seats

    // Check if the seat has ALL selected shifts available
    return selectedShifts.every((shift) =>
      seat.shifts.some((s) => s.shiftType === shift && !s.studentId)
    );
  });

  if (loading) return <SeatSkeleton />;

  return (
    <div className="p-4 md:p-6 relative z-0">
      <h2 className="text-2xl font-bold text-center mb-4">Seat Availability</h2>

      <div className="flex flex-col md:flex-row gap-4 flex-wrap justify-between">
        {/* Seat Details First & Sticky on Mobile */}
        {selectedSeat && seatDetails && (
          <div className="w-full md:w-1/3 p-4  rounded-lg  shadow sticky top-[10vh] z-10 bg-[--primary-light-color] dark:bg-[--primary-dark-color]">
            <h3 className="text-xl font-[font1] tracking-wider  font-bold">
              Seat Details
            </h3>
            <p className="text-md  mt-2">
              <strong>Seat Number:</strong> {selectedSeat.seatNumber}
            </p>
            <div className="siftavailable bg-[--light-color] dark:bg-[--dark-color] p-4 pt-6 mt-5 rounded-lg relative">
              <h4 className="text-md font-semibold absolute -top-3 -left-2 bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] py-1 px-2 rounded-full ">
                Shift Availability
              </h4>
              {seatDetails.shifts.map((shift) => (
                <p key={shift.shiftType}>
                  <strong>
                    {shift.shiftType.charAt(0).toUpperCase() +
                      shift.shiftType.slice(1)}
                    :
                  </strong>{" "}
                  {shift.studentId
                    ? `Occupied by ${shift.userDetails?.fullname || "Unknown"}`
                    : " Available"}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Seat Grid Together */}
        <div className="flex-1 flex flex-col md:flex-row gap-4">
          {/* Filters */}
          <div className="md:w-1/4 bg-[--primary-light-color] dark:bg-[--primary-dark-color] p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Filters Shifts</h3>
            {["morning", "afternoon", "night"].map((shift) => {
              // Define dynamic colors for each shift
              const shiftColors = {
                morning: "checked:bg-yellow-400 checked:border-yellow-500",
                afternoon: "checked:bg-blue-400 checked:border-blue-500",
                night: "checked:bg-black checked:border-gray-700",
              };

              return (
                <label
                  key={shift}
                  className="block text-sm font-medium mt-1 p-2 rounded-lg cursor-pointer"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters[shift]}
                      onChange={() => handleFilterChange(shift)}
                      className={`appearance-none w-6 h-6 border-2 border-gray-500 rounded-md transition-all duration-200 focus:ring-2 focus:ring-opacity-50 focus:outline-none mr-2 ${shiftColors[shift]}`}
                    />
                    {shift.charAt(0).toUpperCase() + shift.slice(1)}
                  </div>
                </label>
              );
            })}
          </div>

          {/* Seat Grid */}
          <div className="flex-1  bg-[--primary-light-color] dark:bg-[--primary-dark-color] p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4 text-center">
              Available Seats
            </h2>
            <div className="flex justify-start  flex-wrap gap-2">
              {(filteredSeats.length ? filteredSeats : seats).map((seat) => (
                <div
                  key={seat.seatNumber}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg cursor-pointer ${getSeatColor(
                    seat.shifts
                  )}`}
                  onClick={() => handleSeatClick(seat)}
                >
                  {seat.seatNumber}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
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


export default SeatDetails;
