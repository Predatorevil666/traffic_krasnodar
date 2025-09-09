"use client"

import { useEffect } from 'react'

export default function YandexMapPage() {
	useEffect(() => {
		// Добавляем скрипт Яндекс.Карт
		const script = document.createElement('script')
		script.src = `https://api-maps.yandex.ru/2.1/?apikey=${process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || '7c99fc7b-a6c3-49ec-9fa2-58cd9ead04eb'}&lang=ru_RU`
		script.onload = initializeMap
		document.head.appendChild(script)

		return () => {
			document.head.removeChild(script)
		}
	}, [])

	const initializeMap = () => {
		if (typeof window !== 'undefined' && (window as any).ymaps) {
			const ymaps = (window as any).ymaps

			ymaps.ready(() => {
				console.log("API Яндекс.Карт загружен")

				// Создаем карту
				const map = new ymaps.Map("map", {
					center: [45.035470, 39.025650], // Краснодар
					zoom: 10,
					controls: []
				})

				// Добавляем контрол пробок
				console.log("Добавляем контрол пробок")
				const trafficControl = new ymaps.control.TrafficControl({
					shown: true,
					providerKey: 'traffic#actual'
				})
				map.controls.add(trafficControl)

				// Принудительно активируем пробки
				setTimeout(() => {
					console.log("Активируем пробки принудительно")
					trafficControl.showTraffic()

					try {
						const isShown = trafficControl.isTrafficShown()
						console.log("Пробки активированы: " + isShown)
					} catch (e) {
						console.log("Ошибка при проверке статуса пробок: " + e)
					}
				}, 1000)

				// Функция извлечения балла пробок из текста
				const extractTrafficScore = (text: string) => {
					const match = text.match(/(\d+)\s+балл(а|ов)?/)
					if (match && match[1]) {
						return match[1]
					}
					return null
				}

				// Функция проверки и обновления балла пробок
				const checkTrafficScore = () => {
					// Ищем элементы пробок по частичному совпадению класса
					const trafficElements = document.querySelectorAll('[class*="traffic"]')

					for (let i = 0; i < trafficElements.length; i++) {
						const element = trafficElements[i] as HTMLElement
						const text = element.textContent || ''

						// Извлекаем балл пробок
						const score = extractTrafficScore(text)
						if (score) {
							console.log("Найден балл пробок: " + score)
							const infoElement = document.getElementById('info')
							if (infoElement) {
								infoElement.textContent = "Балл пробок: " + score
							}
							return true
						}
					}

					console.log("Балл пробок не найден")
					return false
				}

				// Регулярно проверяем балл пробок
				const checkInterval = setInterval(() => {
					if (checkTrafficScore()) {
						// Если нашли балл пробок, сокращаем интервал проверки
						clearInterval(checkInterval)
						setInterval(checkTrafficScore, 10000) // Проверяем каждые 10 секунд
					}
				}, 2000)

				// Прекращаем активную проверку через 30 секунд
				setTimeout(() => {
					clearInterval(checkInterval)
				}, 30000)
			})
		}
	}

	return (
		<div style={{ width: '100%', height: '100vh' }}>
			<div id="info" style={{
				position: 'absolute',
				top: '10px',
				left: '10px',
				zIndex: 1000,
				background: 'white',
				padding: '10px',
				borderRadius: '5px',
				boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
			}}>
				Загрузка карты...
			</div>
			<div
				id="map"
				style={{
					width: '100%',
					height: '100%',
					minHeight: '500px'
				}}
			/>
		</div>
	)
}
