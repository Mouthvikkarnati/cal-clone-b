import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);

export function generateAvailableSlots({
  date,
  availability,
  bookings,
  duration,
  buffer
}) {
  const slots = [];
  const step = duration + buffer;

  for (const rule of availability) {
    let cursor = dayjs.utc(`${date}T${rule.startTime}`);
    const end = dayjs.utc(`${date}T${rule.endTime}`);

    while (cursor.add(duration, "minute").isSameOrBefore(end)) {
      const slotStart = cursor;
      const slotEnd = cursor.add(duration, "minute");

      const overlaps = bookings.some(b =>
        slotStart.isBefore(dayjs.utc(b.end)) &&
        slotEnd.isAfter(dayjs.utc(b.start))
      );

      if (!overlaps) {
        slots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString()
        });
      }

      cursor = cursor.add(step, "minute");
    }
  }

  return slots;
}
