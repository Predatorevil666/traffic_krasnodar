import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function GET() {
	try {
		const jsonPath = path.join(process.cwd(), 'data.json');
		if (!fs.existsSync(jsonPath)) {
			return NextResponse.json({ success: true, data: [] });
		}
		const raw = fs.readFileSync(jsonPath, 'utf8');
		const data = raw ? JSON.parse(raw) : [];
		return NextResponse.json({ success: true, data });
	} catch (error) {
		console.error('Failed to read data.json:', error);
		return NextResponse.json({ success: false, error: 'Failed to read data' }, { status: 500 });
	}
}

import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const db = await open({
			filename: "./data/database.sqlite",
			driver: sqlite3.Database,
		});

		// Создание таблицы (если не существует)
		await db.exec(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )
    `);

		// Пример запроса: получение данных
		const items = await db.all("SELECT * FROM items");

		await db.close();
		return NextResponse.json(items);
	} catch (error) {
		return NextResponse.json({ error: "Database error" }, { status: 500 });
	}
}

export async function POST(request) {
	const { name } = await request.json();

	try {
		const db = await open({
			filename: "./data/database.sqlite",
			driver: sqlite3.Database,
		});

		// Добавление данных
		await db.run("INSERT INTO items (name) VALUES (?)", name);

		await db.close();
		return NextResponse.json({ success: true }, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to insert data" },
			{ status: 500 }
		);
	}
}
