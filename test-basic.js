const http = require('http');

// Тестируем главную страницу
const testMainPage = () => {
  const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
  }, (res) => {
    console.log(`✅ Главная страница: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log('✅ Сервер работает!');
    }
  });

  req.on('error', (e) => {
    console.error(`❌ Ошибка: ${e.message}`);
  });

  req.end();
};

// Тестируем API скриншотов
const testScreenshotAPI = () => {
  const postData = JSON.stringify({
    enabled: true,
    interval: 60,
    startTime: '06:00',
    endTime: '19:00'
  });

  const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/screenshot/configure',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, (res) => {
    console.log(`✅ API настройки скриншотов: ${res.statusCode}`);
  });

  req.on('error', (e) => {
    console.error(`❌ Ошибка API: ${e.message}`);
  });

  req.write(postData);
  req.end();
};

// Запускаем тесты
console.log('🧪 Тестируем сервер...');
setTimeout(testMainPage, 1000);
setTimeout(testScreenshotAPI, 2000);
