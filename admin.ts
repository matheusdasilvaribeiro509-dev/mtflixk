import { Router } from "express";
import { v4 as uuid } from "uuid";
import { requireAuth, requireAdmin } from "../auth";
import { db } from "../db";
import { Title } from "../types";

export const adminRouter = Router();
adminRouter.use(requireAuth, requireAdmin);

adminRouter.get("/titles", (_req, res) => {
  res.json(db.get("titles").value());
});

adminRouter.post("/titles", (req, res) => {
  const body = req.body || {};
  const required = ["title", "synopsis", "year", "category", "posterUrl", "bannerUrl", "videoUrl"];
  for (const field of required) {
    if (!body[field]) return res.status(400).json({ error: `Campo obrigatório: ${field}` });
  }
  const title: Title = {
    id: uuid(),
    title: body.title,
    synopsis: body.synopsis,
    year: Number(body.year),
    category: body.category,
    posterUrl: body.posterUrl,
    bannerUrl: body.bannerUrl,
    videoUrl: body.videoUrl,
    durationMinutes: Number(body.durationMinutes) || 0,
    rating: Number(body.rating) || 0,
    featured: Boolean(body.featured),
    source: body.source || "Verifique a licença antes de publicar.",
  };
  db.get("titles").push(title).write();
  res.status(201).json(title);
});

adminRouter.put("/titles/:id", (req, res) => {
  const title = db.get("titles").find({ id: req.params.id }).value();
  if (!title) return res.status(404).json({ error: "Título não encontrado." });
  db.get("titles").find({ id: req.params.id }).assign(req.body || {}).write();
  res.json(db.get("titles").find({ id: req.params.id }).value());
});

adminRouter.delete("/titles/:id", (req, res) => {
  db.get("titles").remove({ id: req.params.id }).write();
  res.json({ ok: true });
});

adminRouter.get("/users", (_req, res) => {
  const users = db.get("users").value().map((u) => ({ id: u.id, name: u.name, email: u.email, isAdmin: u.isAdmin, createdAt: u.createdAt }));
  res.json(users);
});
