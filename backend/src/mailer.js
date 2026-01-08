import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendMail({
  to,
  subject,
  text,
  html,
  ics
}) {
  await transporter.sendMail({
    from: `"Cal Scheduler" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
    attachments: ics
      ? [
          {
            filename: "event.ics",
            content: ics,
            contentType: "text/calendar"
          }
        ]
      : []
  });
}
