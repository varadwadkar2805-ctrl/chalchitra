const { put, list, del } = require("@vercel/blob");

// Yahan apna password likho (ya Vercel mein ADMIN_PASSWORD set karo)
const PASSWORD = process.env.ADMIN_PASSWORD || "180509";

const FILE = "movies-data.json";

async function readAll() {
  const { blobs } = await list({ prefix: FILE });
  const b = blobs.find((x) => x.pathname === FILE);
  if (!b) return [];
  const r = await fetch(b.url + "?t=" + Date.now());
  return r.ok ? await r.json() : [];
}

async function writeAll(arr) {
  await put(FILE, JSON.stringify(arr), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}

module.exports = async (req, res) => {
  try {
    if (req.method === "GET") {
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json(await readAll());
    }

    if (req.method === "POST") {
      const { password, action, movie, id } = req.body || {};
      if (password !== PASSWORD) {
        return res.status(401).json({ error: "Galat password" });
      }

      if (action === "check") return res.status(200).json({ ok: true });

      const all = await readAll();

      if (action === "delete") {
        const gone = all.find((m) => m.id === id);
        const next = all.filter((m) => m.id !== id);
        await writeAll(next);
        if (gone) {
          const urls = [gone.video_url, gone.poster].filter(
            (u) => u && u.includes(".blob.vercel-storage.com")
          );
          if (urls.length) await del(urls).catch(() => {});
        }
        return res.status(200).json(next);
      }

      if (action === "add") {
        if (!movie || !movie.title || !movie.video_url) {
          return res.status(400).json({ error: "Naam aur video zaroori hai" });
        }
        const item = {
          id: Date.now(),
          title: String(movie.title).slice(0, 150),
          year: movie.year ? Number(movie.year) : undefined,
          genre: String(movie.genre || "").slice(0, 80),
          description: String(movie.description || "").slice(0, 600),
          poster: movie.poster || "",
          video_url: movie.video_url,
        };
        all.unshift(item);
        await writeAll(all);
        return res.status(200).json(all);
      }

      return res.status(400).json({ error: "Galat action" });
    }

    res.status(405).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
