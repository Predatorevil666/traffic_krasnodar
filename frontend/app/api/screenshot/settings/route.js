import { NextResponse } from "next/server";
import { loadSettings } from "@/lib/settings-storage";

export async function GET() {
	try {
		const settings = loadSettings();
		return NextResponse.json({
			success: true,
			settings: settings
		});
	} catch (error) {
		console.error('Error getting screenshot settings:', error);
		return NextResponse.json({
			success: false,
			error: 'Failed to get settings'
		}, { status: 500 });
	}
}
