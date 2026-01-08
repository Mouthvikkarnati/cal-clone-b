import express from "express";
import { prisma } from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  await prisma.availability.createMany({ data: req.body });
  res.json({ message: "Availability saved" });
});

router.get("/", async (_, res) => {
  res.json(await prisma.availability.findMany());
});

router.post("/override", async (req, res) => {
  const { date, startTime, endTime, isBlocked } = req.body;
  await prisma.dateOverride.create({
    data: { date: new Date(date), startTime, endTime, isBlocked }
  });
  res.json({ message: "Override saved" });
});

export default router;
