export function generateSlots(unavailable, bookings) {
  const slots = [
    "09:00","10:00","11:00","12:00",
    "13:00","14:00","15:00","16:00"
  ];

  const bookedTimes = bookings.map(b => b.time);

  return slots.filter(
    s => !unavailable.includes(s) && !bookedTimes.includes(s)
  );
}
