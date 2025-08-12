import { NextResponse } from "next/server";
import { saveSettings } from "@/lib/settings-storage";
import { getScreenshotService, resetScreenshotService } from "@/lib/screenshot-service";

export async function POST(request) {
	try {
		const data = await request.json();
		const { enabled, interval, startTime, endTime } = data;

		console.log('Screenshot settings received:', data);

		// Сохраняем настройки в файл
		const settings = {
			enabled,
			interval: parseInt(interval),
			startTime,
			endTime
		};

		saveSettings(settings);
		console.log('Settings saved:', settings);

		// Полностью перезагружаем сервис скриншотов
		try {
			console.log('Resetting screenshot service...');
			resetScreenshotService();

			// Создаем новый сервис с новыми настройками
			const screenshotService = await getScreenshotService();
			screenshotService.configure(settings);
			console.log('Screenshot service configured with new settings');
		} catch (error) {
			console.error('Error configuring screenshot service:', error);
		}

		return NextResponse.json({
			success: true,
			message: 'Screenshot settings updated successfully'
		});
	} catch (error) {
		console.error('Error updating screenshot settings:', error);
		return NextResponse.json({
			success: false,
			error: 'Failed to update settings'
		}, { status: 500 });
	}
}
