import express from "express";
import cors from "cors";

import eventRoutes from "./routes/events.js";
import bookingRoutes from "./routes/bookings.js";
import publicRoutes from "./routes/public.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/public", publicRoutes);

export default app;
 