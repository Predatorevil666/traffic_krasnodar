"use client"

import { useEffect, useRef, useState } from "react"
import { getTrafficData, getAccidentData } from "@/lib/mock-data"
import { TrafficLegend } from "./traffic-legend"
import Script from "next/script"

declare global {
  interface Window {
    ymaps: any
  }
}

export default function YandexMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [trafficLevel, setTrafficLevel] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [placemarks, setPlacemarks] = useState<any[]>([])
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [scriptError, setScriptError] = useState<string | null>(null)

  // Обработчик загрузки скрипта
  const handleScriptLoad = () => {
    console.log("Скрипт Яндекс.Карт загружен")
    setScriptLoaded(true)
  }

  const handleScriptError = () => {
    console.error("Ошибка загрузки скрипта Яндекс.Карт")
    setScriptError("Не удалось загрузить API Яндекс.Карт")
  }

  // Инициализация карты после загрузки API
  useEffect(() => {
    if (!scriptLoaded || !mapRef.current) return

    console.log("Инициализация карты...")

    // Проверяем, доступен ли объект ymaps
    if (!window.ymaps) {
      console.error("Объект ymaps не найден")
      setScriptError("API Яндекс.Карт недоступно")
      return
    }

    // Инициализация карты
    const initMap = () => {
      try {
        console.log("Создание экземпляра карты...")
        const map = new window.ymaps.Map(mapRef.current, {
          center: [55.751244, 37.618423], // Москва
          zoom: 11,
          controls: ["zoomControl", "fullscreenControl"],
        })

        console.log("Карта создана успешно")
        setMapInstance(map)
        setMapLoaded(true)
      } catch (error) {
        console.error("Ошибка при инициализации карты:", error)
        setScriptError(`Ошибка инициализации карты: ${error}`)
      }
    }

    // Используем ymaps.ready для гарантии загрузки всех компонентов
    window.ymaps.ready(initMap)

    return () => {
      if (mapInstance) {
        console.log("Уничтожение экземпляра карты")
        mapInstance.destroy()
      }
    }
  }, [scriptLoaded])

  // Добавление слоя пробок и маркеров ДТП
  useEffect(() => {
    if (!mapLoaded || !mapInstance) return

    try {
      console.log("Добавление слоя пробок...")
      // Добавляем слой пробок
      const trafficLayer = new window.ymaps.traffic.provider.Actual({}, { autoUpdate: true })
      trafficLayer.setMap(mapInstance)

      // Получаем данные о ДТП
      console.log("Добавление маркеров ДТП...")
      const accidentData = getAccidentData()

      const newPlacemarks = accidentData.map((accident) => {
        // Определяем цвет в зависимости от серьезности ДТП
        let iconColor = "islands#yellowIcon"
        if (accident.severity === "medium") {
          iconColor = "islands#orangeIcon"
        } else if (accident.severity === "high") {
          iconColor = "islands#redIcon"
        }

        // Создаем метку
        const placemark = new window.ymaps.Placemark(
          [accident.lat, accident.lng],
          {
            balloonContentHeader: `ДТП #${accident.id}`,
            balloonContentBody: accident.description,
            balloonContentFooter: `Время: ${accident.time}`,
            hintContent: "ДТП",
          },
          {
            preset: iconColor,
          },
        )

        // Добавляем метку на карту
        mapInstance.geoObjects.add(placemark)
        return placemark
      })

      setPlacemarks(newPlacemarks)
      console.log("Маркеры ДТП добавлены успешно")
    } catch (error) {
      console.error("Ошибка при добавлении объектов на карту:", error)
    }
  }, [mapLoaded, mapInstance])

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
      <Script
        src="https://api-maps.yandex.ru/2.1/?apikey=ваш_API_ключ&lang=ru_RU"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
        strategy="afterInteractive"
      />

      {scriptError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <p className="text-red-500">{scriptError}</p>
        </div>
      )}

      <div ref={mapRef} className="w-full h-full" style={{ minHeight: "500px", border: "1px solid #ccc" }} />

      {/* Легенда с уровнем загруженности */}
      <TrafficLegend
        level={trafficLevel}
        time={currentTime.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
      />
    </div>
  )
}
