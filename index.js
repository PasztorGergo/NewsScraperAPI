import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const PORT = process.env.PORT || 5000;
const article = [];

app.use(express.json());

const scraper = async (country, language, title) => {
  if (article.length > 0) article.splice(0, article.length);
  const res = await axios(
    `https://news.google.com/${
      title ? `search?q=${title}&` : "topstories?"
    }gl=${country}&ceid=${country}`
  );
  const html = res.data;
  const $ = cheerio.load(html);
  $("article", html).each((item, el) => {
    $(el).find("h3").text() &&
      article.push({
        title: $(el).find("h3").text(),
        url: `https:news.google.com${$(el)
          .find("a")
          .attr("href")
          .substring(1)}`,
        publish_date: $(el).find("time").attr("datetime"),
        provider: $(el).find("a.wEwyrc").text(),
      });
  });
  $("article", html).each((item, el) => {
    $(el).find("h4").text() &&
      article.push({
        title: $(el).find("h4").text(),
        url: `https:news.google.com${$(el)
          .find("a")
          .attr("href")
          .substring(1)}`,
        publish_date: $(el).find("time").attr("datetime"),
        provider: $(el).find("a.wEwyrc").text(),
      });
  });
};

app.get("/", async (req, res) => {
  const { country, lang } = req.query;
  await scraper(country, lang);
  res.json(article);
});

app.get("/:title", async (req, res) => {
  const { title } = req.params;
  const { country, lang } = req.query;
  await scraper(country, lang, title);
  res.json(article);
});

app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}`)
);
