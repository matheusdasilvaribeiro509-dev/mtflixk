export type Category =
  | "acao"
  | "aventura"
  | "comedia"
  | "terror"
  | "romance"
  | "ficcao-cientifica"
  | "animes"
  | "desenhos";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Title {
  id: string;
  title: string;
  synopsis: string;
  year: number;
  category: Category;
  posterUrl: string;
  bannerUrl: string;
  videoUrl: string;
  durationMinutes: number;
  rating: number; // 0-10
  featured: boolean;
  source: string; // de onde veio / licença, para controle do admin
}

export interface FavoriteEntry {
  userId: string;
  titleId: string;
  addedAt: string;
}

export interface HistoryEntry {
  userId: string;
  titleId: string;
  progressSeconds: number;
  durationSeconds: number;
  updatedAt: string;
}

export interface DbSchema {
  users: User[];
  titles: Title[];
  favorites: FavoriteEntry[];
  history: HistoryEntry[];
}
