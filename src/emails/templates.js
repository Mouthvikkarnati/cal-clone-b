export function bookingHtml({ name, start, end }) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:600px">
    <h2>Booking Confirmed</h2>
    <p>Hi ${name},</p>
    <p>Your meeting has been confirmed.</p>
    <p><strong>When:</strong></p>
    <p>${start} – ${end}</p>
    <p>This event has been added to your calendar.</p>
    <hr />
    <p style="color:#666;font-size:12px">
      Powered by Cal Scheduler
    </p>
  </div>
  `;
}

export function rescheduleHtml({ name, start, end }) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:600px">
    <h2>Meeting Rescheduled</h2>
    <p>Hi ${name},</p>
    <p>Your meeting has been rescheduled.</p>
    <p><strong>New Time:</strong></p>
    <p>${start} – ${end}</p>
    <p>Your calendar has been updated.</p>
    <hr />
    <p style="color:#666;font-size:12px">
      Powered by Cal Scheduler
    </p>
  </div>
  `;
}

export function cancelHtml({ name, start, end }) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:600px">
    <h2>Meeting Cancelled</h2>
    <p>Hi ${name},</p>
    <p>Your meeting scheduled for:</p>
    <p>${start} – ${end}</p>
    <p>has been cancelled.</p>
    <hr />
    <p style="color:#666;font-size:12px">
      Powered by Cal Scheduler
    </p>
  </div>
  `;
}
