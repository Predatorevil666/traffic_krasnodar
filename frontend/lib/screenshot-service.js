const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
import { cronManager } from './cron-manager.js';

class ScreenshotService {
	constructor() {
		this.isEnabled = false;
		this.interval = 60; // минуты
		this.startTime = '06:00';
		this.endTime = '19:00';
		this.taskName = 'screenshot-scheduler';
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

		let cronExpression;

		// Создаем cron выражение в зависимости от интервала (используем 5-полевой формат)
		if (this.interval >= 60) {
			// Для интервалов от часа и больше - используем часовой cron
			const hours = Math.floor(this.interval / 60);
			cronExpression = `0 */${hours} * * *`; // каждые N часов в 0 минут
		} else {
			// Для всех интервалов меньше часа - используем минутный cron
			cronExpression = `*/${this.interval} * * * *`; // каждые N минут
		}

		console.log(`Starting screenshot scheduler with cron: ${cronExpression} (interval: ${this.interval} minutes)`);

		cronManager.schedule(this.taskName, cronExpression, async () => {
			if (this.isEnabled && this.isInTimeRange()) {
				console.log('Taking scheduled screenshot...');
				await this.takeScreenshot();
			} else {
				console.log('Skipping scheduled screenshot - outside time range or disabled');
			}
		});
	}

	// Остановка планировщика
	stopScheduler() {
		console.log('Stopping screenshot scheduler...');
		cronManager.stop(this.taskName);
	}

	// Инициализация браузера
	async initBrowser() {
		if (!this.browser) {
			console.log('Initializing Puppeteer browser...');
			this.browser = await puppeteer.launch({
				headless: "new", // Используем новый headless режим
				args: [
					'--no-sandbox',
					'--disable-setuid-sandbox',
					'--disable-dev-shm-usage',
					'--disable-accelerated-2d-canvas',
					'--no-first-run',
					'--disable-gpu',
					'--disable-web-security',
					'--disable-features=VizDisplayCompositor'
				]
			});
		}
		return this.browser;
	}

	// Создание скриншота
	async takeScreenshot() {
		let browser = null;
		let page = null;

		try {
			// Создаем новый браузер для каждого скриншота для стабильности
			console.log('Launching new browser instance...');
			browser = await puppeteer.launch({
				headless: "new",
				args: [
					'--no-sandbox',
					'--disable-setuid-sandbox',
					'--disable-dev-shm-usage',
					'--disable-gpu',
					'--disable-web-security'
				]
			});

			page = await browser.newPage();

			// Устанавливаем размер экрана
			await page.setViewport({ width: 1920, height: 1080 });

			// Переходим на страницу с картой (Next.js приложение на порту 3000)
			console.log('Navigating to http://localhost:3000...');
			await page.goto('http://localhost:3000', {
				waitUntil: 'domcontentloaded',
				timeout: 30000
			});

			// Ждем загрузки карты дольше
			console.log('Waiting for page to load...');
			await page.waitForTimeout(3000);

			// Проверяем, что страница все еще активна
			if (page.isClosed()) {
				throw new Error('Page was closed before screenshot could be taken');
			}

			// Создаем папку по дате и имя файла с датой и временем
			const now = new Date();
			const dateFolder = now.getFullYear() + '-' +
				(now.getMonth() + 1).toString().padStart(2, '0') + '-' +
				now.getDate().toString().padStart(2, '0');

			const timeStamp = now.getHours().toString().padStart(2, '0') + '-' +
				now.getMinutes().toString().padStart(2, '0');

			// Проверяем, существует ли уже файл с таким именем, и добавляем счетчик если нужно
			let filename = `traffic_screenshot_${dateFolder}_${timeStamp}.png`;
			let filepath = path.join(process.cwd(), 'public', 'screenshots', dateFolder, filename);

			let counter = 1;
			while (fs.existsSync(filepath)) {
				filename = `traffic_screenshot_${dateFolder}_${timeStamp}_${counter}.png`;
				filepath = path.join(process.cwd(), 'public', 'screenshots', dateFolder, filename);
				counter++;
			}

			// Убеждаемся что папка существует
			const screenshotDir = path.dirname(filepath);
			if (!fs.existsSync(screenshotDir)) {
				fs.mkdirSync(screenshotDir, { recursive: true });
			}

			console.log('Taking screenshot...');
			// Делаем скриншот
			await page.screenshot({
				path: filepath,
				fullPage: false, // Изменено на false для избежания проблем
				// quality убран, так как PNG не поддерживает этот параметр
			});

			console.log(`Screenshot saved: ${filename}`);
			return { success: true, filename, filepath };

		} catch (error) {
			console.error('Error taking screenshot:', error);
			return { success: false, error: error.message };
		} finally {
			// Всегда закрываем браузер полностью
			if (browser) {
				try {
					await browser.close();
					console.log('Browser closed successfully');
				} catch (e) {
					console.error('Error closing browser:', e);
				}
			}
		}
	}

