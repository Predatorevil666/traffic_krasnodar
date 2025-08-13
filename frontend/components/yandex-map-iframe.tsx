"use client";

import { useEffect, useState, useRef } from "react";
// import { getTrafficData } from "@/lib/mock-data";
import { TrafficLegend } from "./traffic-legend";

export default function YandexMapIframe() {
  const [trafficLevel, setTrafficLevel] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const lastSavedHour = useRef<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "TRAFFIC_SCORE_UPDATE") {
        setTrafficLevel(event.data.payload.score);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // const saveHourlyData = async (date: string, level: number, time: string) => {
  //   try {
  //     const response = await fetch("/api/save-traffic-hourly", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ date, level, time }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || "Ошибка сохранения");
  //     }

  //     console.log("Данные сохранены за час:", { date, level, time });
  //   } catch (error) {
  //     console.error("Ошибка сохранения данных:", error);
  //   }
  // };

  const saveMinuteData = async (data: Omit<TrafficRecord, "id">) => {
    try {
      const response = await fetch("/api/save-traffic-minute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.details || "Ошибка сохранения");
      }

      const result = await response.json();
      console.log("Данные сохранены с ID:", result.newId);
    } catch (error) {
      console.error("Ошибка сохранения данных:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date();
      setCurrentTime(newTime);

      // Формируем запись без ID
      const minuteRecord = {
        date: newTime.toLocaleDateString("ru-RU"),
        time: newTime.toLocaleTimeString("ru-RU"),
        level: trafficLevel,
      };

      saveMinuteData(minuteRecord);

      const currentHour = newTime.getHours();
      if (lastSavedHour.current !== currentHour) {
        lastSavedHour.current = currentHour;

        const dateStr = newTime.toISOString().split("T")[0];
        const timeStr = `${currentHour.toString().padStart(2, "0")}:00:00`;

        // saveHourlyData(dateStr, trafficLevel, timeStr);
      }
    }, 60000);

    const now = new Date();
    lastSavedHour.current = now.getHours();

    return () => clearInterval(interval);
  }, [trafficLevel]);

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
      <iframe
        src="/traffic-map/index.html"
        width="0"
        height="0"
        style={{ display: "none" }}
      />

      <TrafficLegend
        level={trafficLevel}
        time={currentTime.toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      />
    </div>
  );
}

// Тип для записи о трафике
type TrafficRecord = {
  id: number;
  date: string;
  time: string;
  level: number;
  timestamp: number;
};
