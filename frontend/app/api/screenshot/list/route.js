import { NextResponse } from "next/server";
const { getScreenshotService } = require("@/lib/screenshot-service");

export async function GET() {
	try {
		const screenshotService = getScreenshotService();
		const screenshots = screenshotService.getScreenshots();

		return NextResponse.json({
			success: true,
			screenshots
		});
	} catch (error) {
		console.error('Error getting screenshot list:', error);
		return NextResponse.json({
			success: false,
			error: 'Failed to get screenshots'
		}, { status: 500 });
	}
}

