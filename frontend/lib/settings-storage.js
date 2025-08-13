import fs from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'screenshot-settings.json');

const defaultSettings = {
	enabled: false,
	interval: 60,
	startTime: '06:00',
	endTime: '19:00'
};

export function loadSettings() {
	try {
		if (fs.existsSync(SETTINGS_FILE)) {
			const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
			return JSON.parse(data);
		}
	} catch (error) {
		console.error('Error loading settings:', error);
	}
	return defaultSettings;
}

export function saveSettings(settings) {
	try {
		fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
		console.log('Settings saved to file:', settings);
		return true;
	} catch (error) {
		console.error('Error saving settings:', error);
		return false;
	}
}

