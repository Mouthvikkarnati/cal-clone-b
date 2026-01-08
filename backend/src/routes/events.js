import express from "express";
import { prisma } from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { title, slug, unavailable } = req.body;

  const event = await prisma.eventType.create({
    data: {
      title,
      slug,
      unavailable
    }
  });

  res.json(event);
});

router.get("/", async (_, res) => {
  const events = await prisma.eventType.findMany();
  res.json(events);
});

export default router;
