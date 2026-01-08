import express from "express";
import { prisma } from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const event = await prisma.eventType.create({ data: req.body });
  res.json(event);
});

router.get("/", async (_, res) => {
  res.json(await prisma.eventType.findMany());
});

export default router;
