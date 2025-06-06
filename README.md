# Мониторинг пробок Краснодара

Приложение для отображения текущего балла пробок в Краснодаре с использованием API Яндекс.Карт.

## Требования

- Node.js (версия 14 или выше)
- npm (устанавливается вместе с Node.js)

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/YourUsername/traffic_krasnodar.git
cd traffic_krasnodar
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` в корневой директории проекта и добавьте в него ваш API-ключ Яндекс.Карт:

```
YANDEX_MAPS_API_KEY=ваш-ключ-api
DGIS_API_KEY=ваш-ключ-api
```

## Запуск

Запустите сервер:
```bash
node server.js
```

После запуска откройте браузер и перейдите по адресу:
http://localhost:3000 # Яндекс.Карты
http://localhost:3000/2gis # 2GIS


## Как это работает

Приложение отображает карту Краснодара с включенным слоем пробок. Текущий балл пробок извлекается из интерфейса Яндекс.Карт и отображается на странице. Обновление происходит автоматически каждые 10 секунд.

## Файлы проекта

- `server.js` - серверная часть приложения
- `backend/index.html` - клиентская часть приложения
- `.env` - файл с конфигурацией (API-ключ)

Если у вас нет API-ключа, будет использован тестовый ключ, но рекомендуется получить собственный на [developer.tech.yandex.ru](https://developer.tech.yandex.ru/).



