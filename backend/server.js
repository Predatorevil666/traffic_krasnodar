const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Обрабатываем только GET запросы к index.html или корневому пути
    if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
        const filePath = path.join(__dirname, 'index.html');
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Ошибка при чтении файла: ' + err.message);
                return;
            }
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else {
        res.writeHead(404);
        res.end('Страница не найдена');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Откройте браузер и перейдите по адресу: http://localhost:${PORT}`);
}); 