const movies = require("../data/movies.json");

module.exports = (req, res) => {
  const q = (req.query.q || "").toString().toLowerCase().trim();
  const list = q
    ? movies.filter((m) =>
        [m.title, m.genre, m.description].join(" ").toLowerCase().includes(q)
      )
    : movies;

  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
  res.status(200).json(list);
};
