import { Router } from "express";
import { requireAuth, AuthedRequest } from "../auth";
import { db } from "../db";

export const favoritesRouter = Router();

favoritesRouter.get("/", requireAuth, (req: AuthedRequest, res) => {
  const favs = db.get("favorites").filter({ userId: req.user!.id }).value();
  const titles = favs
    .map((f) => db.get("titles").find({ id: f.titleId }).value())
    .filter(Boolean);
  res.json(titles);
});

favoritesRouter.post("/:titleId", requireAuth, (req: AuthedRequest, res) => {
  const { titleId } = req.params;
  const title = db.get("titles").find({ id: titleId }).value();
  if (!title) return res.status(404).json({ error: "Título não encontrado." });

  const exists = db.get("favorites").find({ userId: req.user!.id, titleId }).value();
  if (!exists) {
    db.get("favorites").push({ userId: req.user!.id, titleId, addedAt: new Date().toISOString() }).write();
  }
  res.status(201).json({ ok: true });
});

favoritesRouter.delete("/:titleId", requireAuth, (req: AuthedRequest, res) => {
  db.get("favorites").remove({ userId: req.user!.id, titleId: req.params.titleId }).write();
  res.json({ ok: true });
});
