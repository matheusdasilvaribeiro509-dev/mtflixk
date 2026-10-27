import "dotenv/config";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { db } from "./db";
import { Title, User } from "./types";

// Catálogo inicial com obras de domínio público (EUA). CONFIRA A LICENÇA e o link de cada
// item no Archive.org antes de publicar — nomes de arquivo mudam com o tempo, e o status de
// domínio público varia por país. Troque qualquer item pelo painel /admin.
const titles: Omit<Title, "id">[] = [
  {
    title: "A Noite dos Mortos-Vivos",
    synopsis:
      "Um grupo de desconhecidos se tranca numa fazenda isolada da Pensilvânia para escapar de uma onda de mortos que voltaram à vida. O filme que criou o zumbi moderno.",
    year: 1968,
    category: "terror",
    posterUrl: "https://archive.org/services/img/night_of_the_living_dead",
    bannerUrl: "https://archive.org/services/img/night_of_the_living_dead",
    videoUrl: "https://archive.org/download/night_of_the_living_dead/night_of_the_living_dead_512kb.mp4",
    durationMinutes: 96,
    rating: 7.9,
    featured: true,
    source: "Domínio público (EUA) — Archive.org, identifier night_of_the_living_dead",
  },
  {
    title: "Nosferatu",
    synopsis:
      "Adaptação não autorizada de Drácula: o agente imobiliário Hutter viaja até o castelo do Conde Orlok e desperta um mal antigo que segue seus passos até a cidade.",
    year: 1922,
    category: "terror",
    posterUrl: "https://archive.org/services/img/Nosferatu1922",
    bannerUrl: "https://archive.org/services/img/Nosferatu1922",
    videoUrl: "https://archive.org/download/Nosferatu1922/Nosferatu1922_512kb.mp4",
    durationMinutes: 94,
    rating: 7.8,
    featured: true,
    source: "Domínio público — Archive.org, identifier Nosferatu1922",
  },
  {
    title: "O Gabinete do Dr. Caligari",
    synopsis:
      "Um hipnotizador de feira e seu sonâmbulo são suspeitos de uma série de assassinatos numa pequena cidade alemã, em um dos marcos do expressionismo no cinema.",
    year: 1920,
    category: "ficcao-cientifica",
    posterUrl: "https://archive.org/services/img/TheCabinetOfDrCaligari",
    bannerUrl: "https://archive.org/services/img/TheCabinetOfDrCaligari",
    videoUrl: "https://archive.org/download/TheCabinetOfDrCaligari/TheCabinetOfDrCaligari_512kb.mp4",
    durationMinutes: 76,
    rating: 8.0,
    featured: false,
    source: "Domínio público — Archive.org, identifier TheCabinetOfDrCaligari",
  },
  {
    title: "Plano 9 do Espaço Sideral",
    synopsis:
      "Alienígenas reanimam cadáveres na Terra para impedir a humanidade de criar uma arma apocalíptica. Um clássico cult da ficção científica B.",
    year: 1959,
    category: "ficcao-cientifica",
    posterUrl: "https://archive.org/services/img/Plan9FromOuterSpace1959_201612",
    bannerUrl: "https://archive.org/services/img/Plan9FromOuterSpace1959_201612",
    videoUrl: "https://archive.org/download/Plan9FromOuterSpace1959_201612/Plan9FromOuterSpace1959_512kb.mp4",
    durationMinutes: 79,
    rating: 5.1,
    featured: false,
    source: "Domínio público — Archive.org, identifier Plan9FromOuterSpace1959_201612",
  },
  {
    title: "Uma Viagem à Lua",
    synopsis:
      "Um grupo de astrônomos viaja até a Lua em um projétil disparado por canhão e enfrenta seus estranhos habitantes. O curta mais famoso dos primórdios do cinema.",
    year: 1902,
    category: "aventura",
    posterUrl: "https://archive.org/services/img/TripToTheMoon",
    bannerUrl: "https://archive.org/services/img/TripToTheMoon",
    videoUrl: "https://archive.org/download/TripToTheMoon/TripToTheMoon_512kb.mp4",
    durationMinutes: 13,
    rating: 8.2,
    featured: true,
    source: "Domínio público — Archive.org, identifier TripToTheMoon",
  },
  {
    title: "Sua Majestade, o Repórter",
    synopsis:
      "Um editor de jornal faz de tudo para impedir que sua ex-mulher e melhor repórter se case de novo e abandone a profissão, no meio de um furo de reportagem.",
    year: 1940,
    category: "comedia",
    posterUrl: "https://archive.org/services/img/his_girl_friday",
    bannerUrl: "https://archive.org/services/img/his_girl_friday",
    videoUrl: "https://archive.org/download/his_girl_friday/his_girl_friday_512kb.mp4",
    durationMinutes: 92,
    rating: 7.8,
    featured: false,
    source: "Domínio público — Archive.org, identifier his_girl_friday",
  },
  {
    title: "Betty Boop: Clássicos Animados",
    synopsis:
      "Seleção de curtas animados da Betty Boop dos anos 1930, com a animação borrachuda e o humor musical que marcaram os primeiros desenhos sonoros.",
    year: 1933,
    category: "desenhos",
    posterUrl: "https://archive.org/services/img/Betty_Boop_classics",
    bannerUrl: "https://archive.org/services/img/Betty_Boop_classics",
    videoUrl: "https://archive.org/download/Betty_Boop_classics/Betty_Boop_classics_512kb.mp4",
    durationMinutes: 45,
    rating: 7.2,
    featured: false,
    source: "Domínio público — confirme o item exato no Archive.org antes de publicar",
  },
  {
    title: "Felix the Cat: Curtas Mudos",
    synopsis:
      "Compilação dos primeiros curtas mudos do gato Felix, um dos personagens de desenho animado mais populares da década de 1920.",
    year: 1925,
    category: "desenhos",
    posterUrl: "https://archive.org/services/img/Felix_the_Cat_classics",
    bannerUrl: "https://archive.org/services/img/Felix_the_Cat_classics",
    videoUrl: "https://archive.org/download/Felix_the_Cat_classics/Felix_the_Cat_classics_512kb.mp4",
    durationMinutes: 40,
    rating: 7.0,
    featured: false,
    source: "Domínio público — confirme o item exato no Archive.org antes de publicar",
  },
];

// Observação sobre a categoria "animes": obras de anime em domínio público verdadeiro são raras
// (a maioria do catálogo japonês ainda está protegida). Deixe a categoria pronta no sistema, mas
// só publique títulos com licença Creative Commons clara ou autorização por escrito do detentor.

function run() {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@mtflix.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (!db.get("users").find({ email: adminEmail }).value()) {
    const admin: User = {
      id: uuid(),
      name: "Administrador MT FLIX",
      email: adminEmail,
      passwordHash: bcrypt.hashSync(adminPassword, 10),
      isAdmin: true,
      createdAt: new Date().toISOString(),
    };
    db.get("users").push(admin).write();
    console.log(`Admin criado: ${adminEmail} / senha: ${adminPassword}`);
  }

  if (db.get("titles").value().length === 0) {
    titles.forEach((t) => db.get("titles").push({ ...t, id: uuid() }).write());
    console.log(`${titles.length} títulos adicionados ao catálogo.`);
  } else {
    console.log("Catálogo já tem títulos, seed de filmes ignorado.");
  }
}

run();
