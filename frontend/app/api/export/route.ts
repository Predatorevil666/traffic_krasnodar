import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { parse, format, isWithinInterval, addDays } from "date-fns";
import { promises as fs } from "fs";
import path from "path";

interface TrafficData {
  id: number;
  date: string;
  time: string;
  level: number;
}

export async function POST(request: NextRequest) {
  try {
    const { startDate, endDate } = await request.json();

    // Путь к JSON файлу с данными
    const filePath = path.join(process.cwd(), "data", "data.json");

    // Чтение данных из файла
    const fileContents = await fs.readFile(filePath, "utf8");
    const data: TrafficData[] = JSON.parse(fileContents);

    // Преобразуем даты из запроса в объекты Date и добавляем 1 день
    // чтобы компенсировать разницу в часовых поясах
    const start = addDays(parse(startDate, "yyyy-MM-dd", new Date()), 1);
    const end = addDays(parse(endDate, "yyyy-MM-dd", new Date()), 1);

    console.log(
      "Filtering from:",
      format(start, "dd.MM.yyyy HH:mm:ss"),
      "to:",
      format(end, "dd.MM.yyyy HH:mm:ss")
    );

    // Фильтрация данных по диапазону дат
    const filteredData = data.filter((item) => {
      try {
        const itemDate = parse(
          `${item.date} ${item.time}`,
          "dd.MM.yyyy HH:mm:ss",
          new Date()
        );

        return isWithinInterval(itemDate, {
          start: start,
          end: end,
        });
      } catch (error) {
        console.error("Error parsing date:", error);
        return false;
      }
    });

    console.log(`Found ${filteredData.length} items from ${data.length} total`);

    // Создание Excel workbook
    const workbook = XLSX.utils.book_new();

    // Преобразование данных для Excel
    const excelData = filteredData.map((item) => ({
      ID: item.id,
      Дата: item.date,
      Время: item.time,
      "Уровень пробок": item.level,
    }));

    if (excelData.length === 0) {
      excelData.push({
        ID: 0,
        Дата: "Нет данных",
        Время: "Для данного диапазона",
        "Уровень пробок": 0,
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Данные о пробках");

    // Генерация буфера
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Возвращаем файл
    return new NextResponse(buffer, {
      status: 200,
      headers: new Headers({
        "Content-Disposition": 'attachment; filename="traffic_data.xlsx"',
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
