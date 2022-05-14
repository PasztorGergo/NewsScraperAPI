import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const PORT = 5000;
const url = "https://www.cnbc.com/business";

axios(url).then((res) => {
  const html = res.data;
  console.log(html);
  cheerio.load(html);
});
app.get("/", (req, res) => {
  res.send("Welcome to my webscraper!");
});

app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}`)
);
