"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

interface ScreenshotSettingsProps {
  onClose: () => void
}

export function ScreenshotSettings({ onClose }: ScreenshotSettingsProps) {
  const [enabled, setEnabled] = useState(true)
  const [interval, setInterval] = useState("60")
  const [startTime, setStartTime] = useState("06:00")
  const [endTime, setEndTime] = useState("19:00")

  const handleSave = () => {
    // В реальном приложении здесь был бы код для сохранения настроек
    console.log({
      enabled,
      interval,
      startTime,
      endTime,
    })
    onClose()
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Настройки скриншотов</CardTitle>
        <CardDescription>Настройте параметры автоматических скриншотов карты</CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-screenshots">Автоматические скриншоты</Label>
          <Switch id="auto-screenshots" checked={enabled} onCheckedChange={setEnabled} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interval">Интервал (минуты)</Label>
          <Select value={interval} onValueChange={setInterval} disabled={!enabled}>
            <SelectTrigger id="interval">
              <SelectValue placeholder="Выберите интервал" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 минут</SelectItem>
              <SelectItem value="60">1 час</SelectItem>
              <SelectItem value="120">2 часа</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-time">Время начала</Label>
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              disabled={!enabled}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-time">Время окончания</Label>
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              disabled={!enabled}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-0 pt-2 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Отмена
        </Button>
        <Button onClick={handleSave}>Сохранить</Button>
      </CardFooter>
    </Card>
  )
}
