const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware для обработки JSON
app.use(express.json());

// Обработчик для index.html с подстановкой API ключа
app.get('/', (req, res) => {
  try {
    let html = fs.readFileSync(path.join(__dirname, 'backend/index.html'), 'utf8');
    // Заменяем placeholder на реальный ключ (или используем дефолтный)
    const apiKey = process.env.YANDEX_MAPS_API_KEY || '7c99fc7b-a6c3-49ec-9fa2-58cd9ead04eb';
    html = html.replace('__YANDEX_MAPS_API_KEY__', apiKey);
    res.send(html);
  } catch (error) {
    res.status(500).send('Error loading page: ' + error.message);
  }
});

// Статические файлы
app.use(express.static('backend'));

app.get('/2gis', (req, res) => {
  try {
    let html = fs.readFileSync(path.join(__dirname, 'backend/index_2gis.html'), 'utf8');
    // Заменяем placeholder на реальный ключ 2GIS
    const apiKey = process.env.DGIS_API_KEY || 'руфьуз2с3в';
    html = html.replace('__2GIS_API_KEY__', apiKey);
    res.send(html);
  } catch (error) {
    res.status(500).send('Error loading 2GIS page: ' + error.message);
  }
});

// Простой API для тестирования скриншотов (без Puppeteer)
app.post('/api/screenshot/configure', (req, res) => {
  try {
    const { enabled, interval, startTime, endTime } = req.body;
    
    console.log('Screenshot settings received:', {
      enabled,
      interval,
      startTime,
      endTime
    });
    
    res.json({ success: true, message: 'Screenshot settings updated (demo mode)' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API для ручного создания скриншота (демо режим)
app.post('/api/screenshot/take', async (req, res) => {
  try {
    console.log('Screenshot request received (demo mode)');
    
    // Создаем демо-файл
    const now = new Date();
    const timestamp = now.getFullYear() + '-' + 
                     (now.getMonth() + 1).toString().padStart(2, '0') + '-' + 
                     now.getDate().toString().padStart(2, '0') + '_' + 
                     now.getHours().toString().padStart(2, '0') + '-' + 
                     now.getMinutes().toString().padStart(2, '0');
    
    const filename = `demo_screenshot_${timestamp}.txt`;
    const filepath = path.join(__dirname, 'frontend', 'public', 'screenshots', filename);

    // Убеждаемся что папка существует
    const screenshotDir = path.dirname(filepath);
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    // Создаем демо-файл
    fs.writeFileSync(filepath, `Demo screenshot created at ${now.toISOString()}\nThis is a placeholder for the actual screenshot functionality.`);
    
    console.log(`Demo screenshot saved: ${filename}`);
    res.json({ success: true, filename, filepath });
  } catch (error) {
    console.error('Error creating demo screenshot:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API для получения списка скриншотов
app.get('/api/screenshot/list', (req, res) => {
  try {
    const screenshotDir = path.join(__dirname, 'frontend', 'public', 'screenshots');
    
    if (!fs.existsSync(screenshotDir)) {
      return res.json({ success: true, screenshots: [] });
    }

    const files = fs.readdirSync(screenshotDir)
      .filter(file => file.endsWith('.png') || file.endsWith('.txt'))
      .map(file => {
        const filepath = path.join(screenshotDir, file);
        const stats = fs.statSync(filepath);
        return {
          filename: file,
          created: stats.birthtime,
          size: stats.size
        };
      })
      .sort((a, b) => b.created - a.created);

    res.json({ success: true, screenshots: files });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Статические файлы для скриншотов
app.use('/screenshots', express.static(path.join(__dirname, 'frontend', 'public', 'screenshots')));

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Откройте браузер и перейдите по адресу: http://localhost:${PORT}`);
});
