import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditStudent = ({ loggedInUser }) => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [seatsInformations, setSeatsInformations] = useState([]);
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [message, setmessage] = useState("");
  const api = import.meta.env.VITE_API_BASE_URL;


  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await axios.get(`${api}/seat`, {
          withCredentials: true,
        });
        setSeatsInformations(res.data);
      } catch (error) {
        console.error("Error fetching seats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [message]);

  useEffect(() => {
    if (selectedShifts.length > 0) {
      filterAvailableSeats();
    }
  }, [selectedShifts]);

  const handleShiftSelection = (shiftType) => {
    setSelectedShifts((prevShifts) =>
      prevShifts.includes(shiftType)
        ? prevShifts.filter((s) => s !== shiftType)
        : [...prevShifts, shiftType]
    );
  };



  const filterAvailableSeats = () => {
    //  filter if studentId is already assigned to the seat the show the seat if available for selected sift for perticular seat id assigned to the student  and show msg if not available not avilable the seat you are assinged before is not available for the selected shift
    const filteredSeats = seatsInformations.filter((seat) => {
      // If full-day is selected, check if all shifts (morning, afternoon, night) are available
      if (
        selectedShifts.includes("morning") &&
        selectedShifts.includes("afternoon") &&
        selectedShifts.includes("night")
      ) {
        return ["morning", "afternoon", "night"].every((shift) =>
          seat.shifts.find((s) => s.shiftType === shift && s.studentId === null)
        );
      }
      // If full-time (morning & afternoon) is selected, check for both
      else if (
        selectedShifts.includes("morning") &&
        selectedShifts.includes("afternoon")
      ) {
        return ["morning", "afternoon"].every((shift) =>
          seat.shifts.find((s) => s.shiftType === shift && s.studentId === null)
        );
      }
      // If  (morning & night) is selected, check for both
      else if (
        selectedShifts.includes("morning") &&
        selectedShifts.includes("night")
      ) {
        return ["morning", "night"].every((shift) =>
          seat.shifts.find((s) => s.shiftType === shift && s.studentId === null)
        );
      }
      // If full-time (morning & afternoon) is selected, check for both
      else if (
        selectedShifts.includes("afternoon") &&
        selectedShifts.includes("night")
      ) {
        return ["night", "afternoon"].every((shift) =>
          seat.shifts.find((s) => s.shiftType === shift && s.studentId === null)
        );
      }
      // Otherwise, check if any of the selected shifts are available
      else {
        return selectedShifts.some((shift) =>
          seat.shifts.find((s) => s.shiftType === shift && s.studentId === null)
        );
      }
    });

    setAvailableSeats(filteredSeats);
  };


  
  const assignSeat = async () => {
    if (!selectedSeat || selectedShifts.length === 0) {
      alert("Please select a seat and shift(s) before assigning.");
      return;
    }

    try {
      await axios.post(
        `${api}/seat/assign`,
        {
          seatNumber: selectedSeat,
          studentId, //actual student ID
          shiftType: selectedShifts,
        },
        { withCredentials: true }
      );

      setSelectedSeat(null);
      setSelectedShifts([]);
      setmessage("Seat assigned successfully! redirecting to seats ");
      setTimeout(() => {
        setmessage("");

        navigate("/seats"); // Redirect to seats page after successfully assigning
      }, 2000);
    } catch (error) {
      console.error("Error assigning seat:", error.response.data.error);
      // console.log(error);
      setmessage(error.response.data.message);
      setSelectedSeat(null);
      setSelectedShifts([]);
      setTimeout(() => {
        setmessage("");
      }, 7000);
    }
  };

  return (
    <div>
      {loading ? (
        "Loading..."
      ) : (
        <div className="p-6 w-full min-h-[90vh] xl:w-[70vw] mx-auto   ">
          {message && (
            <div className="massage  w-[80vw] md:w-[50vw] lg:w-[50vw] xl:w-[40vw]   bg-green-400 text-center mx-auto my-4 rounded-lg p-4   absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2  z-50 text-black">
              <h1 className="text-2xl font-bold mb-4 text-center capitalize ">message</h1>
              <p className="text-lg mb-4 px-1 py-3 bg-green-500">{message}</p>
              <div onClick={() => setmessage("")} className="absolute top-0 right-0  opacity-50 p-4  rounded-full cursor-pointer hover:bg-red-500 hover:opacity-100 overflow-hidden ">
              </div>
            </div>
          )}

         <div className="mx-auto my-10 bg-[--primary-light-color] dark:bg-[--primary-dark-color] w-[80vw] md:w-[50vw] lg:w-[50vw] xl:w-[40vw] h-[10vh] flex items-center justify-center ">
          <h1>
            Assign seat to student Id {studentId} 
          </h1>
         </div>

          <div className="md:w-1/4 bg-[--primary-light-color] dark:bg-[--primary-dark-color] p-4 rounded-lg relative">
          <h4 className="text-xl text-nowrap font-bold absolute transform -translate-y-[50%] -translate-x-[50%] bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] px-4  py-1  rounded-full top-0 left-1/2 ">
               Select Sift
              </h4>
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
                  className="block text-sm font-medium mt-1 p-2 rounded-lg cursor-pointer hover:bg-[--secondary-light-color] dark:hover:bg-[--secondary-dark-color]"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      value={shift}
                      checked={selectedShifts.includes(shift)}
                      onChange={() => handleShiftSelection(shift)}
                      className={`appearance-none w-6 h-6 border-2 border-gray-500 rounded-md transition-all duration-200 focus:ring-2 focus:ring-opacity-50 focus:outline-none mr-2 ${shiftColors[shift]}`}
                    />
                    {shift.charAt(0).toUpperCase() + shift.slice(1)}
                  </div>
                </label>
              );
            })}
          </div>

          <div className="mt-10">
            {selectedShifts.length > 0 && (
              <div className="bg-[--primary-light-color] dark:bg-[--primary-dark-color] p-4  rounded-lg relative my-4 pt-8">
                <h4 className="text-xl text-nowrap font-bold absolute transform -translate-y-[50%] -translate-x-[50%] bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] px-4  py-1  rounded-full top-0 left-1/2 ">
                     Select Seat
                    </h4>
                <div className="grid grid-cols-5 gap-2 md:grid-cols-10 lg:grid-cols-15">
                  {availableSeats.map((seat) => {
                    const isSelected = selectedSeat === seat.seatNumber;
                    const seatColor =
                      seat.status === "morning"
                        ? "bg-yellow-500"
                        : seat.status === "afternoon"
                        ? "bg-blue-500"
                        : seat.status === "night"
                        ? "bg-black text-white"
                        : "bg-red-500"; // Not available

                    return (
                      <button
                        key={seat.seatNumber}
                        onClick={() => setSelectedSeat(seat.seatNumber)}
                        className={`w-10 h-10 rounded-sm flex items-center justify-center text-sm font-bold 
              ${seatColor} ${
                          isSelected
                            ? "ring-2 ring-green-500 bg-green-900 text-white"
                            : "opacity-80 hover:opacity-100"
                        }`}
                        disabled={seat.status === "not-available"}
                      >
                        {seat.seatNumber}
                      </button>
                    );
                  })}
                </div>
                <button
          className="bg-green-500 px-3 py-2 rounded-full hover:bg-green-600 text-white hover:scale-110 my-5"
            onClick={assignSeat}
            disabled={!selectedSeat || selectedShifts.length === 0}
          >
            Assign Seat
          </button>
              </div>
           
           )}
          </div>

          
        </div>
      )}
    </div>
  );
};

export default EditStudent;
