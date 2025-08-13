// app/api/save-traffic-hourly/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { date, level, time } = await req.json();
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "hourly-data.json");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    let hourlyData = [];
    if (fs.existsSync(filePath)) {
      hourlyData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    hourlyData.push({ date, level, time });
    fs.writeFileSync(filePath, JSON.stringify(hourlyData, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving hourly data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
