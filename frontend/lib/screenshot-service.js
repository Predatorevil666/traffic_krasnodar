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
		this.isProcessing = false; // Флаг для предотвращения параллельных задач
	}

	// Извлечение реального балла пробок из страницы (аналогично backend/index.html)
	async extractRealTrafficScore(page) {
		try {
			// Ждем загрузки карты
			await page.waitForTimeout(5000);

			// Извлекаем балл пробок из DOM (аналогично backend/index.html)
			const trafficScore = await page.evaluate(() => {
				// Функция для извлечения балла из текста (копия из backend/index.html)
				function extractTrafficScore(text) {
					const match = text.match(/(\d+)\s+балл(а|ов)?/);
					if (match && match[1]) {
						return parseInt(match[1]);
					}
					return null;
				}

				// Ищем элементы пробок по частичному совпадению класса
				const trafficElements = document.querySelectorAll('[class*="traffic"]');
				console.log(`Найдено элементов с "traffic" в классе: ${trafficElements.length}`);

				for (let i = 0; i < trafficElements.length; i++) {
					const element = trafficElements[i];
					const text = element.textContent;
					console.log(`Элемент ${i}: класс="${element.className}", текст="${text}"`);
					const score = extractTrafficScore(text);
					if (score) {
						console.log(`Найден балл пробок: ${score}`);
						return score;
					}
				}

				// Дополнительно ищем по другим селекторам
				const allElements = document.querySelectorAll('*');
				let foundElements = 0;
				for (let i = 0; i < allElements.length; i++) {
					const element = allElements[i];
					const text = element.textContent;
					if (text && text.includes('балл')) {
						foundElements++;
						console.log(`Элемент с "балл": класс="${element.className}", текст="${text.substring(0, 100)}"`);
						if (foundElements > 10) break; // Ограничиваем вывод
					}
				}

				return null;
			});

			if (trafficScore !== null) {
				console.log(`Извлечен реальный балл пробок: ${trafficScore}`);
				return trafficScore;
			}
		} catch (error) {
			console.error('Ошибка при извлечении балла пробок:', error);
		}

		// Fallback отключен - возвращаем null если не удалось извлечь реальный балл
		console.log('Не удалось извлечь реальный балл пробок');
		return null;
	}

	// Fallback подсчет уровня пробок (если не удалось извлечь реальный)
	computeFallbackTrafficLevel(date) {
		const hour = date.getHours();
		let baseLevel = 0;
		if (hour >= 7 && hour <= 10) {
			baseLevel = 7;
		} else if (hour >= 17 && hour <= 20) {
			baseLevel = 8;
		} else if ((hour >= 11 && hour <= 16) || (hour >= 21 && hour <= 23)) {
			baseLevel = 4;
		} else {
			baseLevel = 1;
		}
		const randomVariation = Math.floor(Math.random() * 3) - 1;
		const level = Math.max(0, Math.min(10, baseLevel + randomVariation));
		return level;
	}

	// Добавление записи о пробках в data.json в корне фронтенда
	appendTrafficRecord(record) {
		try {
			const jsonPath = path.join(process.cwd(), 'data.json');
			let data = [];
			if (fs.existsSync(jsonPath)) {
				try {
					const raw = fs.readFileSync(jsonPath, 'utf8');
					data = raw ? JSON.parse(raw) : [];
				} catch (e) {
					data = [];
				}
			}

			// Проверяем, нет ли уже записи с таким же filename
			const existingRecord = data.find(item => item.filename === record.filename);
			if (existingRecord) {
				console.log(`Record with filename ${record.filename} already exists, skipping`);
				return;
			}

			data.push(record);
			fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
			console.log('Traffic record appended to data.json');
		} catch (e) {
			console.error('Failed to append traffic record:', e);
		}
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
		console.log(`Active cron tasks before scheduling: ${cronManager.getStatus().length}`);

		cronManager.schedule(this.taskName, cronExpression, async () => {
			const taskId = Math.random().toString(36).substring(7);
			console.log(`[TASK-${taskId}] Cron task triggered`);

			if (globalProcessingLock || this.isProcessing) {
				console.log(`[TASK-${taskId}] Skipping scheduled screenshot - previous task still running (global: ${globalProcessingLock}, local: ${this.isProcessing})`);
				return;
			}

			if (this.isEnabled && this.isInTimeRange()) {
				console.log(`[TASK-${taskId}] Taking scheduled screenshot...`);
				globalProcessingLock = true;
				this.isProcessing = true;
				try {
					await this.takeScreenshot();
				} finally {
					console.log(`[TASK-${taskId}] Screenshot completed, releasing locks`);
					this.isProcessing = false;
					globalProcessingLock = false;
				}
			} else {
				console.log(`[TASK-${taskId}] Skipping scheduled screenshot - outside time range or disabled`);
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

			// Переходим на страницу с реальной Яндекс картой в Next.js
			console.log('Navigating to http://localhost:3000/yandex-map...');
			await page.goto('http://localhost:3000/yandex-map', {
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

			// Извлекаем реальный балл пробок из страницы
			const trafficLevel = await this.extractRealTrafficScore(page);
			const trafficRecord = {
				dateIso: now.toISOString(),
				timestamp: now.getTime(),
				level: trafficLevel,
				filename,
				path: path.join('public', 'screenshots', dateFolder, filename)
			};
			this.appendTrafficRecord(trafficRecord);

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
		if (globalProcessingLock || this.isProcessing) {
			console.log('Cannot take manual screenshot - another screenshot is in progress');
			return { success: false, error: 'Another screenshot is already in progress' };
		}

		console.log('Taking manual screenshot...');
		globalProcessingLock = true;
		this.isProcessing = true;
		try {
			return await this.takeScreenshot();
		} finally {
			this.isProcessing = false;
			globalProcessingLock = false;
		}
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
// Глобальная блокировка для предотвращения параллельных скриншотов
let globalProcessingLock = false;

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
		console.log('🔧 Creating NEW ScreenshotService instance');
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
	} else {
		console.log('♻️ Reusing existing ScreenshotService instance');
	}
	return screenshotService;
}

export { getScreenshotService, resetScreenshotService };
