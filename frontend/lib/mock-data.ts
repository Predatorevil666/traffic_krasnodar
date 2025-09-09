// Функция для получения данных о загруженности дорог
export function getTrafficData(date: Date) {
  // В реальном приложении здесь был бы запрос к API
  // Для прототипа генерируем случайные данные

  const hour = date.getHours()

  // Имитируем пики загруженности в утренние и вечерние часы
  let baseLevel = 0

  if (hour >= 7 && hour <= 10) {
    // Утренний час пик
    baseLevel = 7
  } else if (hour >= 17 && hour <= 20) {
    // Вечерний час пик
    baseLevel = 8
  } else if ((hour >= 11 && hour <= 16) || (hour >= 21 && hour <= 23)) {
    // Дневное и вечернее время
    baseLevel = 4
  } else {
    // Ночное время
    baseLevel = 1
  }

  // Добавляем случайное отклонение
  const randomVariation = Math.floor(Math.random() * 3) - 1
  const level = Math.max(0, Math.min(10, baseLevel + randomVariation))

  return {
    date: date.toISOString(),
    level,
    timestamp: date.getTime(),
  }
}

// Функция для получения данных о ДТП
export function getAccidentData() {
  // В реальном приложении здесь был бы запрос к API 2GIS
  // Для прототипа возвращаем фиктивные данные

  return [
    {
      id: "A1234",
      lat: 55.751244,
      lng: 37.618423,
      description: "Столкновение двух автомобилей",
      time: "10:15",
      severity: "medium",
    },
    {
      id: "B5678",
      lat: 55.761244,
      lng: 37.628423,
      description: "Наезд на пешехода",
      time: "11:30",
      severity: "high",
    },
    {
      id: "C9012",
      lat: 55.741244,
      lng: 37.608423,
      description: "Мелкое ДТП без пострадавших",
      time: "09:45",
      severity: "low",
    },
  ]
}

// Функция для получения исторических данных о загруженности
export function getHistoricalTrafficData(startDate: Date, endDate: Date) {
  const data = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    for (let hour = 0; hour < 24; hour++) {
      currentDate.setHours(hour, 0, 0, 0)

      if (currentDate <= endDate) {
        data.push(getTrafficData(new Date(currentDate)))
      }
    }

    // Переходим к следующему дню
    currentDate.setDate(currentDate.getDate() + 1)
    currentDate.setHours(0, 0, 0, 0)
  }

  return data
}
