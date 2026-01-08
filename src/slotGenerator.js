import dayjs from "dayjs";

export function generateSlots(start, end, duration, buffer) {
  const slots = [];
  let current = dayjs(start);

  while (current.add(duration, "minute").isBefore(end)) {
    slots.push({
      start: current.toISOString(),
      end: current.add(duration, "minute").toISOString()
    });
    current = current.add(duration + buffer, "minute");
  }
  return slots;
}
