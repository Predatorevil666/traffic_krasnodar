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


