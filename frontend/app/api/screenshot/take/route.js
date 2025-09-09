import { NextResponse } from "next/server";
import { getScreenshotService } from "@/lib/screenshot-service";

export async function POST() {
	try {
		console.log('Screenshot request received');

		// Используем реальный сервис скриншотов
		const screenshotService = await getScreenshotService();
		const result = await screenshotService.takeManualScreenshot();

		if (result.success) {
			return NextResponse.json({
				success: true,
				filename: result.filename,
				message: 'Screenshot created successfully'
			});
		} else {
			return NextResponse.json({
				success: false,
				error: result.error
			}, { status: 500 });
		}
	} catch (error) {
		console.error('Error taking screenshot:', error);
		return NextResponse.json({
			success: false,
			error: 'Failed to take screenshot'
		}, { status: 500 });
	}
}
