import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "traffic-data.json");

export async function GET() {
  try {
    // Читаем файл с данными
    const fileData = await fs.readFile(DATA_PATH, "utf-8");
    const data = JSON.parse(fileData);

    // Сортируем по дате (новые записи первыми)
    const sortedData = data.sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Возвращаем только последние 100 записей
    return NextResponse.json(sortedData.slice(0, 100));
  } catch (error: any) {
    // Если файл не существует - возвращаем пустой массив
    if (error.code === "ENOENT") {
      return NextResponse.json([]);
    }

    console.error("Error reading traffic data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
