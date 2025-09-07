// test-export.js
const fs = require("fs");
const path = require("path");

// Конфигурация теста
const TEST_CONFIG = {
  baseUrl: "http://localhost:3000",
  outputDir: "./test-exports",
};

// Создаем директорию для тестовых файлов
if (!fs.existsSync(TEST_CONFIG.outputDir)) {
  fs.mkdirSync(TEST_CONFIG.outputDir, { recursive: true });
}

// Функция для тестирования экспорта
async function testExport() {
  console.log("Starting export test...");

  try {
    // 1. Сначала добавим тестовые данные
    console.log("Adding test data...");
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const testData = {
      date: yesterday.toLocaleDateString("ru-RU"),
      time: "12:00:00",
      level: 5,
    };

    // Добавляем тестовые данные через API
    const addResponse = await fetch(
      `${TEST_CONFIG.baseUrl}/api/save-traffic-minute`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      }
    );

    if (!addResponse.ok) {
      throw new Error(`Failed to add test data: ${addResponse.statusText}`);
    }

    const addResult = await addResponse.json();
    console.log("Test data added with ID:", addResult.newId);

    // 2. Тестируем экспорт за сегодня и вчера
    const todayStr = today.toISOString().split("T")[0];
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    await testExportForDate(todayStr, `export-${todayStr}.xlsx`);
    await testExportForDate(yesterdayStr, `export-${yesterdayStr}.xlsx`);

    // 3. Проверяем содержимое файлов
    checkFiles();

    console.log("Export test completed successfully!");
  } catch (error) {
    console.error("Test failed:", error.message);
    process.exit(1);
  }
}

// Функция для тестирования экспорта по конкретной дате
async function testExportForDate(date, filename) {
  console.log(`Testing export for ${date}...`);

  const response = await fetch(`${TEST_CONFIG.baseUrl}/api/export`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startDate: date,
      endDate: date,
    }),
  });

  if (!response.ok) {
    throw new Error(`Export failed for ${date}: ${response.statusText}`);
  }

  // Используем arrayBuffer() для нативного fetch в Node.js 18+
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filePath = path.join(TEST_CONFIG.outputDir, filename);
  fs.writeFileSync(filePath, buffer);

  console.log(`Export for ${date} saved to: ${filePath}`);
}

// Функция для проверки файлов
function checkFiles() {
  console.log("Checking file contents...");

  const files = fs.readdirSync(TEST_CONFIG.outputDir);
  let allFilesValid = true;

  for (const file of files) {
    const filePath = path.join(TEST_CONFIG.outputDir, file);
    const stats = fs.statSync(filePath);

    if (stats.size === 0) {
      console.log(`✗ File ${file} is empty`);
      allFilesValid = false;
    } else {
      console.log(`✓ File ${file} is valid (${stats.size} bytes)`);
    }
  }

  if (allFilesValid) {
    console.log("✓ All export files are valid and contain data");
  } else {
    console.log("✗ Some export files are empty");
  }
}

// Запускаем тест
testExport();
