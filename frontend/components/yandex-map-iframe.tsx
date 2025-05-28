"use client"

import { useEffect, useState } from "react"
import { getTrafficData } from "@/lib/mock-data"
import { TrafficLegend } from "./traffic-legend"

export default function YandexMapIframe() {
  const [trafficLevel, setTrafficLevel] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Имитация обновления данных о пробках каждую минуту
  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date()
      setCurrentTime(newTime)

      // Получаем данные о пробках
      const trafficData = getTrafficData(newTime)
      setTrafficLevel(trafficData.level)
    }, 60000)

    // Инициализация данных
    const trafficData = getTrafficData(new Date())
    setTrafficLevel(trafficData.level)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-full">
      <iframe
        src="https://yandex.ru/map-widget/v1/?um=constructor%3Ac52db986d8148a57acd7f6f0af9791aacdd1675b4e6fe5eedb315d84d7cde46b&amp;source=constructor"
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ minHeight: "500px", height: "calc(100vh - 60px)" }}
        title="Яндекс Карта"
        allow="geolocation"
      />

      {/* Легенда с уровнем загруженности */}
      <TrafficLegend
        level={trafficLevel}
        time={currentTime.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
      />
    </div>
  )
}