	// Ручное создание скриншота
	async takeManualScreenshot() {
		console.log('Taking manual screenshot...');
		return await this.takeScreenshot();
	}

	// Получение списка сохраненных скриншотов
	getScreenshots() {
		const screenshotDir = path.join(process.cwd(), 'public', 'screenshots');

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

	// Очистка старых скриншотов (старше 7 дней)
	cleanupOldScreenshots() {
		const screenshotDir = path.join(process.cwd(), 'public', 'screenshots');

		if (!fs.existsSync(screenshotDir)) {
			return;
		}

		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		let deletedCount = 0;
		let deletedFolders = 0;

		// Читаем все подпапки с датами
		const dateFolders = fs.readdirSync(screenshotDir)
			.filter(item => {
				const itemPath = path.join(screenshotDir, item);
				return fs.statSync(itemPath).isDirectory();
			});

		dateFolders.forEach(dateFolder => {
			const dateFolderPath = path.join(screenshotDir, dateFolder);

			// Парсим дату из названия папки (формат YYYY-MM-DD)
			const folderDate = new Date(dateFolder);

			if (folderDate < sevenDaysAgo) {
				// Удаляем всю папку если она старше 7 дней
				const files = fs.readdirSync(dateFolderPath);
				files.forEach(file => {
					if (file.endsWith('.png')) {
						fs.unlinkSync(path.join(dateFolderPath, file));
						deletedCount++;
					}
				});

				// Удаляем саму папку
				fs.rmdirSync(dateFolderPath);
				deletedFolders++;
			} else {
				// Для папок моложе 7 дней проверяем отдельные файлы
				const files = fs.readdirSync(dateFolderPath);
				files.forEach(file => {
					if (file.endsWith('.png')) {
						const filepath = path.join(dateFolderPath, file);
						const stats = fs.statSync(filepath);

						if (stats.birthtime < sevenDaysAgo) {
							fs.unlinkSync(filepath);
							deletedCount++;
						}
					}
				});
			}
		});

		console.log(`Cleaned up ${deletedCount} old screenshots from ${deletedFolders} folders`);
		return deletedCount;
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
let screenshotService = null;

// Функция для полной перезагрузки сервиса
function resetScreenshotService() {
	console.log('Resetting screenshot service...');

	// Останавливаем все cron-задачи
	cronManager.stopAll();

	if (screenshotService) {
		screenshotService.stopScheduler();
		screenshotService.closeBrowser();
	}
	screenshotService = null;
	console.log('Screenshot service reset complete');
}

async function getScreenshotService() {
	if (!screenshotService) {
		screenshotService = new ScreenshotService();

		// Загружаем сохраненные настройки
		try {
			const { loadSettings } = await import('./settings-storage.js');
			const settings = loadSettings();
			console.log('Loading saved settings on service init:', settings);
			screenshotService.configure(settings);
		} catch (error) {
			console.log('Could not load settings on init, using defaults');
		}
	}
	return screenshotService;
}

export { getScreenshotService, resetScreenshotService };
