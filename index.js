import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const PORT = 5000;
const article = [];

const scraper = async (country, language) => {
  if (article.length > 0) article.splice(0, article.length);
  const res = await axios(
    `https://news.google.com/topstories?hl=${language}&gl=${country}&ceid=${country}:${language}`
  );
  const html = res.data;
  const $ = cheerio.load(html);
  $("h3", html).each((item, el) => {
    article.push({
      title: $(el).text(),
      href: `https:news.google.com${$(el).find("a").attr("href").substring(1)}`,
    });
  });
  $("h4", html).each((item, el) => {
    article.push({
      title: $(el).text(),
      href: `https:news.google.com${$(el).find("a").attr("href").substring(1)}`,
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

app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}`)
);
