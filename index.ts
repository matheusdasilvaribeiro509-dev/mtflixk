import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { titlesRouter } from "./routes/titles";
import { favoritesRouter } from "./routes/favorites";
import { historyRouter } from "./routes/history";
import { adminRouter } from "./routes/admin";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true, name: "MT FLIX API" }));
app.use("/api/auth", authRouter);
app.use("/api/titles", titlesRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/history", historyRouter);
app.use("/api/admin", adminRouter);

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`MT FLIX API rodando em http://localhost:${PORT}`));
