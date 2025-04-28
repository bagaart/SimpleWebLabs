const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const app = express();
const port = 3000;

// Настройка соединения с базой данных MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'ads_db',
    waitForConnections: true,

});

app.use(express.static(__dirname + "/client"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'client'));

app.get("/", (req, res) => {
    res.render('index'); 
});


// Получение всех объявлений
app.get("/ads", async (req, res) => {
    const [ads] = await pool.query('SELECT * FROM ads');
    res.json(ads);
});

// Добавление нового объявления
app.post("/ads", async (req, res) => {
    const { дата, автор, цена, текст } = req.body;
    if (дата && автор && цена && текст) {
        await pool.query('INSERT INTO ads (дата, автор, цена, текст) VALUES (?, ?, ?, ?)', [дата, автор, цена, текст]);
        res.json({ message: "Объявление добавлено" });
    } else {
        res.status(400).json({ error: "Не все поля заполнены" });
    }
});

// Удаление объявления
app.delete("/ads/:id", async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM ads WHERE id = ?', [id]);
    res.json({ message: "Объявление удалено" });
});

// Обновление объявления
app.put("/ads/:id", async (req, res) => {
    const { id } = req.params;
    const { дата, автор, цена, текст } = req.body;
    await pool.query('UPDATE ads SET дата = ?, автор = ?, цена = ?, текст = ? WHERE id = ?', [дата, автор, цена, текст, id]);
    res.json({ message: "Объявление обновлено" });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});