import { Router } from "express";
import { db } from "../db";

export const titlesRouter = Router();

titlesRouter.get("/", (req, res) => {
  const { category, q } = req.query as { category?: string; q?: string };
  let titles = db.get("titles").value();

  if (category) titles = titles.filter((t) => t.category === category);
  if (q) {
    const needle = q.trim().toLowerCase();
    titles = titles.filter(
      (t) => t.title.toLowerCase().includes(needle) || t.synopsis.toLowerCase().includes(needle)
    );
  }
  res.json(titles);
});

titlesRouter.get("/featured", (_req, res) => {
  res.json(db.get("titles").filter({ featured: true }).value());
});

titlesRouter.get("/:id", (req, res) => {
  const title = db.get("titles").find({ id: req.params.id }).value();
  if (!title) return res.status(404).json({ error: "Título não encontrado." });
  res.json(title);
});
