import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const PORT = 5000;
const article = [];

const scraper = async (country, language, title) => {
  if (article.length > 0) article.splice(0, article.length);
  const res = await axios(
    `https://news.google.com/${
      title ? `search?q=${title}&` : "topstories?"
    }hl=${language}&gl=${country}&ceid=${country}:${language}`
  );
  const html = res.data;
  const $ = cheerio.load(html);
  $("article", html).each((item, el) => {
    $(el).find("h3").text() &&
      article.push({
        title: $(el).find("h3").text(),
        href: `https:news.google.com${$(el)
          .find("a")
          .attr("href")
          .substring(1)}`,
        publish_date: $(el).find("time").attr("datetime"),
      });
  });
  $("article", html).each((item, el) => {
    $(el).find("h4").text() &&
      article.push({
        title: $(el).find("h4").text(),
        href: `https:news.google.com${$(el)
          .find("a")
          .attr("href")
          .substring(1)}`,
        publish_date: $(el).find("time").attr("datetime"),
      });
  });
};
app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.get("/news", async (req, res) => {
  const { country, lang } = req.query;
  await scraper(country, lang);
  res.send(article);
});

app.get("/news/:title", async (req, res) => {
  const { title } = req.params;
  const { country, lang } = req.query;
  await scraper(country, lang, title);
  res.send(article);
});

app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}`)
);
