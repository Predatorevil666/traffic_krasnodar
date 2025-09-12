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
					zoom: 13, // Увеличиваем масштаб для детального вида
					controls: []
				})

				// Добавляем контрол пробок
				console.log("Добавляем контрол пробок")
				const trafficControl = new ymaps.control.TrafficControl({
					shown: true,
					providerKey: 'traffic#actual',
					state: {
						providerKey: 'traffic#actual',
						trafficShown: true
					}
				})
				map.controls.add(trafficControl)

				// Принудительно активируем пробки
				setTimeout(() => {
					console.log("Активируем пробки принудительно")
					trafficControl.showTraffic()

					// Дополнительно включаем пробки через провайдер
					map.layers.add('traffic#actual')

					// Включаем дорожные события через слой карты
					console.log("Включаем дорожные события")
					try {
						// Добавляем слой дорожных событий
						map.layers.add('traffic#events')
						console.log("Слой дорожных событий добавлен")

						// Альтернативный способ - через провайдер
						const eventsProvider = ymaps.traffic.provider.Actual
						if (eventsProvider) {
							map.layers.add(eventsProvider.getEventsLayer())
							console.log("Слой событий через провайдер добавлен")
						}
					} catch (e) {
						console.log("Ошибка при добавлении событий:", e)
					}

					// Проверяем статус слоев и пытаемся кликнуть на кнопки событий
					setTimeout(() => {
						const layers = map.layers.getAll()
						console.log("Активные слои карты:", layers.length)
						layers.forEach((layer: any, index: number) => {
							console.log(`Слой ${index}:`, layer.toString())
						})

						// Пытаемся найти и кликнуть чекбокс дорожных событий
						try {
							// Ищем чекбокс дорожных событий в правой панели
							let foundEventsCheckbox = false

							// Ищем все чекбоксы
							const checkboxes = document.querySelectorAll('input[type="checkbox"]')
							console.log(`Найдено чекбоксов: ${checkboxes.length}`)

							checkboxes.forEach((checkbox, i) => {
								const label = checkbox.parentElement
								const labelText = label?.textContent || ''
								console.log(`Чекбокс ${i}: "${labelText}", checked: ${(checkbox as HTMLInputElement).checked}`)

								if ((labelText.includes('события') || labelText.includes('События')) &&
									!(checkbox as HTMLInputElement).checked) {
									console.log("Найден НЕ отмеченный чекбокс дорожных событий, кликаем!")
										; (checkbox as HTMLElement).click()
									foundEventsCheckbox = true
								}
							})

							if (!foundEventsCheckbox) {
								console.log("Чекбокс дорожных событий не найден, пробуем другие способы...")

								// Способ 1: Поиск по тексту "Дорожные события"
								const textElements = document.querySelectorAll('*')
								for (let i = 0; i < textElements.length; i++) {
									const element = textElements[i]
									const text = element.textContent || ''
									if (text.includes('Дорожные события') || text.includes('дорожные события')) {
										console.log("Найден элемент с текстом 'Дорожные события':", element.tagName, element.className)
										const checkbox = element.querySelector('input[type="checkbox"]') ||
											element.parentElement?.querySelector('input[type="checkbox"]')
										if (checkbox && !(checkbox as HTMLInputElement).checked) {
											console.log("Кликаем по чекбоксу дорожных событий через текст")
												; (checkbox as HTMLElement).click()
											foundEventsCheckbox = true
											break
										}
									}
								}

								// Способ 2: Если не нашли, пробуем кликнуть по второму чекбоксу (обычно события идут вторыми)
								if (!foundEventsCheckbox) {
									const allCheckboxes = document.querySelectorAll('input[type="checkbox"]:not(:checked)')
									if (allCheckboxes.length > 0) {
										console.log(`Пробуем кликнуть по первому неотмеченному чекбоксу из ${allCheckboxes.length}`)
											; (allCheckboxes[0] as HTMLElement).click()
										foundEventsCheckbox = true
									}
								}

								// Способ 3: Поиск по классам Яндекс карт
								if (!foundEventsCheckbox) {
									const ymapsCheckboxes = document.querySelectorAll('[class*="ymaps"] input[type="checkbox"]:not(:checked)')
									if (ymapsCheckboxes.length > 0) {
										console.log(`Найдены ymaps чекбоксы: ${ymapsCheckboxes.length}, кликаем по первому`)
											; (ymapsCheckboxes[0] as HTMLElement).click()
									}
								}
							}
						} catch (e) {
							console.log("Ошибка при поиске чекбокса:", e)
						}
					}, 3000)

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
