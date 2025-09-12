"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Camera, FileDown } from "lucide-react"
import { useState, useEffect } from "react"
import { ScreenshotSettings } from "./screenshot-settings"
import { TrafficExport } from "./traffic-export"

export function Header() {
	const [isScreenshotOpen, setIsScreenshotOpen] = useState(false)
	const [isExportOpen, setIsExportOpen] = useState(false)
	const [screenshotStatus, setScreenshotStatus] = useState(null)
	const [currentDateTime, setCurrentDateTime] = useState('')

	// Загружаем статус при монтировании компонента
	useEffect(() => {
		const loadStatus = async () => {
			try {
				const response = await fetch('/api/screenshot/status')
				if (response.ok) {
					const data = await response.json()
					if (data.success) {
						setScreenshotStatus(data.status)
					}
				}
			} catch (error) {
				console.log('Could not load screenshot status')
			}
		}

		loadStatus()

		// Обновляем статус каждые 30 секунд
		const interval = setInterval(loadStatus, 30000)

		return () => clearInterval(interval)
	}, [])

	// Обновляем дату и время каждую секунду
	useEffect(() => {
		const updateDateTime = () => {
			const now = new Date()
			const day = String(now.getDate()).padStart(2, '0')
			const month = String(now.getMonth() + 1).padStart(2, '0')
			const year = now.getFullYear()
			const hours = String(now.getHours()).padStart(2, '0')
			const minutes = String(now.getMinutes()).padStart(2, '0')
			const seconds = String(now.getSeconds()).padStart(2, '0')
			
			setCurrentDateTime(`${day}/${month}/${year} ${hours}:${minutes}:${seconds}`)
		}

		// Обновляем сразу
		updateDateTime()

		// Обновляем каждую секунду
		const interval = setInterval(updateDateTime, 1000)

		return () => clearInterval(interval)
	}, [])

	return (
		<div className="w-full bg-white shadow-md p-2 flex items-center justify-between z-10">
			<div className="flex items-center gap-2 flex-1">
				<h1 className="text-xl font-bold">Управление дорожным движением</h1>
			</div>

			{/* Дата и время по центру */}
			<div className="flex items-center justify-center flex-1">
				<div className="text-lg font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-md border">
					{currentDateTime}
				</div>
			</div>

			<div className="flex items-center gap-2 flex-1 justify-end">
				<Popover open={isScreenshotOpen} onOpenChange={setIsScreenshotOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className={`relative ${screenshotStatus?.enabled && screenshotStatus?.isInWorkingHours
									? 'border-green-500 bg-green-50 hover:bg-green-100'
									: screenshotStatus?.enabled
										? 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100'
										: ''
								}`}
						>
							<Camera className={`h-4 w-4 ${screenshotStatus?.enabled && screenshotStatus?.isInWorkingHours
									? 'text-green-600'
									: screenshotStatus?.enabled
										? 'text-yellow-600'
										: ''
								}`} />
							{screenshotStatus?.enabled && screenshotStatus?.isInWorkingHours && (
								<div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[360px] z-[2000]" align="end" sideOffset={5}>
						<ScreenshotSettings onClose={() => setIsScreenshotOpen(false)} />
					</PopoverContent>
				</Popover>

				<Popover open={isExportOpen} onOpenChange={setIsExportOpen}>
					<PopoverTrigger asChild>
						<Button variant="outline" size="icon">
							<FileDown className="h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[400px] z-[2000]" align="end" sideOffset={5}>
						<TrafficExport onClose={() => setIsExportOpen(false)} />
					</PopoverContent>
				</Popover>
			</div>
		</div>
	)
}
