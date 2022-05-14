import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const PORT = 5000;
const article = [];

const scraper = async (title) => {
  if (article.length > 0) article.splice(0, article.length);
  const res = await axios("https://www.cnbc.com/business");
  const html = res.data;
  const $ = cheerio.load(html);
  $(".Card-titleContainer", html).each((item, el) => {
    article.push({
      title: $(el).text(),
      href: $(el).find("a").attr("href"),
    });
  });
};
app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.get("/news", async (req, res) => {
  await scraper();
  res.send(article);
});

app.get("/news/:title", async (req, res) => {
  const { title } = req.params;
  await scraper();
  res.send(article.filter((item) => item.title.includes(title)));
});

app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}`)
);
