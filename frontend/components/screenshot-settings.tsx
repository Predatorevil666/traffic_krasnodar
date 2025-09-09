"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { CheckCircle, Clock, Camera, AlertCircle, Play, Pause, Square } from "lucide-react"

interface ScreenshotSettingsProps {
	onClose: () => void
}

export function ScreenshotSettings({ onClose }: ScreenshotSettingsProps) {
	const [serviceState, setServiceState] = useState("stopped") // stopped, running, paused
	const [interval, setInterval] = useState("60") // По умолчанию 60 минут
	const [startTime, setStartTime] = useState("06:00")
	const [endTime, setEndTime] = useState("19:00")
	const [isLoading, setIsLoading] = useState(false)
	const [status, setStatus] = useState(null)
	const [successMessage, setSuccessMessage] = useState("")

	// Загружаем настройки и статус при открытии компонента
	useEffect(() => {
		const loadData = async () => {
			try {
				// Загружаем настройки
				const settingsResponse = await fetch('/api/screenshot/settings')
				if (settingsResponse.ok) {
					const settingsData = await settingsResponse.json()
					if (settingsData.success) {
						setServiceState(settingsData.settings.enabled ? "running" : "stopped")
						setInterval(settingsData.settings.interval.toString())
						setStartTime(settingsData.settings.startTime)
						setEndTime(settingsData.settings.endTime)
					}
				}

				// Загружаем статус
				const statusResponse = await fetch('/api/screenshot/status')
				if (statusResponse.ok) {
					const statusData = await statusResponse.json()
					if (statusData.success) {
						setStatus(statusData.status)
					}
				}
			} catch (error) {
				console.log('Could not load data, using defaults')
			}
		}
		loadData()
	}, [])

	const handleServiceControl = async (action: "start" | "pause" | "stop") => {
		setIsLoading(true)
		try {
			const enabled = action === "start" || action === "pause"
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
					state: action === "pause" ? "paused" : (enabled ? "running" : "stopped")
				}),
			})

			const result = await response.json()

			if (result.success) {
				setServiceState(action === "start" ? "running" : action === "pause" ? "paused" : "stopped")
				setSuccessMessage(
					action === "start" ? 'Сервис запущен!' :
						action === "pause" ? 'Сервис приостановлен!' :
							'Сервис остановлен!'
				)

				// Обновляем статус после изменения
				const statusResponse = await fetch('/api/screenshot/status')
				if (statusResponse.ok) {
					const statusData = await statusResponse.json()
					if (statusData.success) {
						setStatus(statusData.status)
					}
				}

				// Убираем сообщение через 3 секунды
				setTimeout(() => setSuccessMessage(""), 3000)
			} else {
				console.error('Failed to control service:', result.error)
			}
		} catch (error) {
			console.error('Error controlling screenshot service:', error)
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
				setSuccessMessage('Скриншот создан успешно!')

				// Обновляем статус после создания скриншота
				const statusResponse = await fetch('/api/screenshot/status')
				if (statusResponse.ok) {
					const statusData = await statusResponse.json()
					if (statusData.success) {
						setStatus(statusData.status)
					}
				}

				// Убираем сообщение через 3 секунды
				setTimeout(() => setSuccessMessage(""), 3000)
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
				<CardDescription>Настройте параметры автоматических скриншотов карты и записи балла пробок</CardDescription>
			</CardHeader>
			<CardContent className="px-0 space-y-4">
				{/* Кнопки управления сервисом */}
				<div className="space-y-2">
					<Label>Управление сервисом</Label>
					<div className="flex gap-2">
						<Button
							variant={serviceState === "running" ? "default" : "outline"}
							size="sm"
							onClick={() => handleServiceControl("start")}
							disabled={isLoading || serviceState === "running"}
							className="flex items-center gap-1"
						>
							<Play className="h-3 w-3" />
							Старт
						</Button>
						<Button
							variant={serviceState === "paused" ? "default" : "outline"}
							size="sm"
							onClick={() => handleServiceControl("pause")}
							disabled={isLoading || serviceState === "stopped"}
							className="flex items-center gap-1"
						>
							<Pause className="h-3 w-3" />
							Пауза
						</Button>
						<Button
							variant={serviceState === "stopped" ? "default" : "outline"}
							size="sm"
							onClick={() => handleServiceControl("stop")}
							disabled={isLoading || serviceState === "stopped"}
							className="flex items-center gap-1"
						>
							<Square className="h-3 w-3" />
							Стоп
						</Button>
					</div>
				</div>

				{/* Блок статуса */}
				{status && (
					<div className="bg-gray-50 p-3 rounded-lg space-y-2">
						<div className="flex items-center gap-2">
							{serviceState === "running" ? (
								status.isInWorkingHours ? (
									<>
										<CheckCircle className="h-4 w-4 text-green-500" />
										<span className="text-sm font-medium text-green-700">Активен</span>
									</>
								) : (
									<>
										<Clock className="h-4 w-4 text-yellow-500" />
										<span className="text-sm font-medium text-yellow-700">Ожидание рабочего времени</span>
									</>
								)
							) : serviceState === "paused" ? (
								<>
									<Pause className="h-4 w-4 text-orange-500" />
									<span className="text-sm font-medium text-orange-700">Приостановлен</span>
								</>
							) : (
								<>
									<Square className="h-4 w-4 text-gray-500" />
									<span className="text-sm font-medium text-gray-600">Остановлен</span>
								</>
							)}
						</div>

						<div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
							<div>
								<div className="font-medium">Всего скриншотов:</div>
								<div>{status.totalScreenshots}</div>
							</div>
							<div>
								<div className="font-medium">За сегодня:</div>
								<div>{status.todayScreenshots}</div>
							</div>
							<div>
								<div className="font-medium">Записей о пробках:</div>
								<div>{status.totalTrafficRecords || 0}</div>
							</div>
							<div>
								<div className="font-medium">Средний балл сегодня:</div>
								<div>{status.averageTrafficLevel !== null ? status.averageTrafficLevel : 'Нет данных'}</div>
							</div>
						</div>

						{status.lastScreenshot && (
							<div className="text-xs text-gray-600">
								<div className="font-medium">Последний скриншот:</div>
								<div>{new Date(status.lastScreenshot.created).toLocaleString('ru-RU')}</div>
							</div>
						)}
					</div>
				)}

				{/* Сообщение об успехе */}
				{successMessage && (
					<div className="bg-green-50 border border-green-200 p-2 rounded-lg">
						<div className="flex items-center gap-2">
							<CheckCircle className="h-4 w-4 text-green-500" />
							<span className="text-sm text-green-700">{successMessage}</span>
						</div>
					</div>
				)}

				<div className="space-y-2">
					<Label htmlFor="interval">Интервал (минуты)</Label>
					<select
						id="interval"
						value={interval}
						onChange={(e) => {
							console.log('Interval changed to:', e.target.value);
							setInterval(e.target.value);
						}}
						disabled={serviceState !== "stopped"}
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
							disabled={serviceState !== "stopped"}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="end-time">Время окончания</Label>
						<Input
							id="end-time"
							type="time"
							value={endTime}
							onChange={(e) => setEndTime(e.target.value)}
							disabled={serviceState !== "stopped"}
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
			<CardFooter className="px-0 pt-2 flex justify-end">
				<Button variant="outline" onClick={onClose} disabled={isLoading}>
					Закрыть
				</Button>
			</CardFooter>
		</Card>
	)
}