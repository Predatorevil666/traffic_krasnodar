require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Обработчик для index.html с подстановкой API ключа
app.get('/', (req, res) => {
  let html = fs.readFileSync(path.join(__dirname, 'backend/index.html'), 'utf8');
  // Заменяем placeholder на реальный ключ (или используем дефолтный)
  const apiKey = process.env.YANDEX_MAPS_API_KEY || '7c99fc7b-a6c3-49ec-9fa2-58cd9ead04eb';
  html = html.replace('__YANDEX_MAPS_API_KEY__', apiKey);
  res.send(html);
});

// Статические файлы
app.use(express.static('backend'));

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

app.get('/2gis', (req, res) => {
  let html = fs.readFileSync(path.join(__dirname, 'backend/index_2gis.html'), 'utf8');
  // Заменяем placeholder на реальный ключ 2GIS
  const apiKey = process.env.DGIS_API_KEY || 'руфьуз2с3в';
  html = html.replace('__2GIS_API_KEY__', apiKey);
  res.send(html);
});