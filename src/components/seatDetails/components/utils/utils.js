export const getFloorAndSeat = (seatNumber) => {
  if (seatNumber <= 25) {
    return { floor: "F1", finalSeat: seatNumber };
  }
  return { floor: "F2", finalSeat: seatNumber - 25 };
};
