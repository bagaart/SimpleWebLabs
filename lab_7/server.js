const express = require('express');
const app = express();
const port = 3000;

let ads = [
    {
        дата: "2023-10-10",
        автор: "Иван Иванов",
        цена: 15000,
        текст: "Продам ноутбук #техника, #б/у"
      },
      {
        дата: "2023-10-11",
        автор: "Мария Петрова",
        цена: 500,
        текст: "Продам книги #литература"
      }
];

app.use(express.static(__dirname + "/client"));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get("/ads", (req, res) => {
    res.json(ads);
});

app.post("/ads", (req, res) => {
    const newAd = req.body;
  if (newAd.дата && newAd.автор && newAd.цена && newAd.текст) {
    ads.push(newAd);
    res.json({ message: "Объявление добавлено" });
  } else {
    res.status(400).json({ error: "Не все поля заполнены" });
  }
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
  });