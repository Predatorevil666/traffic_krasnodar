"use client"

interface TrafficLegendProps {
  level: number
  time: string
}

export function TrafficLegend({ level, time }: TrafficLegendProps) {
  // Определяем цвет и описание в зависимости от уровня загруженности
  const getTrafficInfo = (level: number) => {
    if (level <= 2) {
      return { color: "bg-green-500", text: "Дороги свободны" }
    } else if (level <= 5) {
      return { color: "bg-yellow-500", text: "Небольшие затруднения" }
    } else if (level <= 7) {
      return { color: "bg-orange-500", text: "Движение затруднено" }
    } else {
      return { color: "bg-red-500", text: "Серьезные пробки" }
    }
  }

  const { color, text } = getTrafficInfo(level)

  return null
}
