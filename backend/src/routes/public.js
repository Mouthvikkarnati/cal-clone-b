import express from "express";
import dayjs from "dayjs";
import { prisma } from "../db.js";

const router = express.Router();

/* --------------------------------------------------
   GET PUBLIC EVENT DETAILS
-------------------------------------------------- */
router.get("/:slug", async (req, res) => {
  const event = await prisma.eventType.findUnique({
    where: { slug: req.params.slug }
  });

  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  res.json({
    id: event.id,
    title: event.title,
    slug: event.slug
  });
});


/* --------------------------------------------------
   GET AVAILABLE SLOTS FOR A DATE
   Slots: 1 hour, 9 AM – 5 PM
-------------------------------------------------- */
router.get("/:slug/slots", async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }

  const event = await prisma.eventType.findUnique({
    where: { slug: req.params.slug }
  });

  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  // All possible 1-hour slots from 9 to 5
  const baseSlots = [
    "09:00","10:00","11:00","12:00",
    "13:00","14:00","15:00","16:00"
  ];

  // Fetch bookings for the selected date
  const bookings = await prisma.booking.findMany({
    where: {
      eventId: event.id,
      date: new Date(date)
    }
  });

  const bookedTimes = bookings.map(b => b.time);

  // 🔍 REQUIRED LOG
  console.log("Booked slots for", date, ":", bookedTimes);

  // Build slot availability response
  const slots = baseSlots.map(time => ({
    time,
    available:
      !bookedTimes.includes(time) &&
      !event.unavailable?.includes(time)
  }));

  res.json(slots);
});

export default router;
