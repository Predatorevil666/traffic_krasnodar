import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

export async function POST(request) {
	try {
		const { startDate, endDate, singleDate, type } = await request.json();

		// Читаем данные из data.json
		const jsonPath = path.join(process.cwd(), 'data.json');
		if (!fs.existsSync(jsonPath)) {
			return NextResponse.json({ success: false, error: 'Данные не найдены' }, { status: 404 });
		}

		const raw = fs.readFileSync(jsonPath, 'utf8');
		const data = raw ? JSON.parse(raw) : [];

		// Фильтруем данные по датам
		let filteredData = data;
		if (type === 'range' && startDate && endDate) {
			const start = new Date(startDate);
			const end = new Date(endDate);
			end.setHours(23, 59, 59, 999); // Включаем весь конечный день

			filteredData = data.filter(record => {
				const recordDate = new Date(record.dateIso);
				return recordDate >= start && recordDate <= end;
			});
		} else if (type === 'single' && singleDate) {
			// Получаем дату в формате YYYY-MM-DD для сравнения
			const targetDateStr = new Date(singleDate).toISOString().split('T')[0];

			filteredData = data.filter(record => {
				// Сравниваем только дату, игнорируя время
				const recordDateStr = new Date(record.dateIso).toISOString().split('T')[0];
				return recordDateStr === targetDateStr;
			});
		}

		if (filteredData.length === 0) {
			return NextResponse.json({ success: false, error: 'Нет данных за выбранный период' }, { status: 404 });
		}

		// Подготавливаем данные для Excel
		const excelData = filteredData.map(record => ({
			'Дата и время': new Date(record.dateIso).toLocaleString('ru-RU'),
			'Балл пробок': record.level || 'Не определен',
			'Файл скриншота': record.filename,
			'Timestamp': record.timestamp,
			'Дата (ISO)': record.dateIso
		}));

		// Создаем Excel файл
		const worksheet = XLSX.utils.json_to_sheet(excelData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Данные о пробках');

		// Устанавливаем ширину колонок
		worksheet['!cols'] = [
			{ width: 25 }, // Дата и время
			{ width: 15 }, // Балл пробок
			{ width: 45 }, // Файл скриншота
			{ width: 25 }, // Timestamp (увеличено для полного отображения)
			{ width: 30 }  // Дата (ISO)
		];

		// Форматируем колонку Timestamp как число без научной нотации
		const range = XLSX.utils.decode_range(worksheet['!ref']);
		for (let row = range.s.r + 1; row <= range.e.r; row++) {
			const timestampCell = XLSX.utils.encode_cell({ r: row, c: 3 }); // колонка D (Timestamp)
			if (worksheet[timestampCell]) {
				worksheet[timestampCell].z = '0'; // Формат числа без десятичных знаков
			}
		}

		// Генерируем буфер Excel файла
		const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

		// Создаем имя файла
		let filename;
		if (type === 'range') {
			const startStr = new Date(startDate).toISOString().split('T')[0];
			const endStr = new Date(endDate).toISOString().split('T')[0];
			filename = `traffic-data-${startStr}-to-${endStr}.xlsx`;
		} else {
			const dateStr = new Date(singleDate).toISOString().split('T')[0];
			filename = `traffic-data-${dateStr}.xlsx`;
		}

		// Возвращаем файл
		return new NextResponse(excelBuffer, {
			status: 200,
			headers: {
				'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'Content-Disposition': `attachment; filename="${filename}"`,
				'Content-Length': excelBuffer.length.toString()
			}
		});

	} catch (error) {
		console.error('Error exporting data:', error);
		return NextResponse.json({ success: false, error: 'Ошибка при экспорте данных' }, { status: 500 });
	}
}
