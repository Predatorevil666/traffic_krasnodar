import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Тип для записи о трафике
type TrafficRecord = {
  date: string;
  time: string;
  level: number;
};

export async function POST(req: Request) {
  try {
    const newRecord = await req.json();
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "data.json");

    // Создаем директорию, если не существует
    await fs.mkdir(dataDir, { recursive: true });

    let records: TrafficRecord[] = [];
    let nextId = 1;

    try {
      // Читаем существующие данные
      const fileData = await fs.readFile(filePath, "utf8");
      if (fileData.trim() !== "") {
        records = JSON.parse(fileData);

        // Находим максимальный ID для генерации следующего
        if (records.length > 0) {
          nextId = Math.max(...records.map((r) => r.id)) + 1;
        }
      }
    } catch (error) {
      console.log("Создание нового файла данных");
    }

    // Создаем новую запись с последовательным ID
    const recordWithId: TrafficRecord = {
      id: nextId,
      ...newRecord,
    };

    // Добавляем новую запись в массив
    records.push(recordWithId);

    // Сохраняем обновленные данные
    await fs.writeFile(filePath, JSON.stringify(records, null, 2));

    return NextResponse.json({
      success: true,
      newId: nextId,
      totalRecords: records.length,
    });
  } catch (error) {
    console.error("Ошибка сохранения данных:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
