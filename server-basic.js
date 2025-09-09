const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// Функция для чтения файлов
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return null;
  }
}

// Функция для определения MIME типа
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };
  return mimeTypes[ext] || 'text/plain';
}

// Создаем HTTP сервер
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  console.log(`${req.method} ${pathname}`);

  // CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Обработка OPTIONS запросов
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Главная страница
  if (pathname === '/' || pathname === '/index.html') {
    let html = readFile(path.join(__dirname, 'backend/index.html'));
    if (html) {
      // Заменяем placeholder на реальный ключ
      const apiKey = process.env.YANDEX_MAPS_API_KEY || '7c99fc7b-a6c3-49ec-9fa2-58cd9ead04eb';
      html = html.replace('__YANDEX_MAPS_API_KEY__', apiKey);
      
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    }
    return;
  }

  // 2GIS страница
  if (pathname === '/2gis') {
    let html = readFile(path.join(__dirname, 'backend/index_2gis.html'));
    if (html) {
      // Заменяем placeholder на реальный ключ 2GIS
      const apiKey = process.env.DGIS_API_KEY || 'руфьуз2с3в';
      html = html.replace('__2GIS_API_KEY__', apiKey);
      
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    }
    return;
  }

  // API для настройки скриншотов
  if (pathname === '/api/screenshot/configure' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('Screenshot settings received:', data);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          message: 'Screenshot settings updated (demo mode)' 
        }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // API для создания скриншота
  if (pathname === '/api/screenshot/take' && req.method === 'POST') {
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
    const content = `Demo screenshot created at ${now.toISOString()}\nThis is a placeholder for the actual screenshot functionality.`;
    fs.writeFileSync(filepath, content);
    
    console.log(`Demo screenshot saved: ${filename}`);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, filename, filepath }));
    return;
  }

  // API для получения списка скриншотов
  if (pathname === '/api/screenshot/list' && req.method === 'GET') {
    const screenshotDir = path.join(__dirname, 'frontend', 'public', 'screenshots');
    
    if (!fs.existsSync(screenshotDir)) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, screenshots: [] }));
      return;
    }

    try {
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

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, screenshots: files }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
    return;
  }

  // Статические файлы для скриншотов
  if (pathname.startsWith('/screenshots/')) {
    const filePath = path.join(__dirname, 'frontend', 'public', pathname);
    const content = readFile(filePath);
    
    if (content !== null) {
      const mimeType = getMimeType(filePath);
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(content);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    }
    return;
  }

  // Статические файлы из backend
  if (pathname.startsWith('/')) {
    const filePath = path.join(__dirname, 'backend', pathname);
    const content = readFile(filePath);
    
    if (content !== null) {
      const mimeType = getMimeType(filePath);
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(content);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    }
    return;
  }

  // 404 для всех остальных запросов
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Откройте браузер и перейдите по адресу: http://localhost:${PORT}`);
  console.log(`2GIS карта: http://localhost:${PORT}/2gis`);
});
