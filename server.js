require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
// const screenshotService = require('./screenshot-service'); // Отключен - используем frontend сервис

const app = express();
const PORT = 3001;

// Middleware для обработки JSON
app.use(express.json());

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

// API для управления скриншотами - ОТКЛЮЧЕНО (используется Next.js API)
/*
app.post('/api/screenshot/configure', (req, res) => {
	try {
		const { enabled, interval, startTime, endTime } = req.body;

		screenshotService.configure({
			enabled,
			interval,
			startTime,
			endTime
		});

		res.json({ success: true, message: 'Screenshot settings updated' });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// API для ручного создания скриншота
app.post('/api/screenshot/take', async (req, res) => {
	try {
		const result = await screenshotService.takeManualScreenshot();
		res.json(result);
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// API для получения списка скриншотов
app.get('/api/screenshot/list', (req, res) => {
	try {
		const screenshots = screenshotService.getScreenshots();
		res.json({ success: true, screenshots });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});
*/

// Статические файлы для скриншотов
app.use('/screenshots', express.static(path.join(__dirname, 'frontend', 'public', 'screenshots')));