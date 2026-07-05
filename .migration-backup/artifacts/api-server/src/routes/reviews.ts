import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { reviewsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/reviews", async (req, res) => {
  try {
    const reviews = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.approved, true))
      .orderBy(reviewsTable.createdAt);
    res.json(reviews);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch reviews");
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

router.post("/reviews", async (req, res) => {
  const { name, role, school, content, rating } = req.body as {
    name?: string;
    role?: string;
    school?: string;
    content?: string;
    rating?: number;
  };

  if (!name || !role || !school || !content || typeof rating !== "number") {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  if (rating < 1 || rating > 5) {
    res.status(400).json({ error: "Rating must be between 1 and 5" });
    return;
  }

  try {
    const [review] = await db
      .insert(reviewsTable)
      .values({ name, role, school, content, rating, approved: true })
      .returning();
    res.status(201).json(review);
  } catch (err) {
    req.log.error({ err }, "Failed to submit review");
    res.status(500).json({ error: "Failed to submit review" });
  }
});

export default router;
