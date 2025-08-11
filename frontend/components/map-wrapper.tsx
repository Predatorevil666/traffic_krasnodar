"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

// Динамически импортируем компонент карты с отключенным SSR
// const YandexMap = dynamic(() => import("@/components/yandex-map"), {
//   ssr: false,
//   loading: () => (
//     <div className="w-full h-full flex items-center justify-center bg-gray-100">
//       <p className="text-lg text-gray-500">Загрузка карты...</p>
//     </div>
//   ),
// })

// Используем iframe версию карты
const YandexMapIframe = dynamic(() => import("@/components/yandex-map-iframe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <p className="text-lg text-gray-500">Загрузка карты...</p>
    </div>
  ),
})

export default function MapWrapper() {
  // Используем состояние для отслеживания, загружен ли компонент на клиенте
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-500">Загрузка карты...</p>
      </div>
    )
  }

  // Используем iframe версию карты
  return <YandexMapIframe />
}
