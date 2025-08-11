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
