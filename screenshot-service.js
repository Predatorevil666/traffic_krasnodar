const puppeteer = require('puppeteer');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

class ScreenshotService {
	constructor() {
		this.isEnabled = false;
		this.interval = 60; // минуты
		this.startTime = '06:00';
		this.endTime = '19:00';
		this.cronJob = null;
		this.browser = null;
	}

	// Настройка параметров скриншотов
	configure(settings) {
		this.isEnabled = settings.enabled || false;
		this.interval = parseInt(settings.interval) || 60;
		this.startTime = settings.startTime || '06:00';
		this.endTime = settings.endTime || '19:00';

		console.log('Screenshot service configured:', {
			enabled: this.isEnabled,
			interval: this.interval,
			startTime: this.startTime,
			endTime: this.endTime
		});

		if (this.isEnabled) {
			this.startScheduler();
		} else {
			this.stopScheduler();
		}
	}

	// Проверка, находится ли текущее время в заданном интервале
	isInTimeRange() {
		const now = new Date();
		const currentTime = now.getHours().toString().padStart(2, '0') + ':' +
			now.getMinutes().toString().padStart(2, '0');

		return currentTime >= this.startTime && currentTime <= this.endTime;
	}

	// Запуск планировщика
	startScheduler() {
		this.stopScheduler(); // Останавливаем предыдущий планировщик если есть

		// Создаем cron выражение для выполнения каждый час
		const cronExpression = `0 */${Math.floor(this.interval / 60)} * * *`;

		console.log(`Starting screenshot scheduler with cron: ${cronExpression}`);

		this.cronJob = cron.schedule(cronExpression, async () => {
			if (this.isEnabled && this.isInTimeRange()) {
				console.log('Taking scheduled screenshot...');
				await this.takeScreenshot();
			}
		}, {
			scheduled: true,
			timezone: "Europe/Moscow"
		});
	}

	// Остановка планировщика
	stopScheduler() {
		if (this.cronJob) {
			this.cronJob.destroy();
			this.cronJob = null;
			console.log('Screenshot scheduler stopped');
		}
	}

	// Инициализация браузера
	async initBrowser() {
		if (!this.browser) {
			console.log('Initializing Puppeteer browser...');
			this.browser = await puppeteer.launch({
				headless: true,
				args: [
					'--no-sandbox',
					'--disable-setuid-sandbox',
					'--disable-dev-shm-usage',
					'--disable-accelerated-2d-canvas',
					'--no-first-run',
					'--no-zygote',
					'--single-process',
					'--disable-gpu'
				]
			});
		}
		return this.browser;
	}

	// Создание скриншота
	async takeScreenshot() {
		try {
			const browser = await this.initBrowser();
			const page = await browser.newPage();

			// Устанавливаем размер экрана
			await page.setViewport({ width: 1920, height: 1080 });

			// Переходим на страницу с картой
			await page.goto('http://localhost:3000', {
				waitUntil: 'networkidle0',
				timeout: 30000
			});

			// Ждем загрузки карты
			await page.waitForTimeout(5000);

			// Создаем папку по дате и имя файла с датой и временем
			const now = new Date();
			const dateFolder = now.getFullYear() + '-' +
				(now.getMonth() + 1).toString().padStart(2, '0') + '-' +
				now.getDate().toString().padStart(2, '0');

			const timeStamp = now.getHours().toString().padStart(2, '0') + '-' +
				now.getMinutes().toString().padStart(2, '0');

			// Проверяем, существует ли уже файл с таким именем, и добавляем счетчик если нужно
			let filename = `traffic_screenshot_${dateFolder}_${timeStamp}.png`;
			let filepath = path.join(__dirname, 'frontend', 'public', 'screenshots', dateFolder, filename);

			let counter = 1;
			while (fs.existsSync(filepath)) {
				filename = `traffic_screenshot_${dateFolder}_${timeStamp}_${counter}.png`;
				filepath = path.join(__dirname, 'frontend', 'public', 'screenshots', dateFolder, filename);
				counter++;
			}

			// Убеждаемся что папка существует
			const screenshotDir = path.dirname(filepath);
			if (!fs.existsSync(screenshotDir)) {
				fs.mkdirSync(screenshotDir, { recursive: true });
			}

			// Делаем скриншот
			await page.screenshot({
				path: filepath,
				fullPage: true,
				quality: 90
			});

			await page.close();

			console.log(`Screenshot saved: ${filename}`);
			return { success: true, filename, filepath };

		} catch (error) {
			console.error('Error taking screenshot:', error);
			return { success: false, error: error.message };
		}
	}

	// Ручное создание скриншота
	async takeManualScreenshot() {
		console.log('Taking manual screenshot...');
		return await this.takeScreenshot();
	}

	// Получение списка сохраненных скриншотов
	getScreenshots() {
		const screenshotDir = path.join(__dirname, 'frontend', 'public', 'screenshots');

		if (!fs.existsSync(screenshotDir)) {
			return [];
		}

		const allScreenshots = [];

		// Читаем все подпапки с датами
		const dateFolders = fs.readdirSync(screenshotDir)
			.filter(item => {
				const itemPath = path.join(screenshotDir, item);
				return fs.statSync(itemPath).isDirectory();
			})
			.sort((a, b) => b.localeCompare(a)); // Сортируем даты по убыванию (новые сначала)

		// Собираем файлы из всех папок с датами
		dateFolders.forEach(dateFolder => {
			const dateFolderPath = path.join(screenshotDir, dateFolder);

			if (fs.existsSync(dateFolderPath)) {
				const files = fs.readdirSync(dateFolderPath)
					.filter(file => file.endsWith('.png'))
					.map(file => {
						const filepath = path.join(dateFolderPath, file);
						const stats = fs.statSync(filepath);
						return {
							filename: file,
							date: dateFolder,
							fullPath: `${dateFolder}/${file}`,
							created: stats.birthtime,
							size: stats.size
						};
					});

				allScreenshots.push(...files);
			}
		});

		// Сортируем по дате создания (новые сначала)
		return allScreenshots.sort((a, b) => b.created - a.created);
	}



	// Закрытие браузера
	async closeBrowser() {
		if (this.browser) {
			await this.browser.close();
			this.browser = null;
			console.log('Browser closed');
		}
	}
}

// Создаем единственный экземпляр сервиса
const screenshotService = new ScreenshotService();



module.exports = screenshotService;

