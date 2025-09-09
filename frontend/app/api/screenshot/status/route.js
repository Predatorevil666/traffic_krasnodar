import { NextResponse } from "next/server";
import { loadSettings } from "@/lib/settings-storage";
import { getScreenshotService } from "@/lib/screenshot-service";
import fs from 'fs';
import path from 'path';

export async function GET() {
	try {
		// Загружаем настройки
		const settings = loadSettings();

		// Получаем информацию о скриншотах
		const screenshotService = await getScreenshotService();
		const screenshots = screenshotService.getScreenshots();

		// Читаем данные о пробках из data.json
		let trafficData = [];
		let averageTrafficLevel = null;
		try {
			const jsonPath = path.join(process.cwd(), 'data.json');
			if (fs.existsSync(jsonPath)) {
				const raw = fs.readFileSync(jsonPath, 'utf8');
				trafficData = raw ? JSON.parse(raw) : [];

				// Вычисляем средний балл пробок за сегодня (исключая null значения)
				const today = new Date().toISOString().split('T')[0];
				const todayRecords = trafficData.filter(record => {
					const recordDateStr = new Date(record.dateIso).toISOString().split('T')[0];
					return recordDateStr === today && record.level !== null && record.level !== undefined;
				});

				if (todayRecords.length > 0) {
					const sum = todayRecords.reduce((acc, record) => acc + record.level, 0);
					averageTrafficLevel = Math.round((sum / todayRecords.length) * 10) / 10; // Округляем до 1 знака после запятой
				}
			}
		} catch (error) {
			console.error('Error reading traffic data:', error);
		}

		// Получаем информацию о последнем скриншоте
		let lastScreenshot = null;
		if (screenshots.length > 0) {
			const latest = screenshots[0]; // уже отсортированы по дате создания
			lastScreenshot = {
				filename: latest.filename,
				date: latest.date,
				created: latest.created,
				fullPath: latest.fullPath
			};
		}

		// Проверяем, находится ли текущее время в рабочем интервале
		let isInWorkingHours = false;
		if (settings.enabled) {
			const now = new Date();
			const currentTime = now.getHours().toString().padStart(2, '0') + ':' +
				now.getMinutes().toString().padStart(2, '0');
			isInWorkingHours = currentTime >= settings.startTime && currentTime <= settings.endTime;
		}

		return NextResponse.json({
			success: true,
			status: {
				enabled: settings.enabled,
				interval: settings.interval,
				startTime: settings.startTime,
				endTime: settings.endTime,
				isInWorkingHours,
				totalScreenshots: screenshots.length,
				totalTrafficRecords: trafficData.length,
				averageTrafficLevel,
				lastScreenshot,
				// Подсчитываем скриншоты за сегодня
				todayScreenshots: screenshots.filter(s => {
					const today = new Date().toISOString().split('T')[0];
					return s.date === today;
				}).length
			}
		});
	} catch (error) {
		console.error('Error getting screenshot status:', error);
		return NextResponse.json({
			success: false,
			error: 'Failed to get status'
		}, { status: 500 });
	}
}


