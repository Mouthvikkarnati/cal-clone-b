export function generateICS({ uid, start, end, summary }) {
  return `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Cal Scheduler//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${formatICS(new Date())}
DTSTART:${formatICS(start)}
DTEND:${formatICS(end)}
SUMMARY:${summary}
END:VEVENT
END:VCALENDAR
`.trim();
}

function formatICS(date) {
  return new Date(date)
    .toISOString()
    .replace(/[-:]/g, "")
    .split(".")[0] + "Z";
}
