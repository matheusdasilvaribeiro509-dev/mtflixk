import { Router } from "express";
import { requireAuth, AuthedRequest } from "../auth";
import { db } from "../db";

export const historyRouter = Router();

// Lista o histórico, mais recente primeiro, já com os dados do título (para "Continuar assistindo").
historyRouter.get("/", requireAuth, (req: AuthedRequest, res) => {
  const entries = db
    .get("history")
    .filter({ userId: req.user!.id })
    .sortBy("updatedAt")
    .reverse()
    .value();

  const withTitles = entries
    .map((e) => {
      const title = db.get("titles").find({ id: e.titleId }).value();
      return title ? { ...e, title } : null;
    })
    .filter(Boolean);

  res.json(withTitles);
});

// Salva o progresso de reprodução (o player chama isso periodicamente).
historyRouter.post("/:titleId", requireAuth, (req: AuthedRequest, res) => {
  const { titleId } = req.params;
  const { progressSeconds, durationSeconds } = req.body || {};
  if (typeof progressSeconds !== "number" || typeof durationSeconds !== "number") {
    return res.status(400).json({ error: "progressSeconds e durationSeconds são obrigatórios." });
  }

  const existing = db.get("history").find({ userId: req.user!.id, titleId }).value();
  if (existing) {
    db.get("history")
      .find({ userId: req.user!.id, titleId })
      .assign({ progressSeconds, durationSeconds, updatedAt: new Date().toISOString() })
      .write();
  } else {
    db.get("history")
      .push({ userId: req.user!.id, titleId, progressSeconds, durationSeconds, updatedAt: new Date().toISOString() })
      .write();
  }
  res.json({ ok: true });
});
