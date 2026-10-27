export interface Title {
  id: string;
  title: string;
  synopsis: string;
  year: number;
  category: string;
  posterUrl: string;
  bannerUrl: string;
  videoUrl: string;
  durationMinutes: number;
  rating: number;
  featured: boolean;
  source: string;
}

export interface HistoryItem {
  userId: string;
  titleId: string;
  progressSeconds: number;
  durationSeconds: number;
  updatedAt: string;
  title: Title;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

const BASE = "/api";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("mtflix_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Algo deu errado. Tente novamente.");
  return data as T;
}

export const api = {
  register: (name: string, email: string, password: string) =>
    request<{ token: string; user: AuthUser }>("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  login: (email: string, password: string) =>
    request<{ token: string; user: AuthUser }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  me: () => request<AuthUser>("/auth/me"),

  titles: (params?: { category?: string; q?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<Title[]>(`/titles${qs ? `?${qs}` : ""}`);
  },
  featured: () => request<Title[]>("/titles/featured"),
  title: (id: string) => request<Title>(`/titles/${id}`),

  favorites: () => request<Title[]>("/favorites"),
  addFavorite: (titleId: string) => request(`/favorites/${titleId}`, { method: "POST" }),
  removeFavorite: (titleId: string) => request(`/favorites/${titleId}`, { method: "DELETE" }),

  history: () => request<HistoryItem[]>("/history"),
  saveProgress: (titleId: string, progressSeconds: number, durationSeconds: number) =>
    request(`/history/${titleId}`, { method: "POST", body: JSON.stringify({ progressSeconds, durationSeconds }) }),

  adminTitles: () => request<Title[]>("/admin/titles"),
  adminCreateTitle: (body: Partial<Title>) => request<Title>("/admin/titles", { method: "POST", body: JSON.stringify(body) }),
  adminUpdateTitle: (id: string, body: Partial<Title>) => request<Title>(`/admin/titles/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  adminDeleteTitle: (id: string) => request(`/admin/titles/${id}`, { method: "DELETE" }),
};

export const CATEGORIES: { value: string; label: string }[] = [
  { value: "acao", label: "Ação" },
  { value: "aventura", label: "Aventura" },
  { value: "comedia", label: "Comédia" },
  { value: "terror", label: "Terror" },
  { value: "romance", label: "Romance" },
  { value: "ficcao-cientifica", label: "Ficção científica" },
  { value: "animes", label: "Animes" },
  { value: "desenhos", label: "Desenhos" },
];
