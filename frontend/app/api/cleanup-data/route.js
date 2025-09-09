import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function POST() {
	try {
		const jsonPath = path.join(process.cwd(), 'data.json');
		if (!fs.existsSync(jsonPath)) {
			return NextResponse.json({ success: false, error: 'Файл data.json не найден' }, { status: 404 });
		}

		const raw = fs.readFileSync(jsonPath, 'utf8');
		const data = raw ? JSON.parse(raw) : [];

		// Удаляем дубликаты по filename, оставляем первое вхождение
		const uniqueData = [];
		const seenFilenames = new Set();

		for (const record of data) {
			if (!seenFilenames.has(record.filename)) {
				uniqueData.push(record);
				seenFilenames.add(record.filename);
			}
		}

		// Сортируем по timestamp для правильного порядка
		uniqueData.sort((a, b) => a.timestamp - b.timestamp);

		// Сохраняем очищенные данные
		fs.writeFileSync(jsonPath, JSON.stringify(uniqueData, null, 2), 'utf8');

		return NextResponse.json({
			success: true,
			message: `Удалено ${data.length - uniqueData.length} дубликатов. Осталось ${uniqueData.length} записей.`,
			removedCount: data.length - uniqueData.length,
			remainingCount: uniqueData.length
		});

	} catch (error) {
		console.error('Error cleaning up data:', error);
		return NextResponse.json({ success: false, error: 'Ошибка при очистке данных' }, { status: 500 });
	}
}
