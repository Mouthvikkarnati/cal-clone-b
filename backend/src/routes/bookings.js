import express from "express";
import { prisma } from "../db.js";
import { sendMail } from "../mailer.js";
import {
  bookingHtml,
  cancelHtml,
  rescheduleHtml
} from "../emails/templates.js";
import { generateICS } from "../emails/ics.js";

const router = express.Router();

/* =====================================================
   CREATE BOOKING
   Ensures ONLY available slots are booked
===================================================== */
router.post("/", async (req, res) => {
  const { eventId, name, email, date, time } = req.body;

  if (!eventId || !name || !email || !date || !time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  try {
    const booking = await prisma.$transaction(async tx => {
      const conflict = await tx.booking.findFirst({
        where: {
          eventId,
          date: new Date(date),
          time
        }
      });

      if (conflict) {
        throw new Error("Slot already booked");
      }

      return await tx.booking.create({
        data: {
          eventId,
          name,
          email,
          date: new Date(date),
          time
        }
      });
    });

    const start = `${date} ${time}`;
    const endHour = String(parseInt(time.split(":")[0]) + 1).padStart(2, "0");
    const end = `${date} ${endHour}:00`;

    await sendMail({
      to: booking.email,
      subject: "Booking Confirmed",
      text: `Your meeting is booked on ${date} at ${time}`,
      html: bookingHtml({
        name: booking.name,
        start,
        end
      }),
      ics: generateICS({
        uid: booking.id,
        start: new Date(start),
        end: new Date(end),
        summary: "Scheduled Meeting"
      })
    });

    res.json(booking);
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/* =====================================================
   CANCEL BOOKING
===================================================== */
router.delete("/:id", async (req, res) => {
  const booking = await prisma.booking.delete({
    where: { id: req.params.id }
  });

  const start = `${booking.date.toISOString().split("T")[0]} ${booking.time}`;
  const endHour = String(parseInt(booking.time.split(":")[0]) + 1).padStart(2, "0");
  const end = `${booking.date.toISOString().split("T")[0]} ${endHour}:00`;

  await sendMail({
    to: booking.email,
    subject: "Your meeting has been cancelled",
    text: "Your meeting has been cancelled.",
    html: cancelHtml({
      name: booking.name,
      start,
      end
    })
  });

  res.json({ message: "Booking cancelled" });
});

/* =====================================================
   RESCHEDULE BOOKING
===================================================== */
router.put("/:id/reschedule", async (req, res) => {
  const { date, time } = req.body;

  if (!date || !time) {
    return res.status(400).json({ error: "Date and time required" });
  }

  try {
    const updated = await prisma.$transaction(async tx => {
      const booking = await tx.booking.findUnique({
        where: { id: req.params.id }
      });

      if (!booking) throw new Error("Booking not found");

      const conflict = await tx.booking.findFirst({
        where: {
          eventId: booking.eventId,
          date: new Date(date),
          time
        }
      });

      if (conflict) throw new Error("Slot unavailable");

      return await tx.booking.update({
        where: { id: booking.id },
        data: {
          date: new Date(date),
          time
        }
      });
    });

    const start = `${date} ${time}`;
    const endHour = String(parseInt(time.split(":")[0]) + 1).padStart(2, "0");
    const end = `${date} ${endHour}:00`;

    await sendMail({
      to: updated.email,
      subject: "Your meeting has been rescheduled",
      text: "Your meeting has been rescheduled.",
      html: rescheduleHtml({
        name: updated.name,
        start,
        end
      }),
      ics: generateICS({
        uid: updated.id,
        start: new Date(start),
        end: new Date(end),
        summary: "Rescheduled Meeting"
      })
    });

    res.json(updated);
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/* =====================================================
   GET DASHBOARD BOOKINGS (UPCOMING + PAST)
===================================================== */
router.get("/", async (req, res) => {
  const now = new Date();

  const bookings = await prisma.booking.findMany({
    include: {
      event: true
    },
    orderBy: {
      date: "asc"
    }
  });

  const upcoming = bookings.filter(b => {
    const bookingDateTime = new Date(
      `${b.date.toISOString().split("T")[0]}T${b.time}:00`
    );
    return bookingDateTime >= now;
  });

  const past = bookings.filter(b => {
    const bookingDateTime = new Date(
      `${b.date.toISOString().split("T")[0]}T${b.time}:00`
    );
    return bookingDateTime < now;
  });

  res.json({ upcoming, past });
});


export default router;
