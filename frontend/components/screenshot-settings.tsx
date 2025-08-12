"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect } from "react"

interface ScreenshotSettingsProps {
	onClose: () => void
}

export function ScreenshotSettings({ onClose }: ScreenshotSettingsProps) {
	const [enabled, setEnabled] = useState(true)
	const [interval, setInterval] = useState("60") // По умолчанию 60 минут
	const [startTime, setStartTime] = useState("06:00")
	const [endTime, setEndTime] = useState("19:00")
	const [isLoading, setIsLoading] = useState(false)

	// Загружаем сохраненные настройки при открытии компонента
	useEffect(() => {
		const loadSettings = async () => {
			try {
				const response = await fetch('/api/screenshot/settings')
				if (response.ok) {
					const data = await response.json()
					if (data.success) {
						setEnabled(data.settings.enabled)
						setInterval(data.settings.interval.toString())
						setStartTime(data.settings.startTime)
						setEndTime(data.settings.endTime)
						console.log('Settings loaded:', data.settings)
					}
				}
			} catch (error) {
				console.log('Could not load settings, using defaults')
			}
		}
		loadSettings()
	}, [])

	const handleSave = async () => {
		setIsLoading(true)
		console.log('Saving settings:', { enabled, interval, startTime, endTime });
		try {
			const response = await fetch('/api/screenshot/configure', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					enabled,
					interval,
					startTime,
					endTime,
				}),
			})

			const result = await response.json()

			if (result.success) {
				console.log('Screenshot settings saved successfully')
				onClose()
			} else {
				console.error('Failed to save settings:', result.error)
			}
		} catch (error) {
			console.error('Error saving screenshot settings:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleTakeScreenshot = async () => {
		setIsLoading(true)
		try {
			const response = await fetch('/api/screenshot/take', {
				method: 'POST',
			})

			const result = await response.json()

			if (result.success) {
				console.log('Screenshot taken successfully:', result.filename)
			} else {
				console.error('Failed to take screenshot:', result.error)
			}
		} catch (error) {
			console.error('Error taking screenshot:', error)
		} finally {
			setIsLoading(false)
		}
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
					<select
						id="interval"
						value={interval}
						onChange={(e) => {
							console.log('Interval changed to:', e.target.value);
							setInterval(e.target.value);
						}}
						disabled={!enabled}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="1">1 минута (тест)</option>
						<option value="5">5 минут (тест)</option>
						<option value="30">30 минут</option>
						<option value="60">1 час</option>
						<option value="120">2 часа</option>
					</select>
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

				<div className="pt-4 border-t">
					<Button
						variant="outline"
						onClick={handleTakeScreenshot}
						disabled={isLoading}
						className="w-full"
					>
						{isLoading ? "Создание скриншота..." : "Сделать скриншот сейчас"}
					</Button>
				</div>
			</CardContent>
			<CardFooter className="px-0 pt-2 flex justify-end gap-2">
				<Button variant="outline" onClick={onClose} disabled={isLoading}>
					Отмена
				</Button>
				<Button onClick={handleSave} disabled={isLoading}>
					{isLoading ? "Сохранение..." : "Сохранить"}
				</Button>
			</CardFooter>
		</Card>
	)
}